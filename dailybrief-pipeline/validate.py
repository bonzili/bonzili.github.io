"""Schema and safety checks before a brief is allowed to deploy."""
from __future__ import annotations

from typing import Any
from urllib.parse import urlsplit

from util import parse_datetime


def _is_http(url: str) -> bool:
    try:
        parts = urlsplit(str(url or ""))
        return parts.scheme in ("http", "https") and bool(parts.netloc)
    except ValueError:
        return False


def _text_ok(value: Any) -> bool:
    text = str(value or "")
    lowered = text.casefold()
    return "<script" not in lowered and "javascript:" not in lowered


def validate_brief(data: dict[str, Any], config: dict[str, Any] | None = None) -> list[str]:
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["brief is not an object"]
    if data.get("schema") != 1:
        errors.append("schema must be 1")
    if parse_datetime(data.get("generated_at"), None) is None:
        errors.append("generated_at is not a date")
    topics = data.get("topics")
    if not isinstance(topics, list) or not topics:
        errors.append("topics is empty")
        topics = []
    topic_ids = {topic.get("id") for topic in topics if isinstance(topic, dict)}
    cards = data.get("cards")
    if not isinstance(cards, list):
        errors.append("cards is not a list")
        cards = []
    if len(cards) > 200:
        errors.append(f"too many cards: {len(cards)}")

    card_ids = set()
    for index, card in enumerate(cards):
        label = f"cards[{index}]"
        if not isinstance(card, dict):
            errors.append(f"{label} is not an object")
            continue
        card_id = str(card.get("id") or "")
        if not card_id:
            errors.append(f"{label} has no id")
        elif card_id in card_ids:
            errors.append(f"duplicate card id {card_id}")
        card_ids.add(card_id)
        if card.get("topic") not in topic_ids:
            errors.append(f"{label} has unknown topic {card.get('topic')}")
        if not str(card.get("headline") or "").strip():
            errors.append(f"{label} has no headline")
        if not _text_ok(card.get("headline")) or not _text_ok(card.get("why")):
            errors.append(f"{label} contains unsafe text")
        bullets = card.get("bullets")
        if not isinstance(bullets, list) or not bullets:
            errors.append(f"{label} has no bullets")
        elif len(bullets) > 4:
            errors.append(f"{label} has too many bullets")
        sources = card.get("sources")
        if not isinstance(sources, list) or not sources:
            errors.append(f"{label} has no sources")
        else:
            for source in sources:
                if not isinstance(source, dict) or not _is_http(source.get("url")):
                    errors.append(f"{label} has a non-http source")
                    break

    workspaces = data.get("workspaces")
    if not isinstance(workspaces, dict) or not workspaces:
        errors.append("workspaces is empty")
        workspaces = {}
    for workspace_id, workspace in workspaces.items():
        label = f"workspaces.{workspace_id}"
        if not isinstance(workspace, dict):
            errors.append(f"{label} is not an object")
            continue
        picks = workspace.get("picks")
        if not isinstance(picks, list):
            errors.append(f"{label}.picks is not a list")
            continue
        cap = int(workspace.get("cap") or 99)
        if len(picks) > cap:
            errors.append(f"{label} has {len(picks)} picks, cap is {cap}")
        seen = set()
        for index, pick in enumerate(picks):
            pick_label = f"{label}.picks[{index}]"
            if not isinstance(pick, dict):
                errors.append(f"{pick_label} is not an object")
                continue
            card_id = str(pick.get("card_id") or "")
            if card_id not in card_ids:
                errors.append(f"{pick_label} references unknown card {card_id}")
            if card_id in seen:
                errors.append(f"{pick_label} duplicates card {card_id}")
            seen.add(card_id)
            if not str(pick.get("why") or "").strip():
                errors.append(f"{pick_label} has no why")
            if not _text_ok(pick.get("why")):
                errors.append(f"{pick_label} has unsafe text")
            pick_bullets = pick.get("bullets")
            if not isinstance(pick_bullets, list) or not pick_bullets:
                errors.append(f"{pick_label} has no bullets")
            elif len(pick_bullets) > 4:
                errors.append(f"{pick_label} has too many bullets")

    if config:
        for workspace_id, workspace_config in config.get("workspaces", {}).items():
            for topic_id in workspace_config.get("topics", []):
                if topic_id not in topic_ids:
                    errors.append(f"workspace {workspace_id} uses unknown topic {topic_id}")
    return errors
