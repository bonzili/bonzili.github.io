"""LLM summaries with strict free-tier guardrails.

Only two providers are ever called:
  * Google Gemini API, using a free AI Studio key (no billing account).
  * GitHub Models, using the workflow's built-in GITHUB_TOKEN.

There is no paid provider, no automatic upgrade, and no retry loop that can
run forever. A hard call budget stops the run and falls back to extractive
bullets. The static site never receives an API key.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import time
from datetime import timedelta
from typing import Any

import httpx

from util import (
    body_text, clean_html, first_sentence, iso, label_lang, load_json, log,
    now_hkt, truncate, write_json_atomic,
)

PROMPT_VERSION = "2026-11-07.2"
DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"
DEFAULT_GITHUB_MODEL = "openai/gpt-4o-mini"
MAX_SOURCE_CHARS = 900
MAX_SOURCES = 5
MAX_BULLETS = 3
MAX_BULLET_CHARS = 230
MAX_WHY_CHARS = 190


class SummaryError(RuntimeError):
    pass


class ProviderUnavailable(SummaryError):
    """The provider cannot be used for the rest of this run."""


class BudgetExceeded(RuntimeError):
    pass


class CallBudget:
    def __init__(self, limit: int):
        self.limit = max(0, int(limit))
        self.used = 0

    def spend(self) -> None:
        if self.used >= self.limit:
            raise BudgetExceeded(f"LLM call budget reached ({self.used}/{self.limit})")
        self.used += 1

    def remaining(self) -> int:
        return max(0, self.limit - self.used)


def extract_json(text: str) -> dict:
    value = (text or "").strip()
    if not value:
        raise SummaryError("empty model response")
    value = re.sub(r"^```(?:json)?\s*", "", value, flags=re.I)
    value = re.sub(r"\s*```$", "", value)
    start = value.find("{")
    end = value.rfind("}")
    if start < 0 or end <= start:
        raise SummaryError("model response was not JSON")
    try:
        return json.loads(value[start:end + 1])
    except json.JSONDecodeError as error:
        raise SummaryError(f"invalid JSON: {error}") from error


NUMBER_RE = re.compile(r"(?<![A-Za-z0-9])(\d[\d,]*(?:\.\d+)?%?)(?![A-Za-z0-9])")


def numbers_grounded(result: dict, source_text: str) -> bool:
    source = str(source_text or "").casefold().replace(",", "")
    for text in list(result.get("bullets") or []) + [result.get("why") or ""]:
        for token in NUMBER_RE.findall(str(text)):
            normalized = token.rstrip("%").replace(",", "")
            if normalized and normalized not in source:
                return False
    return True


# The persona names the reader's other interests, and the model sometimes
# pads a three-bullet summary with one of them. That is a factual error even
# when the sentence is true: it is about a different story. Keep the markers
# here so the guard works for any provider, not just Gemini.
CROSS_TOPIC_MARKERS = {
    "mayday": ("五月天", "mayday", "阿信", "相信音樂"),
    "jackson": ("易烊千璽", "千璽", "易烊"),
}


BREAK_NEGATIVE_MARKERS = (
    "與法律業務無關",
    "與法律事務無涉",
    "與法律無關",
    "與工作無關",
    "與亞太地區法律事務",
    "與智慧財產權或法規遵循無涉",
    "與知識產權或法規遵循無涉",
    "unrelated to legal",
    "unrelated to work",
    "not related to legal",
    "no legal impact",
    "no direct legal",
    "not relevant to legal",
    "與 ai 無關",
    "與人工智能無關",
    "與網絡安全無關",
    "與資安無關",
)


def normalize_break_why(result: dict, card: dict) -> dict:
    """Keep break items positive instead of saying they are not work."""
    topic_id = card.get("topic")
    if topic_id not in ("jackson", "mayday"):
        return result
    why = str(result.get("why") or "")
    folded = why.casefold()
    if not any(marker.casefold() in folded for marker in BREAK_NEGATIVE_MARKERS):
        return result
    lang = str(card.get("headline_lang") or "en").lower()
    if lang.startswith("zh"):
        fallback = (
            "輕鬆一則：為繁忙日程留一點空間。"
            if topic_id == "jackson"
            else "樂團動態：為繁忙日程留一點輕鬆。"
        )
    else:
        fallback = "A light break from the day's heavier news."
    return {**result, "why": truncate(fallback, MAX_WHY_CHARS)}


def strip_off_topic_bullets(result: dict, source_text: str, topic_id: str) -> dict | None:
    """Remove bullets that drift into another one of the reader's topics."""
    source = str(source_text or "").casefold()
    kept = []
    for bullet in result.get("bullets") or []:
        text = str(bullet or "").casefold()
        off_topic = False
        for other_topic, markers in CROSS_TOPIC_MARKERS.items():
            if other_topic == topic_id:
                continue
            if any(marker.casefold() in text and marker.casefold() not in source for marker in markers):
                off_topic = True
                break
        if not off_topic:
            kept.append(bullet)
    if len(kept) < 2:
        return None
    why = str(result.get("why") or "")
    why_text = why.casefold()
    for other_topic, markers in CROSS_TOPIC_MARKERS.items():
        if other_topic == topic_id:
            continue
        if any(marker.casefold() in why_text and marker.casefold() not in source for marker in markers):
            return None
    return {**result, "bullets": kept}


def decode_response_json(response: httpx.Response, label: str) -> dict:
    try:
        return response.json()
    except ValueError as error:
        raise SummaryError(
            f"{label} returned non-JSON (HTTP {response.status_code})"
        ) from error


def validate_summary(payload: dict) -> dict:
    bullets = payload.get("bullets")
    why = payload.get("why")
    if not isinstance(bullets, list):
        raise SummaryError("bullets is not a list")
    clean_bullets = []
    for bullet in bullets[:MAX_BULLETS]:
        text = re.sub(r"^\s*(?:[-*•]|\d+[.)])\s*", "", str(bullet or "")).strip()
        text = re.sub(r"\s+", " ", text)
        if not text:
            continue
        clean_bullets.append(truncate(text, MAX_BULLET_CHARS))
    if len(clean_bullets) < 2:
        raise SummaryError("not enough bullets")
    why_text = re.sub(r"\s+", " ", str(why or "")).strip().strip('"“”')
    if not why_text:
        raise SummaryError("missing why")
    return {"bullets": clean_bullets[:MAX_BULLETS], "why": truncate(why_text, MAX_WHY_CHARS)}


def source_blocks(card: dict, cluster: dict) -> str:
    item_by_url = {}
    for item in cluster.get("items", []):
        item_by_url[item.get("url")] = item
    blocks = []
    for source in (card.get("sources") or [])[:MAX_SOURCES]:
        item = item_by_url.get(source.get("url")) or {}
        text = item.get("summary") or source.get("title") or ""
        text = truncate(clean_html(text), MAX_SOURCE_CHARS)
        title = source.get("title") or item.get("title") or ""
        publisher = source.get("publisher") or item.get("publisher") or ""
        published = source.get("published") or item.get("published") or ""
        blocks.append(
            f"- [{publisher}] {title}\n  Published: {published}\n  {text}"
        )
    return "\n\n".join(blocks)


def prompt_for(card: dict, cluster: dict, topic: dict, workspace: dict,
               bullet_lang: str, why_lang: str) -> tuple[str, str]:
    topic_name = (topic.get("name") or {}).get("en") or card.get("topic") or ""
    persona = workspace.get("persona") or "a busy reader in Hong Kong."
    system = (
        "You are the editor of a personal daily brief. You compress public reporting into a "
        "scannable, factual brief. Use only the supplied source text. Do not invent facts, "
        "numbers, dates, quotes, or legal conclusions. If the sources are thin or disagree, "
        "say so. No hype, no filler, no markdown, no bold. Plain text only."
    )
    legal_rules = ""
    if card.get("topic") == "legal":
        legal_rules = (
            "\n- This is a legal story. Lead with the jurisdiction and the practice area. "
            "State what changed, who it binds, and the practical consequence. Distinguish "
            "law from consultation, proposal, and commentary."
        )
    if card.get("topic") == "jackson":
        legal_rules = (
            "\n- This is entertainment news about 易烊千璽. Say what happened, whether it is "
            "official, and which project or event it relates to. Do not present fan speculation "
            "as fact. This is the reader's break section: keep it light and do not write that "
            "it is unrelated to legal work."
        )
    if card.get("topic") == "mayday":
        legal_rules = (
            "\n- This is Mayday news. Separate confirmed news from rumours and social posts. "
            "Mayday is the reader's break section: explain the band update and do not write "
            "that it is unrelated to AI, security, or work."
        )
    user = (
        f"Topic: {topic_name}\n"
        f"Headline: {card.get('headline')}\n"
        f"Publisher: {card.get('publisher')}\n"
        f"Sources:\n{source_blocks(card, cluster)}\n\n"
        f"Write for {persona}\n"
        f"Bullet language: {label_lang(bullet_lang)}\n"
        f"Takeaway language: {label_lang(why_lang)}\n\n"
        "Return JSON with exactly these keys: {\"bullets\": [\"...\"], \"why\": \"...\"}.\n"
        "Rules:\n"
        "- 2 or 3 bullets; each is one concrete fact about this story only, 230 characters or fewer.\n"
        "- Every bullet must be supported by the supplied source text. If the sources support only "
        "two facts, return two. Never pad with news about the reader's other interests, another "
        "person, or another company.\n"
        "- The one-line takeaway is 190 characters or fewer and says why this matters to the reader.\n"
        "- Quote at most 12 words from a source. No markdown. No emoji."
        f"{legal_rules}"
    )
    return system, user


def _summary_sentence(item: dict) -> str:
    summary = body_text(item)
    title = clean_html(item.get("title") or "")
    if len(summary) < 30 or summary.casefold() == title.casefold():
        return ""
    sentence = first_sentence(summary, 220)
    # Abbreviations such as "U.S." can make the first "sentence" uselessly
    # short. In that case keep the fuller source text instead of shipping a
    # fragment like "US: Today, the U.S." as the takeaway.
    if len(sentence) < 60:
        sentence = truncate(summary, 220)
    return sentence


ZH_JURISDICTION = {
    "Hong Kong": "香港",
    "Singapore": "新加坡",
    "Japan": "日本",
    "Australia": "澳洲",
    "India": "印度",
    "China": "中國",
    "EU": "歐盟",
    "UK": "英國",
    "US": "美國",
    "APAC": "亞太",
}


class ExtractiveProvider:
    name = "extractive"

    def summarize(self, card: dict, cluster: dict, topic: dict, workspace: dict,
                  bullet_lang: str, why_lang: str) -> dict:
        bullets = []
        seen = set()
        items = sorted(
            cluster.get("items", []),
            key=lambda item: (float(item.get("trust", 0)), item.get("published") or ""),
            reverse=True,
        )
        for item in items:
            sentence = _summary_sentence(item)
            if not sentence:
                # A headline is not a bullet. Repeating it under the
                # headline, or prefixing it with a publisher, adds no facts.
                # Keep the extractive path honest and fall back to the
                # "open the source" line when the feed has no summary.
                continue
            candidate = truncate(sentence, MAX_BULLET_CHARS)
            key = candidate.casefold()
            if not candidate or key in seen:
                continue
            seen.add(key)
            bullets.append(candidate)
            if len(bullets) >= MAX_BULLETS:
                break
        source_lang = str(card.get("headline_lang") or "en").lower()
        is_zh = source_lang.startswith("zh")
        publisher = card.get("publisher") or ("the source" if not is_zh else "來源")
        if not bullets:
            fallback = (
                f"{publisher} 報導：詳情請看原文。"
                if is_zh else
                f"Reported by {publisher}. Open the source for the confirmed details."
            )
            bullets = [truncate(fallback, MAX_BULLET_CHARS)]
        lead_item = items[0] if items else {}
        lead_sentence = _summary_sentence(lead_item) if lead_item else ""
        jurisdiction = card.get("jurisdiction") or ""
        prefix = ""
        if jurisdiction:
            prefix = (
                f"{ZH_JURISDICTION.get(jurisdiction, jurisdiction)}："
                if is_zh else
                f"{jurisdiction}: "
            )
        if lead_sentence and len(lead_sentence) >= 40:
            why = f"{prefix}{lead_sentence}"
        elif card.get("topic") == "legal":
            why = (
                f"{publisher} 報導：請看原文了解對實務的影響。"
                if is_zh else
                f"Reported by {publisher}. Check the source for the practical effect."
            )
        elif card.get("topic") == "mayday":
            why = (
                f"{publisher} 報導：請看原文了解已確認的內容。"
                if is_zh else
                f"Reported by {publisher}. Check the source for what is confirmed."
            )
        else:
            why = (
                f"{publisher} 報導：詳情請看原文。"
                if is_zh else
                f"Reported by {publisher}. Open the source for the details."
            )
        return {"bullets": bullets[:MAX_BULLETS], "why": truncate(why, MAX_WHY_CHARS)}


class GeminiProvider:
    name = "gemini"

    def __init__(self, api_key: str, model: str, budget: CallBudget):
        self.api_key = api_key
        self.model = model
        self.budget = budget
        self.client = httpx.Client(timeout=httpx.Timeout(45.0, connect=10.0))
        self.last_request = 0.0
        # Roughly 5 RPM, comfortably inside the Gemini free-tier per-minute
        # limits.
        self.min_interval = 12.0
        self._resolved_model: str | None = None

    def _throttle(self) -> None:
        now = time.monotonic()
        wait = self.min_interval - (now - self.last_request)
        if wait > 0:
            time.sleep(wait)
        self.last_request = time.monotonic()

    def _ensure_model(self) -> str:
        if self._resolved_model:
            return self._resolved_model
        candidates = [self.model]
        for candidate in (
            "gemini-3.5-flash-lite",
            "gemini-3.1-flash-lite",
            "gemini-3.6-flash",
            "gemini-3.8-flash",
        ):
            if candidate not in candidates:
                candidates.append(candidate)
        for candidate in candidates:
            self.budget.spend()
            self._throttle()
            url = (
                "https://generativelanguage.googleapis.com/v1beta/models/"
                f"{candidate}:generateContent"
            )
            try:
                response = self.client.post(
                    url,
                    headers={"x-goog-api-key": self.api_key, "Content-Type": "application/json"},
                    json={
                        "contents": [{"role": "user", "parts": [{"text": 'Return JSON: {"ok":true}'}]}],
                        "generationConfig": {"temperature": 0, "maxOutputTokens": 20, "responseMimeType": "application/json"},
                    },
                )
            except httpx.HTTPError:
                continue
            if response.status_code == 200:
                self._resolved_model = candidate
                log(f"  Gemini model selected: {candidate}")
                return candidate
            if response.status_code in (401, 403):
                raise ProviderUnavailable(f"Gemini not permitted ({response.status_code})")
            # 404: not available on this key/API; 429: try the next free model.
        raise ProviderUnavailable("no available Gemini free-tier model")

    def summarize(self, card: dict, cluster: dict, topic: dict, workspace: dict,
                  bullet_lang: str, why_lang: str) -> dict:
        system, user = prompt_for(card, cluster, topic, workspace, bullet_lang, why_lang)
        model = self._ensure_model()
        last_error = None
        for attempt in range(2):
            self.budget.spend()
            self._throttle()
            url = (
                "https://generativelanguage.googleapis.com/v1beta/models/"
                f"{model}:generateContent"
            )
            try:
                response = self.client.post(
                    url,
                    headers={"x-goog-api-key": self.api_key, "Content-Type": "application/json"},
                    json={
                        "systemInstruction": {"parts": [{"text": system}]},
                        "contents": [{"role": "user", "parts": [{"text": user}]}],
                        "generationConfig": {
                            "temperature": 0.2,
                            "maxOutputTokens": 700,
                            "responseMimeType": "application/json",
                        },
                    },
                )
                if response.status_code == 429:
                    last_error = SummaryError("Gemini free-tier rate limit")
                    if attempt == 0:
                        time.sleep(8)
                        continue
                    raise last_error
                if response.status_code >= 500:
                    last_error = SummaryError(f"Gemini HTTP {response.status_code}")
                    if attempt == 0:
                        time.sleep(3)
                        continue
                    raise last_error
                if response.status_code != 200:
                    raise SummaryError(f"Gemini HTTP {response.status_code}: {response.text[:160]}")
                payload = decode_response_json(response, "Gemini")
                try:
                    text = payload["candidates"][0]["content"]["parts"][0]["text"]
                except (KeyError, IndexError, TypeError) as error:
                    raise SummaryError("Gemini returned no text") from error
                return validate_summary(extract_json(text))
            except BudgetExceeded:
                raise
            except (httpx.HTTPError, ValueError, SummaryError) as error:
                last_error = error
                if attempt == 0:
                    time.sleep(2)
                    continue
                break
        raise SummaryError(str(last_error or "Gemini failed"))


class GitHubModelsProvider:
    name = "github-models"

    def __init__(self, token: str, model: str, budget: CallBudget):
        self.token = token
        self.model = model
        self.budget = budget
        self.client = httpx.Client(timeout=httpx.Timeout(45.0, connect=10.0))

    def summarize(self, card: dict, cluster: dict, topic: dict, workspace: dict,
                  bullet_lang: str, why_lang: str) -> dict:
        system, user = prompt_for(card, cluster, topic, workspace, bullet_lang, why_lang)
        last_error = None
        for attempt in range(2):
            self.budget.spend()
            try:
                response = self.client.post(
                    "https://models.github.ai/inference/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.token}",
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "temperature": 0.2,
                        "max_tokens": 700,
                        "response_format": {"type": "json_object"},
                        "messages": [
                            {"role": "system", "content": system},
                            {"role": "user", "content": user},
                        ],
                    },
                )
                if response.status_code in (401, 403):
                    raise SummaryError(f"GitHub Models not permitted ({response.status_code})")
                if response.status_code == 429:
                    last_error = SummaryError("GitHub Models free-tier rate limit")
                    if attempt == 0:
                        time.sleep(8)
                        continue
                    raise last_error
                if response.status_code >= 500:
                    last_error = SummaryError(f"GitHub Models HTTP {response.status_code}")
                    if attempt == 0:
                        time.sleep(3)
                        continue
                    raise last_error
                if response.status_code != 200:
                    raise SummaryError(f"GitHub Models HTTP {response.status_code}: {response.text[:160]}")
                payload = decode_response_json(response, "GitHub Models")
                text = payload["choices"][0]["message"]["content"]
                return validate_summary(extract_json(text))
            except BudgetExceeded:
                raise
            except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError, SummaryError) as error:
                last_error = error
                if attempt == 0:
                    time.sleep(2)
                    continue
                break
        raise SummaryError(str(last_error or "GitHub Models failed"))


class SummaryService:
    def __init__(self, config: dict, provider: str = "auto"):
        self.config = config
        summary_config = config.get("summarization") or {}
        self.cache_path = summary_config.get("cache_path", "dailybrief-pipeline/.cache/summaries.json")
        self.prompt_version = str(summary_config.get("prompt_version", PROMPT_VERSION))
        max_calls = int(summary_config.get("max_calls", 36))
        self.budget = CallBudget(max_calls)
        self.extractive = ExtractiveProvider()
        self.providers = []
        self.cache = load_json(self.cache_path, {})
        if not isinstance(self.cache, dict):
            self.cache = {}
        self.cache_hits = 0
        self.failures = 0
        self.provider_notes = []

        chosen = (provider or summary_config.get("provider") or "auto").lower()
        gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()
        github_token = os.environ.get("GITHUB_TOKEN", "").strip()
        gemini_model = os.environ.get("GEMINI_MODEL", "").strip() or summary_config.get("gemini_model", DEFAULT_GEMINI_MODEL)
        github_model = os.environ.get("GITHUB_MODELS_MODEL", "").strip() or summary_config.get("github_model", DEFAULT_GITHUB_MODEL)

        # In auto mode GitHub Models goes first: it uses the built-in
        # GITHUB_TOKEN, is free, and cannot produce a Google bill. Gemini is
        # opt-in only (provider: gemini or --provider gemini).
        if chosen in ("auto", "github", "github-models") and github_token:
            self.providers.append(GitHubModelsProvider(github_token, github_model, self.budget))
        if chosen == "gemini" and gemini_key:
            self.providers.append(GeminiProvider(gemini_key, gemini_model, self.budget))
        elif chosen == "auto" and gemini_key and not self.providers:
            # Local use without a GITHUB_TOKEN can use a free Gemini key.
            self.providers.append(GeminiProvider(gemini_key, gemini_model, self.budget))
        if chosen == "extractive" or not self.providers:
            self.providers = []

    def _cache_key(self, card: dict, cluster: dict, workspace: dict,
                   bullet_lang: str, why_lang: str) -> str:
        persona = workspace.get("persona") or ""
        source_text = " ".join(
            f"{item.get('title') or ''} {item.get('summary') or ''}"
            for item in cluster.get("items", [])
        )
        raw = "|".join([
            card.get("id", ""), bullet_lang, why_lang,
            hashlib.sha1(persona.encode("utf-8")).hexdigest()[:12],
            hashlib.sha1(source_text.encode("utf-8")).hexdigest()[:12],
            self.prompt_version,
        ])
        return hashlib.sha1(raw.encode("utf-8")).hexdigest()

    def summarize(self, card: dict, cluster: dict, topic: dict, workspace: dict,
                  bullet_lang: str, why_lang: str) -> dict:
        key = self._cache_key(card, cluster, workspace, bullet_lang, why_lang)
        cached = self.cache.get(key)
        if isinstance(cached, dict) and cached.get("bullets") and cached.get("why"):
            self.cache_hits += 1
            return {"bullets": cached["bullets"], "why": cached["why"], "cached": True, "mode": "ai"}

        for provider in self.providers:
            try:
                result = provider.summarize(card, cluster, topic, workspace, bullet_lang, why_lang)
                source_text = " ".join(
                    f"{item.get('title') or ''} {item.get('summary') or ''}"
                    for item in cluster.get("items", [])
                )
                if not numbers_grounded(result, source_text):
                    self.failures += 1
                    self.provider_notes.append(f"{provider.name}: unsupported number in summary")
                    log(f"  {provider.name} summary rejected for {card.get('id', '')}: unsupported number")
                    fallback = self.extractive.summarize(card, cluster, topic, workspace, bullet_lang, why_lang)
                    fallback["mode"] = "extractive"
                    return fallback
                cleaned = strip_off_topic_bullets(result, source_text, card.get("topic") or "")
                if cleaned is None:
                    self.failures += 1
                    self.provider_notes.append(f"{provider.name}: off-topic padding in summary")
                    log(f"  {provider.name} summary rejected for {card.get('id', '')}: off-topic padding")
                    fallback = self.extractive.summarize(card, cluster, topic, workspace, bullet_lang, why_lang)
                    fallback["mode"] = "extractive"
                    return fallback
                result = normalize_break_why(cleaned, card)
                self.cache[key] = {
                    "bullets": result["bullets"],
                    "why": result["why"],
                    "provider": provider.name,
                    "generated_at": iso(now_hkt()),
                }
                result["mode"] = "ai"
                return result
            except BudgetExceeded as error:
                self.provider_notes.append(str(error))
                log(f"  free LLM call budget reached: {error}")
                self.providers = []
                break
            except ProviderUnavailable as error:
                self.failures += 1
                self.provider_notes.append(f"{provider.name}: {error}")
                log(f"  {provider.name} disabled for this run: {error}")
                # A bad key, a missing model, or a rate limit should not be
                # retried once per card. Move to the next free provider.
                self.providers = [p for p in self.providers if p is not provider]
                continue
            except SummaryError as error:
                # A malformed or low-quality summary is a card-level failure,
                # not a reason to stop using the provider for every later card.
                self.failures += 1
                self.provider_notes.append(f"{provider.name}: {error}")
                log(f"  {provider.name} summary rejected for {card.get('id', '')}: {error}")
                continue
            except Exception as error:
                # Providers must never be able to fail the edition. A proxy
                # returning HTML, a malformed response, or a parsing bug
                # falls back to the extractive path.
                self.failures += 1
                message = f"{type(error).__name__}: {error}"
                self.provider_notes.append(f"{provider.name}: {message}")
                log(f"  {provider.name} disabled for this run: {message}")
                self.providers = [p for p in self.providers if p is not provider]
                continue

        fallback = self.extractive.summarize(card, cluster, topic, workspace, bullet_lang, why_lang)
        fallback["mode"] = "extractive"
        return fallback

    def save_cache(self) -> None:
        cutoff = now_hkt() - timedelta(days=30)
        pruned = {}
        for key, value in self.cache.items():
            if not isinstance(value, dict):
                continue
            stamp = value.get("generated_at")
            if not stamp:
                pruned[key] = value
                continue
            from util import parse_datetime
            parsed = parse_datetime(stamp, None)
            if parsed is None or parsed >= cutoff:
                pruned[key] = value
        write_json_atomic(self.cache_path, pruned)

    def report(self) -> str:
        return (
            f"LLM calls: {self.budget.used}/{self.budget.limit}; "
            f"cache hits: {self.cache_hits}; failures: {self.failures}"
        )
