"""Fetch and normalize public sources for the Daily Brief.

Every source is isolated: a broken feed returns a status entry and never stops
the rest of the run. No credentials are used for any source.
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import os
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus, urljoin

import feedparser
import httpx
from bs4 import BeautifulSoup

from util import (
    HKT, body_text, clamp, clean_html, clean_title, has_body_text, iso,
    load_json, log, log_heat, now_hkt, parse_datetime, summary_matches_title,
    title_similarity, truncate, url_key, write_json_atomic,
)

UA = "Mozilla/5.0 (compatible; BonziliBrief/1.0; +https://bonzili.me/dailybrief/)"
HEADERS = {
    "User-Agent": UA,
    "Accept": "application/rss+xml, application/atom+xml, application/json, text/html;q=0.8, */*;q=0.5",
}
TIMEOUT = httpx.Timeout(30.0, connect=15.0)
CONCURRENCY = 8
CACHE_DIR = Path(__file__).resolve().parent / ".cache"
BENCHMARK_CACHE = CACHE_DIR / "benchmark.json"


def item_id(source_id: str, url: str, title: str) -> str:
    raw = f"{source_id}|{url or title}".encode("utf-8")
    return hashlib.sha1(raw).hexdigest()[:16]


def base_item(source: dict[str, Any], *, title: str, url: str, publisher: str,
              published: datetime | None, summary: str, now: datetime,
              heat: float | None = None, comments: list[dict] | None = None,
              extra: dict | None = None) -> dict[str, Any]:
    # A few feeds publish future-dated items. Treat those as "now" rather than
    # letting them win the freshness score.
    if published is not None and published > now + timedelta(hours=6):
        published = now
    source_tags = source.get("tags")
    if isinstance(source_tags, str):
        source_tags = [source_tags]
    if not isinstance(source_tags, list):
        source_tags = []
    source_tags = [str(value) for value in source_tags if value]
    if not source_tags and source.get("tag"):
        source_tags = [str(source["tag"])]
    item = {
        "id": item_id(source["id"], url, title),
        "source_id": source["id"],
        "source_name": source.get("name") or source["id"],
        "topic": source["topic"],
        "title": clean_title(title, publisher),
        "url": url,
        "publisher": publisher or source.get("name") or source["id"],
        "published": iso(published or now),
        "summary": truncate(clean_html(summary), 1400),
        "lang": source.get("lang", "en"),
        "trust": float(source.get("trust", 0.5)),
        "heat": clamp(float(heat if heat is not None else source.get("heat", 0.18))),
        "comments": comments or [],
        "tag": source.get("tag"),
        "tags": source_tags,
        "always_hk": bool(source.get("always_hk")),
        "no_cluster": bool(source.get("no_cluster")),
        "jurisdiction": source.get("jurisdiction"),
    }
    if extra:
        item.update(extra)
    return item


def strip_news_date_suffix(title: str) -> str:
    """Remove the "- 20261104 - 港聞" suffix Google News adds."""
    return re.sub(r"\s*-\s*\d{8}\s*-\s*[^-]+$", "", str(title or "")).strip()


def contains_keyword(haystack: str, keyword: str) -> bool:
    haystack = str(haystack or "").casefold()
    word = str(keyword or "").casefold().strip()
    if not word:
        return False
    if re.search(r"[\u3400-\u9fff]", word):
        return word in haystack
    # Accept the common plural forms as well: model/models, patch/patches,
    # CVE/CVEs. This keeps keyword filters from silently missing the story.
    return re.search(
        rf"(?<![a-z0-9]){re.escape(word)}(?:s|es)?(?![a-z0-9])", haystack
    ) is not None


def matches_filter(source: dict[str, Any], title: str, summary: str) -> bool:
    haystack = f"{title} {summary}".casefold()
    excludes = source.get("exclude_keywords") or []
    if any(contains_keyword(haystack, keyword) for keyword in excludes):
        return False
    keywords = source.get("filter_keywords") or []
    if not keywords:
        return True
    return any(contains_keyword(haystack, keyword) for keyword in keywords)


def too_old(source: dict[str, Any], published: datetime | None, now: datetime) -> bool:
    if published is None:
        return False
    max_hours = float(source.get("max_age_hours", 14 * 24))
    return (now - published).total_seconds() / 3600.0 > max_hours


async def get(client: httpx.AsyncClient, url: str, **kwargs) -> httpx.Response:
    last_error = None
    for attempt in range(2):
        try:
            response = await client.get(url, **kwargs)
            response.raise_for_status()
            return response
        except httpx.HTTPStatusError as error:
            last_error = error
            if attempt == 0 and error.response.status_code >= 500:
                await asyncio.sleep(1.0)
                continue
            raise
        except (httpx.TimeoutException, httpx.NetworkError, httpx.RemoteProtocolError) as error:
            last_error = error
            if attempt == 0:
                await asyncio.sleep(1.0)
                continue
            raise
    raise last_error or RuntimeError("request failed")


async def fetch_rss(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    response = await get(client, source["url"])
    parsed = feedparser.parse(response.content)
    if parsed.bozo and not parsed.entries:
        raise ValueError(f"feed parse error: {getattr(parsed, 'bozo_exception', 'unknown')}")
    max_items = int(source.get("max_items", 10))
    items: list[dict] = []
    feed_title = clean_html(parsed.feed.get("title") if getattr(parsed, "feed", None) else "")
    for entry in parsed.entries:
        raw_title = entry.get("title") or ""
        entry_source = entry.get("source")
        entry_publisher = ""
        if isinstance(entry_source, dict):
            entry_publisher = clean_html(entry_source.get("title") or "")
        publisher = entry_publisher or feed_title or source.get("name") or source["id"]
        title = clean_title(raw_title, publisher)
        filter_title = title
        if source.get("strip_date_suffix"):
            title = strip_news_date_suffix(title)
        if not title:
            continue
        url = entry.get("link") or entry.get("id") or ""
        if not url:
            continue
        summary = entry.get("summary") or entry.get("description") or ""
        if not summary and entry.get("content"):
            try:
                summary = entry["content"][0].get("value") or ""
            except (IndexError, AttributeError, TypeError):
                summary = ""
        summary = clean_html(summary)
        if source.get("verify_summary") and not summary_matches_title(title, summary):
            log(f"  title/summary mismatch skipped: {title[:90]}")
            continue
        published = parse_datetime(
            entry.get("published_parsed") or entry.get("updated_parsed")
            or entry.get("published") or entry.get("updated"),
            now - timedelta(minutes=30),
        )
        if too_old(source, published, now):
            continue
        if not matches_filter(source, filter_title, summary):
            continue
        items.append(base_item(
            source, title=title, url=url, publisher=publisher,
            published=published, summary=summary, now=now,
        ))
        if len(items) >= max_items:
            break

    # Some feeds (notably Hugging Face) publish titles only. Fetch the article
    # metadata for a handful of items so the summarizer has something grounded
    # to work with instead of a bare headline.
    if source.get("fetch_content") and items:
        limit = max(0, min(len(items), int(source.get("content_limit", 4))))
        for item in items[:limit]:
            if len(item.get("summary") or "") >= 80:
                continue
            try:
                page = await get(
                    client, item["url"],
                    headers={"User-Agent": UA, "Accept": "text/html"},
                    timeout=httpx.Timeout(12.0, connect=6.0),
                )
            except Exception as error:
                log(f"  content fetch failed: {item.get('url', '')[:80]} ({type(error).__name__})")
                continue
            soup = BeautifulSoup(page.text, "html.parser")
            description = ""
            for selector in ('meta[name="description"]', 'meta[property="og:description"]'):
                node = soup.select_one(selector)
                if node and node.get("content"):
                    description = clean_html(node.get("content"))
                    break
            if len(description) < 80:
                for paragraph in soup.select("p"):
                    text = clean_html(paragraph.get_text(" ", strip=True))
                    if len(text) >= 80:
                        description = text
                        break
            if description:
                item["summary"] = truncate(description, 1400)
    return items


async def fetch_google_news(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    query = source["query"]
    hl = source.get("hl", "en-US")
    gl = source.get("gl", "US")
    ceid = source.get("ceid", "US:en")
    when = str(source.get("when") or "").strip()
    url = (
        "https://news.google.com/rss/search?"
        f"q={quote_plus(query)}&hl={quote_plus(hl)}&gl={quote_plus(gl)}&ceid={quote_plus(ceid)}"
    )
    if when:
        url += f"&when={quote_plus(when)}"
    local = dict(source)
    local["url"] = url
    local["name"] = source.get("name", "Google News")
    return await fetch_rss(client, local, now)


async def fetch_hn(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    response = await get(client, "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=50")
    payload = response.json()
    keywords = [str(word).casefold() for word in (source.get("keywords") or [])]
    min_points = int(source.get("min_points", 0))
    max_items = int(source.get("max_items", 10))
    items: list[dict] = []
    for hit in payload.get("hits", []):
        title = clean_html(hit.get("title") or "")
        if not title:
            continue
        points = int(hit.get("points") or 0)
        comments_count = int(hit.get("num_comments") or 0)
        if points < min_points:
            continue
        haystack = title.casefold()
        if keywords and not any(contains_keyword(haystack, word) for word in keywords):
            continue
        summary = clean_html(hit.get("story_text") or title)
        # Topic-level exclude keywords (funding, valuation, stock, ...) must
        # apply here too. HN used its own short keyword list and skipped the
        # shared filter, which let business stories into the AI brief.
        if not matches_filter(source, title, summary):
            continue
        object_id = str(hit.get("objectID") or "")
        url = hit.get("url") or f"https://news.ycombinator.com/item?id={object_id}"
        published = parse_datetime(hit.get("created_at"), now)
        if too_old(source, published, now):
            continue
        heat = log_heat(points + 2 * comments_count, 1200)
        items.append(base_item(
            source, title=title, url=url, publisher="Hacker News",
            published=published, summary=summary,
            now=now, heat=heat,
            extra={
                "hn_id": object_id,
                "hn_points": points,
                "hn_comments": comments_count,
            },
        ))
        if len(items) >= max_items:
            break
    return items


async def fetch_openrouter(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    response = await get(client, "https://openrouter.ai/api/v1/models")
    payload = response.json()
    days = float(source.get("days", 3))
    cutoff = now - timedelta(days=days)
    groups: dict[str, list[dict]] = {}
    for model in payload.get("data", []):
        created = parse_datetime(model.get("created"), None)
        if created is None or created < cutoff:
            continue
        base_id = re.sub(r":(free|batch|thinking|online|extended|floor|nitro|beta)$", "", str(model.get("id") or ""))
        if not base_id:
            continue
        groups.setdefault(base_id, []).append(model)

    max_items = int(source.get("max_items", 6))
    candidates = []
    for base_id, variants in groups.items():
        exact = next((variant for variant in variants if str(variant.get("id")) == base_id), variants[0])
        created = parse_datetime(exact.get("created"), now) or now
        candidates.append((created, base_id, exact))
    candidates.sort(key=lambda row: row[0], reverse=True)

    items: list[dict] = []
    for created, base_id, model in candidates:
        name = clean_html(model.get("name") or base_id)
        context = model.get("context_length")
        pricing = model.get("pricing") or {}
        prompt_price = pricing.get("prompt")
        completion_price = pricing.get("completion")
        details = []
        if context:
            details.append(f"Context window: {int(context):,} tokens.")
        if prompt_price not in (None, "", "0"):
            details.append(f"Prompt price: {prompt_price} per token.")
        if completion_price not in (None, "", "0"):
            details.append(f"Completion price: {completion_price} per token.")
        summary = clean_html(model.get("description") or "")
        if details:
            summary = f"{summary} {' '.join(details)}".strip()
        title = f"New on OpenRouter: {name}"
        if not matches_filter(source, title, summary):
            continue
        items.append(base_item(
            source, title=title, url=f"https://openrouter.ai/{base_id}",
            publisher="OpenRouter", published=created, summary=summary, now=now,
            heat=0.62, extra={"model_id": base_id},
        ))
        if len(items) >= max_items:
            break
    return items


def parse_count(value: Any) -> int:
    digits = re.sub(r"[^0-9]", "", str(value or ""))
    return int(digits) if digits else 0


def github_headers() -> dict[str, str]:
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or ""
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": UA,
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


async def fetch_github_trending(client: httpx.AsyncClient, source: dict[str, Any],
                                now: datetime) -> list[dict]:
    response = await get(
        client,
        source.get("url") or "https://github.com/trending?since=daily",
        headers={"User-Agent": UA, "Accept": "text/html"},
    )
    soup = BeautifulSoup(response.text, "html.parser")
    rows = soup.select("article.Box-row")
    max_items = int(source.get("max_items", 6))
    min_stars_today = int(source.get("min_stars_today", 0))
    items: list[dict] = []
    for row in rows:
        link = row.select_one("h2 a")
        href = (link.get("href") if link else "") or ""
        full_name = href.strip("/")
        if "/" not in full_name:
            continue
        desc_node = row.select_one("p")
        description = clean_html(desc_node.get_text(" ", strip=True)) if desc_node else ""
        lang_node = row.select_one('[itemprop="programmingLanguage"]')
        language = clean_html(lang_node.get_text(" ", strip=True)) if lang_node else ""
        stars_today = 0
        for node in row.select("span"):
            text = node.get_text(" ", strip=True)
            if "stars today" in text.casefold():
                stars_today = parse_count(text)
                break
        total_node = row.select_one('a[href$="/stargazers"]')
        total_stars = parse_count(total_node.get_text(" ", strip=True) if total_node else "")
        if stars_today < min_stars_today:
            continue
        title = f"{full_name}: {description}" if description else full_name
        title = truncate(title, 90)
        summary_parts = [description] if description else []
        if language:
            summary_parts.append(f"Language: {language}.")
        if stars_today:
            summary_parts.append(f"{stars_today:,} stars today.")
        if total_stars:
            summary_parts.append(f"{total_stars:,} total stars.")
        summary = " ".join(summary_parts)
        if not matches_filter(source, title, summary):
            continue
        heat = log_heat(stars_today + total_stars / 200.0, 5000)
        items.append(base_item(
            source, title=title, url=f"https://github.com/{full_name}",
            publisher="GitHub", published=now, summary=summary, now=now,
            heat=heat,
            extra={"repo": full_name, "stars_today": stars_today, "stars_total": total_stars},
        ))
        if len(items) >= max_items:
            break
    return items


async def fetch_github_search(client: httpx.AsyncClient, source: dict[str, Any],
                              now: datetime) -> list[dict]:
    query = str(source.get("query") or "").strip()
    if not query:
        return []
    created_days = int(source.get("created_days", 0) or 0)
    if created_days:
        cutoff = (now - timedelta(days=created_days)).strftime("%Y-%m-%d")
        query = f"{query} created:>{cutoff}"
    params = {
        "q": query,
        "sort": source.get("sort", "stars"),
        "order": source.get("order", "desc"),
        "per_page": max(1, min(30, int(source.get("max_items", 5)))),
    }
    url = "https://api.github.com/search/repositories"
    try:
        response = await get(client, url, params=params, headers=github_headers())
    except httpx.HTTPStatusError as error:
        # A token without search access should not take the source down; retry
        # unauthenticated once. Rate limits are still reported by source health.
        if error.response.status_code in (401, 403) and github_headers().get("Authorization"):
            response = await get(client, url, params=params)
        else:
            raise
    payload = response.json()
    max_items = int(source.get("max_items", 5))
    min_stars = int(source.get("min_stars", 0))
    seen_cves: set[str] = set()
    items: list[dict] = []
    for repo in payload.get("items", []):
        if repo.get("archived") or repo.get("fork") or repo.get("disabled"):
            continue
        full_name = str(repo.get("full_name") or "").strip()
        if "/" not in full_name:
            continue
        stars = int(repo.get("stargazers_count") or 0)
        if stars < min_stars:
            continue
        description = clean_html(repo.get("description") or "")
        language = clean_html(repo.get("language") or "")
        topics = [str(topic) for topic in (repo.get("topics") or []) if topic]
        created = parse_datetime(repo.get("created_at"), now)
        pushed = parse_datetime(repo.get("pushed_at"), now)
        title = f"{full_name}: {description}" if description else full_name
        title = truncate(title, 90)
        summary_parts = [description] if description else []
        if language:
            summary_parts.append(f"Language: {language}.")
        summary_parts.append(f"{stars:,} stars.")
        if created:
            summary_parts.append(f"Created {created.strftime('%Y-%m-%d')}.")
        if pushed:
            summary_parts.append(f"Last push {pushed.strftime('%Y-%m-%d')}.")
        if topics:
            summary_parts.append("Topics: " + ", ".join(topics[:6]) + ".")
        summary = " ".join(summary_parts)
        if source.get("dedupe_cves"):
            cves = {
                cve.upper() for cve in re.findall(
                    r"CVE-\d{4}-\d{4,}", f"{title} {summary}", re.I
                )
            }
            if cves & seen_cves:
                continue
            seen_cves.update(cves)
        # Filter on the repository name and description, not on the topic
        # metadata. A useful tool can legitimately carry an "awesome-list"
        # topic without being a list itself.
        if not matches_filter(source, title, description):
            continue
        heat = log_heat(stars + 10, 50000)
        items.append(base_item(
            source, title=title,
            url=repo.get("html_url") or f"https://github.com/{full_name}",
            publisher="GitHub", published=created or now, summary=summary,
            now=now, heat=heat,
            extra={"repo": full_name, "stars": stars, "topics": topics},
        ))
        if len(items) >= max_items:
            break
    return items


AA_TOP1_RE = re.compile(r"1\.\s*(.+?)\s*\((\d+)\)")


def parse_artificial_analysis(html_text: str) -> dict[str, Any]:
    """Read the leaderboard summary from Artificial Analysis' FAQ JSON-LD.

    The page is a Next.js app, so the visible table is not stable to scrape.
    The FAQ payload is semantic, public and small enough to parse reliably.
    """
    soup = BeautifulSoup(html_text or "", "html.parser")
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            payload = json.loads(script.string or script.get_text() or "{}")
        except (TypeError, ValueError):
            continue
        if not isinstance(payload, dict) or payload.get("@type") != "FAQPage":
            continue
        answers: dict[str, str] = {}
        for entry in payload.get("mainEntity") or []:
            if not isinstance(entry, dict):
                continue
            question = str(entry.get("name") or "")
            answer = entry.get("acceptedAnswer") or {}
            if isinstance(answer, dict):
                answers[question] = str(answer.get("text") or "")
        top = next((value for key, value in answers.items()
                    if "top models" in key.casefold()), "")
        top_one = next((value for key, value in answers.items()
                        if "ranks #1" in key.casefold()), "")
        open_weights = next((value for key, value in answers.items()
                             if "best open weights" in key.casefold()), "")
        if top or top_one:
            return {
                "top": top,
                "top1": top_one,
                "open_weights": open_weights,
                "answers": answers,
            }
    raise ValueError("no Artificial Analysis FAQ payload found")


def artificial_analysis_item(parsed: dict[str, Any], source: dict[str, Any],
                             now: datetime) -> dict:
    match = AA_TOP1_RE.search(parsed.get("top") or "")
    name, score = (match.group(1), match.group(2)) if match else ("", "")
    title = (
        f"Benchmark: {name} tops Artificial Analysis ({score})"
        if name else "Artificial Analysis leaderboard update"
    )
    summary = " ".join(part for part in (
        parsed.get("top1") or "",
        parsed.get("top") or "",
        parsed.get("open_weights") or "",
    ) if part)
    signature = hashlib.sha1(
        (parsed.get("top") or parsed.get("top1") or "").encode("utf-8")
    ).hexdigest()
    return base_item(
        source, title=title, url=source.get("url") or "https://artificialanalysis.ai/leaderboards/models",
        publisher="Artificial Analysis", published=now, summary=summary,
        now=now, heat=0.55, extra={"benchmark_signature": signature},
    )


async def fetch_artificial_analysis(client: httpx.AsyncClient, source: dict[str, Any],
                                    now: datetime) -> list[dict]:
    response = await get(
        client,
        source.get("url") or "https://artificialanalysis.ai/leaderboards/models",
        headers={"User-Agent": UA, "Accept": "text/html"},
    )
    parsed = parse_artificial_analysis(response.text)
    signature = hashlib.sha1(
        (parsed.get("top") or parsed.get("top1") or "").encode("utf-8")
    ).hexdigest()
    cache = load_json(BENCHMARK_CACHE, {})
    last_signature = cache.get("signature") if isinstance(cache, dict) else None
    last_updated = parse_datetime(cache.get("updated"), None) if isinstance(cache, dict) else None
    refresh_days = float(source.get("refresh_days", 7))
    due = last_updated is None or (now - last_updated).total_seconds() / 86400 >= refresh_days
    if signature == last_signature and not due:
        return []
    try:
        write_json_atomic(BENCHMARK_CACHE, {
            "signature": signature,
            "updated": iso(now),
            "top": parsed.get("top") or "",
        })
    except OSError as error:
        log(f"  benchmark cache write failed: {type(error).__name__}")
    return [artificial_analysis_item(parsed, source, now)]



PTT_SKIP = ("[公告]", "[交易]", "[買賣]", "[票務]", "[交換]", "[徵求]", "[檢舉]")
PTT_KEEP = ("[情報]", "[心得]", "[討論]", "[新聞]", "[分享]", "[閒聊]", "[問題]")


def parse_ptt_date(text: str, now: datetime) -> datetime | None:
    text = (text or "").strip()
    match = re.match(r"(\d{1,2})/(\d{1,2})", text)
    if not match:
        return None
    month, day = int(match.group(1)), int(match.group(2))
    year = now.year
    if month > now.month + 1:
        year -= 1
    try:
        return datetime(year, month, day, 12, 0, tzinfo=HKT)
    except ValueError:
        return None


async def fetch_ptt(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    board = source.get("board", "MayDay")
    index_url = f"https://www.ptt.cc/bbs/{board}/index.html"
    response = await get(client, index_url)
    soup = BeautifulSoup(response.text, "html.parser")
    rows = []
    for row in soup.select("div.r-ent"):
        link = row.select_one("div.title a")
        if not link:
            continue
        title = clean_html(link.get_text(" ", strip=True))
        href = link.get("href") or ""
        if not title or not href.startswith("/bbs/") or "/M." not in href:
            continue
        if any(title.startswith(prefix) for prefix in PTT_SKIP):
            continue
        if PTT_KEEP and not any(title.startswith(prefix) for prefix in PTT_KEEP):
            continue
        date_text = row.select_one("div.date")
        published = parse_ptt_date(date_text.get_text(strip=True) if date_text else "", now)
        if published is None:
            continue
        rows.append((published, title, href))
    rows.sort(key=lambda row: row[0], reverse=True)

    max_items = int(source.get("max_items", 6))
    items: list[dict] = []
    for index_date, index_title, href in rows:
        if len(items) >= max_items:
            break
        post_url = urljoin("https://www.ptt.cc", href)
        try:
            post_response = await get(client, post_url, headers={"Cookie": "over18=1"})
        except Exception as error:  # one bad post should not kill the board
            log(f"  ptt post failed: {href} ({type(error).__name__})")
            continue
        await asyncio.sleep(0.35)
        post_soup = BeautifulSoup(post_response.text, "html.parser")
        title = index_title
        author = ""
        published = index_date
        for meta in post_soup.select("div.article-metaline"):
            tag = meta.select_one("span.article-meta-tag")
            value = meta.select_one("span.article-meta-value")
            if not tag or not value:
                continue
            label = tag.get_text(strip=True)
            if label == "標題":
                title = clean_html(value.get_text(" ", strip=True)) or title
            elif label == "作者":
                author = clean_html(value.get_text(" ", strip=True))
            elif label == "時間":
                parsed_time = parse_datetime(value.get_text(" ", strip=True), None)
                if parsed_time:
                    published = parsed_time
        main = post_soup.select_one("#main-content")
        content = ""
        if main:
            for unwanted in main.select(".article-metaline, .article-metaline-right, .push, .article-footer"):
                unwanted.decompose()
            content = clean_html(main.get_text("\n", strip=True))
        pushes = []
        for push in post_soup.select("div.push"):
            push_tag = push.select_one(".push-tag")
            push_user = push.select_one(".push-userid")
            push_content = push.select_one(".push-content")
            tag_text = clean_html(push_tag.get_text(strip=True)) if push_tag else ""
            user_text = clean_html(push_user.get_text(strip=True)) if push_user else ""
            content_text = clean_html(push_content.get_text(" ", strip=True)) if push_content else ""
            content_text = re.sub(r"^:\s*", "", content_text)
            if not content_text:
                continue
            pushes.append({
                "platform": "PTT",
                "author": user_text,
                "score": None,
                "label": tag_text or "推",
                "text": truncate(content_text, 320),
                "url": post_url,
            })
        pushes.sort(key=lambda comment: comment.get("label") != "推")
        heat = log_heat(len(pushes) * 4 + 1, 200)
        items.append(base_item(
            source, title=title, url=post_url, publisher=f"PTT {board}",
            published=published, summary=content, now=now, heat=heat,
            comments=pushes[:5], extra={"ptt_author": author},
        ))
    return items


async def fetch_hko(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    response = await get(
        client,
        "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=tc",
    )
    payload = response.json()
    if not isinstance(payload, dict) or not payload:
        return []
    items = []
    for code, warning in payload.items():
        if not isinstance(warning, dict):
            continue
        name = clean_html(warning.get("name") or code)
        issued = parse_datetime(warning.get("issueTime"), now)
        updated = parse_datetime(warning.get("updateTime"), issued or now) or issued or now
        expires = parse_datetime(warning.get("expireTime"), None)
        summary = f"{name} 現正生效。"
        if issued:
            summary += f" 發出時間：{issued.strftime('%H:%M')}。"
        if expires:
            summary += f" 預定屆滿：{expires.strftime('%m/%d %H:%M')}。"
        items.append(base_item(
            source, title=f"天氣警告：{name}", url="https://www.hko.gov.hk/tc/wxinfo/currwx/warning.htm",
            publisher="香港天文台", published=updated, summary=summary, now=now,
            heat=0.82, extra={"warning_code": code},
        ))
        if len(items) >= int(source.get("max_items", 3)):
            break
    return items


async def fetch_kev(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    response = await get(
        client,
        "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
    )
    payload = response.json()
    days = float(source.get("days", 7))
    cutoff = now - timedelta(days=days)
    rows = []
    for vulnerability in payload.get("vulnerabilities", []):
        added = parse_datetime(vulnerability.get("dateAdded"), None)
        if added is None or added < cutoff:
            continue
        rows.append((added, vulnerability))
    rows.sort(key=lambda row: row[0], reverse=True)
    items = []
    for added, vulnerability in rows[: int(source.get("max_items", 5))]:
        cve = vulnerability.get("cveID") or "Unknown CVE"
        vendor = vulnerability.get("vendorProject") or ""
        product = vulnerability.get("product") or ""
        title = f"{cve} · {vendor} {product}".strip()
        summary = " ".join(filter(None, [
            vulnerability.get("vulnerabilityName"),
            vulnerability.get("shortDescription"),
            f"Required action: {vulnerability.get('requiredAction')}" if vulnerability.get("requiredAction") else "",
        ]))
        items.append(base_item(
            source, title=title, url=f"https://nvd.nist.gov/vuln/detail/{cve}",
            publisher="CISA", published=added, summary=summary, now=now,
            heat=0.58, extra={"cve": cve},
        ))
    return items


async def fetch_telegram(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    channel = source["channel"]
    response = await get(client, f"https://t.me/s/{channel}")
    soup = BeautifulSoup(response.text, "html.parser")
    messages = soup.select("div.tgme_widget_message_wrap")
    if not messages:
        messages = soup.select("div.tgme_widget_message")
    items = []
    for message in reversed(messages):
        text_node = message.select_one(".tgme_widget_message_text")
        if not text_node:
            continue
        text = clean_html(text_node.get_text("\n", strip=True))
        if not text:
            continue
        date_node = message.select_one("time[datetime]")
        published = parse_datetime(date_node.get("datetime") if date_node else None, now)
        post = message.get("data-post") or ""
        url = f"https://t.me/{post}" if post else f"https://t.me/s/{channel}"
        first_line = text.split("\n", 1)[0]
        title = truncate(first_line, 110)
        if not matches_filter(source, title, text):
            continue
        items.append(base_item(
            source, title=title, url=url, publisher=f"Telegram · {channel}",
            published=published, summary=text, now=now, heat=0.24,
        ))
        if len(items) >= int(source.get("max_items", 5)):
            break
    return items


async def dispatch(client: httpx.AsyncClient, source: dict[str, Any], now: datetime) -> list[dict]:
    adapter = source.get("type", "rss")
    if adapter == "rss":
        return await fetch_rss(client, source, now)
    if adapter == "google_news":
        return await fetch_google_news(client, source, now)
    if adapter == "hn":
        return await fetch_hn(client, source, now)
    if adapter == "openrouter":
        return await fetch_openrouter(client, source, now)
    if adapter == "github_trending":
        return await fetch_github_trending(client, source, now)
    if adapter == "github_search":
        return await fetch_github_search(client, source, now)
    if adapter == "artificial_analysis":
        return await fetch_artificial_analysis(client, source, now)
    if adapter == "ptt":
        return await fetch_ptt(client, source, now)
    if adapter == "hko":
        return await fetch_hko(client, source, now)
    if adapter == "kev":
        return await fetch_kev(client, source, now)
    if adapter == "telegram":
        return await fetch_telegram(client, source, now)
    raise ValueError(f"unknown source type: {adapter}")


async def fetch_all(config: dict[str, Any], active_topics: set[str], now: datetime) -> tuple[list[dict], list[dict]]:
    topics = config.get("topics", {})
    sources: list[dict] = []
    for topic_id, topic in topics.items():
        if topic_id not in active_topics:
            continue
        for source in topic.get("sources", []):
            source = dict(source)
            source.setdefault("topic", topic_id)
            source.setdefault("name", source.get("id", "source"))
            if not source.get("ignore_topic_filters"):
                source["exclude_keywords"] = list(source.get("exclude_keywords") or []) + list(topic.get("exclude_keywords") or [])
                source["filter_keywords"] = list(source.get("filter_keywords") or []) + list(topic.get("filter_keywords") or [])
            if source.get("enabled", True):
                sources.append(source)

    semaphore = asyncio.Semaphore(CONCURRENCY)
    statuses: list[dict] = [None] * len(sources)  # type: ignore[list-item]
    all_items: list[dict] = []

    async with httpx.AsyncClient(
        headers=HEADERS, timeout=TIMEOUT, follow_redirects=True,
        limits=httpx.Limits(max_connections=12, max_keepalive_connections=6),
    ) as client:
        async def run_one(index: int, source: dict[str, Any]) -> None:
            async with semaphore:
                try:
                    items = await dispatch(client, source, now)
                    statuses[index] = {
                        "id": source["id"],
                        "name": source.get("name", source["id"]),
                        "topic": source.get("topic"),
                        "ok": True,
                        "items": len(items),
                        "error": None,
                        "fetched_at": iso(now),
                    }
                    all_items.extend(items)
                except Exception as error:
                    message = f"{type(error).__name__}: {error}"
                    statuses[index] = {
                        "id": source["id"],
                        "name": source.get("name", source["id"]),
                        "topic": source.get("topic"),
                        "ok": False,
                        "items": 0,
                        "error": truncate(message, 180, ""),
                        "fetched_at": iso(now),
                    }

        await asyncio.gather(*(run_one(index, source) for index, source in enumerate(sources)))

    return all_items, [status for status in statuses if status is not None]


async def fetch_hn_comments(client: httpx.AsyncClient, item_id_value: str, limit: int = 5) -> list[dict]:
    response = await get(client, f"https://hn.algolia.com/api/v1/items/{item_id_value}")
    payload = response.json()
    comments = []
    for child in (payload.get("children") or [])[:limit]:
        text = clean_html(child.get("text") or "")
        if not text:
            continue
        comment_id = child.get("id")
        comments.append({
            "platform": "HN",
            "author": child.get("author") or "",
            "score": None,
            "text": truncate(text, 320),
            "url": f"https://news.ycombinator.com/item?id={comment_id}" if comment_id else "",
        })
    return comments


async def search_hn_comments(client: httpx.AsyncClient, title: str) -> list[dict]:
    query = quote_plus(clean_title(title))
    response = await get(
        client,
        f"https://hn.algolia.com/api/v1/search?query={query}&tags=story&hitsPerPage=5",
    )
    for hit in response.json().get("hits", []):
        candidate = clean_html(hit.get("title") or "")
        jaccard, ratio = title_similarity(title, candidate)
        if max(jaccard, ratio * 0.86) >= 0.54 and hit.get("objectID"):
            return await fetch_hn_comments(client, str(hit["objectID"]), limit=4)
    return []


GENERIC_PAGE_TEXT = (
    "comprehensive up-to-date news coverage",
    "aggregated from sources all over the world",
)


def useful_page_text(text: str) -> bool:
    value = clean_html(text).casefold()
    if len(value) < 60:
        return False
    return not any(marker in value for marker in GENERIC_PAGE_TEXT)


async def enrich_thin_sources(clusters: list[dict], now: datetime, limit: int = 8) -> None:
    """Fetch article metadata for selected cards that only have a headline.

    Several Google News feeds return no body text. Without this step the
    reader gets a generic "open the source" line, and the LLM has nothing
    concrete to compress. Fetching the public page description is a small,
    bounded cost: only selected thin cards are attempted, and failures are
    ignored.
    """
    targets = [cluster for cluster in clusters if not has_body_text(cluster)][:limit]
    if not targets:
        return
    async with httpx.AsyncClient(
        headers=HEADERS, timeout=TIMEOUT, follow_redirects=True,
        limits=httpx.Limits(max_connections=6, max_keepalive_connections=3),
    ) as client:
        for cluster in targets:
            items = sorted(
                cluster.get("items") or [],
                key=lambda item: (float(item.get("trust", 0)), item.get("published") or ""),
                reverse=True,
            )
            for item in items[:2]:
                url = item.get("url") or ""
                if not url:
                    continue
                # Google News article links are JavaScript redirects; fetching
                # them only returns Google's own boilerplate description.
                if "news.google.com" in url:
                    continue
                try:
                    page = await get(
                        client, url,
                        headers={"User-Agent": UA, "Accept": "text/html"},
                        timeout=httpx.Timeout(15.0, connect=8.0),
                    )
                except Exception as error:
                    log(f"  article fetch failed: {url[:80]} ({type(error).__name__})")
                    continue
                soup = BeautifulSoup(page.text, "html.parser")
                description = ""
                for selector in (
                    'meta[name="description"]',
                    'meta[property="og:description"]',
                    'meta[name="twitter:description"]',
                ):
                    node = soup.select_one(selector)
                    if node and node.get("content"):
                        text = clean_html(node.get("content"))
                        if len(text) >= 60:
                            description = text
                            break
                if len(description) < 80:
                    for paragraph in soup.select("p"):
                        text = clean_html(paragraph.get_text(" ", strip=True))
                        if len(text) >= 120:
                            description = text
                            break
                if not useful_page_text(description):
                    continue
                # Never replace a short but genuine feed summary with a
                # longer boilerplate page description.
                if len(description) <= len(body_text(item)) + 20:
                    continue
                item["summary"] = truncate(description, 1400)
                if not cluster.get("summary") or len(clean_html(cluster.get("summary"))) < 120:
                    cluster["summary"] = item["summary"]
                log(f"  article text added: {str(cluster.get('headline') or '')[:70]}")
                break


async def enrich_comments(cards: list[dict], now: datetime, limit: int = 6) -> None:
    """Add HN comments to selected cards, including AI stories not on the front page."""
    targets = []
    for card in cards:
        for source in card.get("sources", []):
            if source.get("hn_id"):
                targets.append((card, source["hn_id"]))
                break
        if len(targets) >= limit:
            break
    ai_cards = [
        card for card in cards
        if card.get("topic") == "ai" and not card.get("comments")
    ][:3]
    if not targets and not ai_cards:
        return
    async with httpx.AsyncClient(headers=HEADERS, timeout=TIMEOUT, follow_redirects=True) as client:
        for card, hn_id in targets:
            if card.get("comments"):
                continue
            try:
                card["comments"] = await fetch_hn_comments(client, hn_id)
            except Exception as error:
                log(f"  HN comments failed for {hn_id}: {type(error).__name__}")
        for card in ai_cards:
            if card.get("comments"):
                continue
            try:
                card["comments"] = await search_hn_comments(client, card.get("headline") or "")
            except Exception as error:
                log(f"  HN search failed for {card.get('headline', '')[:50]}: {type(error).__name__}")
