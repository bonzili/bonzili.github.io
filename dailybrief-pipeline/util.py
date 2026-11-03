"""Small shared helpers for the Daily Brief pipeline."""
from __future__ import annotations

import difflib
import hashlib
import html
import json
import math
import os
import re
import time
import unicodedata
import warnings
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from zoneinfo import ZoneInfo

from bs4 import BeautifulSoup, MarkupResemblesLocatorWarning

warnings.filterwarnings("ignore", category=MarkupResemblesLocatorWarning)

try:  # optional, but makes messy RSS dates much easier
    from dateutil import parser as date_parser
except Exception:  # pragma: no cover - exercised only in a bare environment
    date_parser = None

HKT = ZoneInfo("Asia/Hong_Kong")
UTC = timezone.utc
CJK_RE = re.compile(r"[\u3400-\u9fff\uf900-\ufaff]")
URL_RE = re.compile(r"https?://\S+", re.I)
SPACE_RE = re.compile(r"\s+")
TRACKING_KEYS = {
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "fbclid", "gclid", "mc_cid", "mc_eid", "igshid", "ref", "ref_src",
}


def now_hkt() -> datetime:
    return datetime.now(HKT).replace(microsecond=0)


def parse_datetime(value: Any, default: datetime | None = None) -> datetime | None:
    """Best-effort date parsing, always returned in Hong Kong time."""
    if value is None or value == "":
        return default
    dt: datetime | None = None
    if isinstance(value, datetime):
        dt = value
    elif isinstance(value, time.struct_time):
        dt = datetime(*value[:6], tzinfo=UTC)
    elif isinstance(value, (int, float)):
        try:
            dt = datetime.fromtimestamp(float(value), UTC)
        except (OverflowError, OSError, ValueError):
            return default
    else:
        text = str(value).strip()
        if not text:
            return default
        try:
            dt = datetime.fromisoformat(text.replace("Z", "+00:00"))
        except ValueError:
            try:
                dt = parsedate_to_datetime(text)
            except (TypeError, ValueError, IndexError):
                if date_parser is not None:
                    try:
                        dt = date_parser.parse(text)
                    except (ValueError, TypeError, OverflowError):
                        dt = None
    if dt is None:
        return default
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=UTC)
    return dt.astimezone(HKT)


def iso(dt: datetime | None) -> str:
    if dt is None:
        return ""
    return dt.astimezone(HKT).isoformat(timespec="seconds")


def clean_html(value: Any) -> str:
    text = str(value or "")
    if not text:
        return ""
    soup = BeautifulSoup(text, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    text = soup.get_text(" ", strip=True)
    text = html.unescape(text)
    text = URL_RE.sub(" ", text)
    return SPACE_RE.sub(" ", text).strip()


def clean_title(value: Any, publisher: str | None = None) -> str:
    title = clean_html(value)
    title = URL_RE.sub(" ", title)
    title = title.strip(" \t\r\n\"'“”‘’")
    if publisher:
        pub = re.escape(publisher.strip())
        if pub:
            title = re.sub(rf"\s*[-–—|]\s*{pub}\s*$", "", title, flags=re.I)
    return SPACE_RE.sub(" ", title).strip()


def truncate(text: str, limit: int = 1200, suffix: str = "…") -> str:
    text = SPACE_RE.sub(" ", str(text or "")).strip()
    if len(text) <= limit:
        return text
    cut = text[: max(0, limit - len(suffix))].rstrip()
    if " " in cut:
        cut = cut.rsplit(" ", 1)[0]
    return cut + suffix


def first_sentence(text: str, limit: int = 220) -> str:
    text = SPACE_RE.sub(" ", str(text or "")).strip()
    if not text:
        return ""
    parts = re.split(r"(?<=[.!?。！？])\s+", text, maxsplit=1)
    sentence = parts[0] if parts else text
    if len(sentence) > limit:
        sentence = truncate(sentence, limit)
    return sentence.strip()


def normalize_title(value: str) -> str:
    text = unicodedata.normalize("NFKC", html.unescape(str(value or ""))).lower()
    text = URL_RE.sub(" ", text)
    chars = []
    for char in text:
        if char.isalnum() or CJK_RE.match(char):
            chars.append(char)
        else:
            chars.append(" ")
    return SPACE_RE.sub(" ", "".join(chars)).strip()


def is_cjk_text(value: str) -> bool:
    text = str(value or "")
    if not text:
        return False
    cjk = len(CJK_RE.findall(text))
    letters = sum(1 for char in text if char.isalnum() or CJK_RE.match(char))
    return letters > 0 and (cjk / letters) >= 0.25


STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "for", "with", "from", "into",
    "after", "before", "over", "under", "about", "this", "that", "these",
    "those", "its", "his", "her", "their", "our", "your", "new", "says",
    "said", "will", "has", "have", "had", "was", "were", "are", "is", "be",
    "to", "of", "in", "on", "at", "by", "as", "it", "we", "you", "they",
    "he", "she", "not", "no", "than", "then", "more", "most", "can", "could",
}


def title_tokens(value: str) -> set[str]:
    """Word tokens for Latin titles, character bigrams for CJK titles."""
    normalized = normalize_title(value)
    if not normalized:
        return set()
    words = re.findall(r"[a-z0-9]+", normalized)
    latin = {word for word in words if len(word) > 1 and word not in STOPWORDS}
    cjk_bigrams: set[str] = set()
    for run in re.findall(r"[\u3400-\u9fff\uf900-\ufaff]+", normalized):
        if len(run) == 1:
            cjk_bigrams.add(run)
        else:
            cjk_bigrams.update(run[i:i + 2] for i in range(len(run) - 1))
    return latin | cjk_bigrams


def title_similarity(a: str, b: str) -> tuple[float, float]:
    ta, tb = title_tokens(a), title_tokens(b)
    if not ta or not tb:
        return 0.0, 0.0
    jaccard = len(ta & tb) / max(1, len(ta | tb))
    ratio = difflib.SequenceMatcher(None, normalize_title(a), normalize_title(b)).ratio()
    return jaccard, ratio


def stable_id(topic: str, title: str) -> str:
    raw = f"{topic}|{normalize_title(title)}".encode("utf-8")
    return hashlib.sha1(raw).hexdigest()[:16]


def canonical_url(value: str) -> str:
    value = str(value or "").strip()
    if not value:
        return ""
    try:
        parts = urlsplit(value)
        if parts.scheme not in ("http", "https"):
            return value
        query = [(key, val) for key, val in parse_qsl(parts.query, keep_blank_values=True)
                 if key.lower() not in TRACKING_KEYS]
        return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), parts.path,
                           urlencode(query, doseq=True), ""))
    except ValueError:
        return value


def url_key(value: str) -> str:
    url = canonical_url(value)
    return url or str(value or "")


def log(message: str) -> None:
    print(message, flush=True)


def load_json(path: str | Path, default: Any) -> Any:
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, ValueError, TypeError):
        return default


def write_json_atomic(path: str | Path, data: Any) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    with open(temporary, "w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
    os.replace(temporary, path)


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def log_heat(value: float, scale: float = 1000.0) -> float:
    return clamp(math.log1p(max(0.0, value)) / math.log1p(scale))


def label_lang(code: str) -> str:
    code = str(code or "").lower()
    if code.startswith("zh-hant") or code in ("zh-tw", "zh-hk") or code.startswith("zh"):
        return "Traditional Chinese (Hong Kong / Taiwan)" if code != "zh-tw" else "Traditional Chinese (Taiwan)"
    return "English"


JURISDICTION_RULES = [
    ("Hong Kong", ["hong kong", "香港", "pcpd", "私隱署", "知識產權署"]),
    ("Singapore", ["singapore", "新加坡", "pdpc", "monetary authority of singapore", "mas"]),
    ("Japan", ["japan", "日本", "nikkei"]),
    ("Australia", ["australia", "澳洲", "oaic"]),
    ("India", ["india", "印度"]),
    ("China", ["china", "中國", "国家知识产权局", "cnipa"]),
    ("EU", ["cjeu", "upc", "unified patent court", "european union", "euipo", "ag szpunar", "milan central division"]),
    ("UK", ["united kingdom", "uk ipo", "gov.uk", "england", "scotland", "wales"]),
    ("US", ["uspto", "u.s.", "united states", "copyright office", "supreme court"]),
]


def _needle_match(haystack: str, needle: str) -> bool:
    if re.search(r"[\u3400-\u9fff]", needle):
        return needle in haystack
    return re.search(rf"(?<![a-z0-9]){re.escape(needle)}(?![a-z0-9])", haystack) is not None


def infer_jurisdiction(text: str, fallback: str = "") -> str:
    haystack = str(text or "").casefold()
    for label, needles in JURISDICTION_RULES:
        if any(_needle_match(haystack, needle) for needle in needles):
            return label
    return fallback


def text_has_keyword(text: str, keyword: str) -> bool:
    haystack = str(text or "").casefold()
    word = str(keyword or "").casefold().strip()
    if not word:
        return False
    if re.search(r"[\u3400-\u9fff]", word):
        return word in haystack
    return re.search(rf"(?<![a-z0-9]){re.escape(word)}(?![a-z0-9])", haystack) is not None


def age_hours(published: datetime | None, now: datetime) -> float:
    if published is None:
        return 1.0
    return max(0.0, (now - published.astimezone(HKT)).total_seconds() / 3600.0)


def prune_older(mapping: dict[str, Any], field: str, now: datetime, days: int) -> dict[str, Any]:
    cutoff = now - timedelta(days=days)
    pruned = {}
    for key, value in mapping.items():
        try:
            stamp = parse_datetime(value.get(field), None)
        except AttributeError:
            stamp = None
        if stamp is None or stamp >= cutoff:
            pruned[key] = value
    return pruned
