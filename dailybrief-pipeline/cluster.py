"""Same-language story clustering.

The brief does not try to merge an English and a Chinese report of the same
event. That is a known v1 limit: it is safer to show both than to merge two
different facts under one headline.
"""
from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from typing import Any

from util import (
    clamp, infer_jurisdiction, is_cjk_text, iso, parse_datetime, stable_id,
    title_similarity, title_tokens, url_key,
)


def _published(item: dict) -> datetime:
    return parse_datetime(item.get("published"), None) or datetime.min


def _sort_items(items: list[dict]) -> list[dict]:
    return sorted(items, key=lambda item: (_published(item), float(item.get("trust", 0))), reverse=True)


def cluster_items(items: list[dict], now: datetime) -> list[dict]:
    by_topic: dict[str, list[dict]] = defaultdict(list)
    for item in items:
        if item.get("title") and item.get("url"):
            by_topic[item.get("topic", "misc")].append(item)

    clusters: list[dict] = []
    for topic, topic_items in by_topic.items():
        topic_items = _sort_items(topic_items)
        topic_clusters: list[dict] = []
        for item in topic_items:
            title = str(item.get("title") or "")
            cjk = is_cjk_text(title)
            tokens = title_tokens(title)
            item_url = url_key(item.get("url") or "")
            best: dict | None = None
            best_score = 0.0

            for cluster in topic_clusters:
                if cluster["cjk"] != cjk:
                    continue
                if item_url and item_url in cluster["urls"]:
                    best = cluster
                    best_score = 1.0
                    break
                if len(tokens) < (4 if cjk else 3):
                    continue
                for existing in cluster["titles"][:8]:
                    jaccard, ratio = title_similarity(title, existing)
                    score = max(jaccard, ratio * 0.86)
                    if score > best_score:
                        best = cluster
                        best_score = score
                if best_score >= (0.42 if cjk else 0.54):
                    break

            threshold = 0.42 if cjk else 0.54
            if best is not None and best_score >= threshold:
                _add_to_cluster(best, item)
            else:
                new_cluster = {
                    "topic": topic,
                    "cjk": cjk,
                    "items": [],
                    "titles": [],
                    "urls": set(),
                }
                _add_to_cluster(new_cluster, item)
                topic_clusters.append(new_cluster)
        clusters.extend(topic_clusters)

    finalized = [_finalize(cluster) for cluster in clusters]
    finalized.sort(key=lambda cluster: (
        float(cluster.get("heat", 0)),
        len(cluster.get("items", [])),
        _published(cluster),
    ), reverse=True)
    return finalized


def _add_to_cluster(cluster: dict, item: dict) -> None:
    url = url_key(item.get("url") or "")
    if url and url in cluster["urls"]:
        return
    cluster["items"].append(item)
    cluster["titles"].append(item.get("title") or "")
    if url:
        cluster["urls"].add(url)


def _finalize(cluster: dict) -> dict:
    items = _sort_items(cluster["items"])
    lead = max(
        items,
        key=lambda item: (float(item.get("trust", 0)), _published(item)),
    )
    published = max((_published(item) for item in items), default=datetime.min)
    sources = []
    seen_urls = set()
    for item in sorted(items, key=lambda row: (float(row.get("trust", 0)), _published(row)), reverse=True):
        url = item.get("url") or ""
        if not url or url_key(url) in seen_urls:
            continue
        seen_urls.add(url_key(url))
        source = {
            "title": item.get("title") or "",
            "url": url,
            "publisher": item.get("publisher") or item.get("source_name") or "",
            "published": item.get("published") or "",
            "lang": item.get("lang") or "en",
            "trust": float(item.get("trust", 0)),
        }
        if item.get("hn_id"):
            source["hn_id"] = item["hn_id"]
        if item.get("hn_points") is not None:
            source["hn_points"] = item["hn_points"]
        if item.get("hn_comments") is not None:
            source["hn_comments"] = item["hn_comments"]
        sources.append(source)
        if len(sources) >= 5:
            break

    comments = []
    seen_comments = set()
    for item in items:
        for comment in item.get("comments") or []:
            text = (comment.get("text") or "").strip()
            if not text or text in seen_comments:
                continue
            seen_comments.add(text)
            comments.append(comment)
            if len(comments) >= 5:
                break
        if len(comments) >= 5:
            break

    tags = []
    for item in [lead] + items:
        values = item.get("tags") or ([item.get("tag")] if item.get("tag") else [])
        for value in values:
            if value and value not in tags:
                tags.append(value)
    if cluster["topic"] == "cyber" and "HK" in tags and not any(item.get("always_hk") for item in items):
        hk_markers = (
            "香港", "hong kong", " hk ", "考評局", "私隱署", "個人資料私隱專員公署",
            "金管局", "機管局", "港鐵", "醫管局", "教育局", "數字辦", "警務處",
            "網絡安全及科技罪案調查科", "hkcert", "pcpd", "hkma", " sfc ",
        )
        text = " ".join(f"{item.get('title') or ''} {item.get('summary') or ''}" for item in items).casefold()
        if not any(marker in f" {text} " for marker in hk_markers):
            tags.remove("HK")
            if "Global" not in tags:
                tags.append("Global")
    if "HK" in tags:
        tags.remove("HK")
        tags.insert(0, "HK")
    jurisdictions = []
    for item in [lead] + items:
        value = item.get("jurisdiction")
        if value and value not in jurisdictions:
            jurisdictions.append(value)

    heat = max((float(item.get("heat", 0)) for item in items), default=0)
    heat = clamp(heat + 0.04 * max(0, len(items) - 1))

    jurisdiction = jurisdictions[0] if jurisdictions else ""
    if cluster["topic"] == "legal":
        jurisdiction = infer_jurisdiction(
            f"{lead.get('title') or ''} {lead.get('summary') or ''}", jurisdiction
        )
        if jurisdiction == "Hong Kong" and "HK" not in tags:
            tags.append("HK")
    if "HK" in tags:
        tags.remove("HK")
        tags.insert(0, "HK")

    return {
        "id": stable_id(cluster["topic"], lead.get("title") or ""),
        "topic": cluster["topic"],
        "cjk": bool(cluster.get("cjk")),
        "headline": lead.get("title") or "",
        "headline_lang": lead.get("lang") or "en",
        "publisher": lead.get("publisher") or lead.get("source_name") or "",
        "published": iso(published) if published != datetime.min else "",
        "url": lead.get("url") or "",
        "summary": lead.get("summary") or "",
        "sources": sources,
        "comments": comments,
        "tags": tags,
        "jurisdiction": jurisdiction,
        "heat": round(heat, 4),
        "items": items,
        "cluster_size": len(items),
    }
