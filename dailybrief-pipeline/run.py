#!/usr/bin/env python3
"""Build one Daily Brief edition.

Usage:
    python dailybrief-pipeline/run.py --no-llm
    python dailybrief-pipeline/run.py --provider auto
    python dailybrief-pipeline/run.py --dry-run --no-llm

The pipeline never commits anything. The GitHub Actions workflow stages the
generated files into the Pages artifact.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import yaml

from cluster import cluster_items
from fetch import enrich_comments, fetch_all
from selection import score_clusters, select_for_workspace, update_seen
from summarize import ExtractiveProvider, SummaryService
from util import (
    HKT, iso, load_json, log, now_hkt, parse_datetime, prune_older,
    truncate, write_json_atomic,
)
from validate import validate_brief

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build a Daily Brief edition")
    parser.add_argument("--config", default=str(ROOT / "config.yaml"))
    parser.add_argument("--out", default=str(REPO / "dailybrief" / "data"))
    parser.add_argument("--provider", choices=["auto", "gemini", "github", "extractive"], default=None)
    parser.add_argument("--no-llm", action="store_true", help="force extractive bullets")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--max-cards", type=int, default=160)
    parser.add_argument("--now", default=None, help="ISO timestamp for a reproducible run")
    return parser.parse_args()


def load_config(path: str) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as handle:
        config = yaml.safe_load(handle)
    if not isinstance(config, dict) or not config.get("workspaces") or not config.get("topics"):
        raise RuntimeError("config must contain workspaces and topics")
    return config


def edition_label(now: datetime) -> dict[str, str]:
    hour = now.astimezone(HKT).hour
    if 5 <= hour < 12:
        return {"en": "Morning", "zh": "早晨"}
    if 12 <= hour < 17:
        return {"en": "Afternoon", "zh": "下午"}
    if 17 <= hour < 22:
        return {"en": "Evening", "zh": "晚上"}
    return {"en": "Night", "zh": "深夜"}


def next_update(now: datetime) -> datetime:
    local = now.astimezone(HKT)
    morning = local.replace(hour=7, minute=0, second=0, microsecond=0)
    evening = local.replace(hour=18, minute=0, second=0, microsecond=0)
    if local < morning:
        return morning
    if local < evening:
        return evening
    return (local + timedelta(days=1)).replace(hour=7, minute=0, second=0, microsecond=0)


def active_topics(config: dict[str, Any]) -> set[str]:
    topics = set()
    for workspace in config["workspaces"].values():
        topics.update(workspace.get("topics") or [])
    return topics & set(config["topics"])


def public_topic(topic_id: str, topic: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": topic_id,
        "short": topic.get("short") or topic_id[:2].upper(),
        "name": topic.get("name") or {"en": topic_id, "zh": topic_id},
        "color": topic.get("color") or "#0B6B5D",
        "color_dark": topic.get("color_dark") or topic.get("color") or "#6FD3BE",
        "description": topic.get("description") or {},
    }


def make_card(cluster: dict, topic: dict[str, Any], extractor: ExtractiveProvider) -> dict[str, Any]:
    card = {
        "id": cluster["id"],
        "topic": cluster["topic"],
        "headline": cluster.get("headline") or "",
        "headline_lang": cluster.get("headline_lang") or "en",
        "publisher": cluster.get("publisher") or "",
        "published": cluster.get("published") or "",
        "url": cluster.get("url") or "",
        "sources": [dict(source) for source in cluster.get("sources", [])],
        "comments": [dict(comment) for comment in cluster.get("comments", [])],
        "tags": list(cluster.get("tags") or []),
        "jurisdiction": cluster.get("jurisdiction") or "",
        "heat": round(float(cluster.get("heat", 0)), 4),
        "score": round(float(cluster.get("score", 0)), 4),
        "first_seen": cluster.get("first_seen") or "",
        "updated": cluster.get("updated") or "",
        "cluster_size": int(cluster.get("cluster_size", 1)),
        "lang": cluster.get("headline_lang") or "en",
    }
    neutral = {"persona": "", "lang": "en"}
    # Content follows the source language; only the app chrome is English.
    language = card.get("headline_lang") or "en"
    default = extractor.summarize(card, cluster, topic, neutral, language, language)
    card["bullets"] = default["bullets"]
    card["why"] = default["why"]
    return card


def clean_public_sources(card: dict) -> None:
    card["sources"] = [
        {
            "title": source.get("title") or "",
            "url": source.get("url") or "",
            "publisher": source.get("publisher") or "",
            "published": source.get("published") or "",
        }
        for source in card.get("sources", [])
        if source.get("url")
    ]


def workspace_output(workspace_id: str, workspace: dict[str, Any],
                     picks: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "name": workspace.get("name") or {"en": workspace_id, "zh": workspace_id},
        "description": workspace.get("description") or {},
        "lang": workspace.get("lang") or "en",
        "accent": workspace.get("accent") or "#0B6B5D",
        "topic_ids": list(workspace.get("topics") or []),
        "cap": int(workspace.get("cap") or 12),
        "picks": picks,
    }


def archive_index_entry(path: Path, data: dict[str, Any]) -> dict[str, Any]:
    counts = {key: len(value.get("picks") or []) for key, value in data.get("workspaces", {}).items()}
    return {
        "file": path.name,
        "generated_at": data.get("generated_at"),
        "edition_label": data.get("edition_label"),
        "counts": counts,
    }


def update_archive_index(out_dir: Path, edition_path: Path, edition_data: dict[str, Any],
                         now: datetime) -> None:
    index_path = out_dir / "archive" / "index.json"
    index = load_json(index_path, {"schema": 1, "updated_at": iso(now), "editions": []})
    editions = [entry for entry in index.get("editions", []) if entry.get("file") != edition_path.name]
    editions.append(archive_index_entry(edition_path, edition_data))
    editions.sort(key=lambda entry: entry.get("generated_at") or "", reverse=True)
    cutoff = now - timedelta(days=30)
    # Keep one edition per HKT date + slot. A manual run replaces that day's
    # Night edition instead of adding another duplicate row to the archive.
    slots: dict[tuple[str, str], dict] = {}
    for entry in editions:
        stamp = parse_datetime(entry.get("generated_at"), None)
        if stamp is None or stamp < cutoff:
            continue
        label = (entry.get("edition_label") or {}).get("en") or ""
        key = (stamp.astimezone(HKT).date().isoformat(), label)
        current = slots.get(key)
        if current is None or (entry.get("generated_at") or "") > (current.get("generated_at") or ""):
            slots[key] = entry
    kept = sorted(slots.values(), key=lambda entry: entry.get("generated_at") or "", reverse=True)
    write_json_atomic(index_path, {
        "schema": 1,
        "updated_at": iso(now),
        "editions": kept,
    })


def build(args: argparse.Namespace) -> int:
    config = load_config(args.config)
    now = parse_datetime(args.now, now_hkt()) if args.now else now_hkt()
    if now is None:
        raise RuntimeError("invalid --now value")
    now = now.astimezone(HKT)
    topics = config["topics"]
    workspaces = config["workspaces"]
    wanted_topics = active_topics(config)
    log(f"Daily Brief · {iso(now)} · topics={','.join(sorted(wanted_topics))}")

    items, statuses = asyncio.run(fetch_all(config, wanted_topics, now))
    ok = sum(1 for status in statuses if status.get("ok"))
    log(f"fetched {len(items)} items from {ok}/{len(statuses)} sources")
    for status in statuses:
        if not status.get("ok"):
            log(f"  source failed: {status.get('name')} [{status.get('topic')}] {status.get('error')}")
    if not items:
        raise RuntimeError("no items fetched; keeping the last good deployment")

    clusters = cluster_items(items, now)
    log(f"clustered into {len(clusters)} stories")
    by_topic = Counter(cluster.get("topic") for cluster in clusters)
    log("  " + ", ".join(f"{key}={value}" for key, value in sorted(by_topic.items())))

    cache_dir = ROOT / ".cache"
    seen_path = cache_dir / "seen.json"
    seen = prune_older(load_json(seen_path, {}), "last_seen", now, 14)
    scored = score_clusters(clusters, seen, topics, now)
    log(f"scored {len(scored)} stories inside their freshness windows")

    selected_by_workspace: dict[str, list[dict]] = {}
    for workspace_id, workspace in workspaces.items():
        selected = select_for_workspace(scored, workspace, topics, now)
        selected_by_workspace[workspace_id] = selected
        log(f"  {workspace_id}: {len(selected)} picks · " + ", ".join(
            f"{key}={value}" for key, value in sorted(Counter(c['topic'] for c in selected).items())
        ))

    all_selected_ids = {
        cluster["id"]
        for selected in selected_by_workspace.values()
        for cluster in selected
    }
    selected_clusters = [cluster for cluster in scored if cluster["id"] in all_selected_ids]
    rest = [cluster for cluster in scored if cluster["id"] not in all_selected_ids]
    remaining = max(0, args.max_cards - len(selected_clusters))
    pool = selected_clusters + rest[:remaining]
    pool.sort(
        key=lambda cluster: (float(cluster.get("score", 0)), cluster.get("published") or ""),
        reverse=True,
    )

    extractor = ExtractiveProvider()
    cards = [make_card(cluster, topics.get(cluster["topic"], {}), extractor) for cluster in pool]
    card_by_id = {card["id"]: card for card in cards}
    cluster_by_id = {cluster["id"]: cluster for cluster in pool}

    # HN comments are only fetched for a handful of selected stories.
    selected_cards = [card_by_id[cluster_id] for cluster_id in all_selected_ids if cluster_id in card_by_id]
    asyncio.run(enrich_comments(selected_cards, now, limit=6))

    # Pass None when no CLI override was given so the config's provider
    # (currently gemini) is respected. Passing "auto" here would silently
    # override the config and select GitHub Models instead.
    service = SummaryService(config, provider="extractive" if args.no_llm else args.provider)
    workspace_picks: dict[str, list[dict]] = {}
    for workspace_id, workspace in workspaces.items():
        picks = []
        for cluster in selected_by_workspace[workspace_id]:
            card = card_by_id.get(cluster["id"])
            if not card:
                continue
            topic_id = cluster["topic"]
            topic = topics.get(topic_id, {})
            content_lang = card.get("headline_lang") or cluster.get("headline_lang") or "en"
            result = service.summarize(card, cluster, topic, workspace, content_lang, content_lang)
            picks.append({
                "card_id": card["id"],
                "why": result["why"],
                "bullets": result["bullets"],
                "summary_source": result.get("mode", "extractive"),
            })
        workspace_picks[workspace_id] = picks

    # Strip internal-only fields before the JSON reaches the browser.
    for card in cards:
        clean_public_sources(card)
        card.pop("items", None)

    label = edition_label(now)
    meta = {
        "schema": 1,
        "generated_at": iso(now),
        "edition": iso(now),
        "edition_label": label,
        "next_update": iso(next_update(now)),
        "timezone": "Asia/Hong_Kong",
        "topics": [public_topic(topic_id, topic) for topic_id, topic in topics.items()],
        "workspaces": {
            workspace_id: workspace_output(workspace_id, workspace, workspace_picks.get(workspace_id) or [])
            for workspace_id, workspace in workspaces.items()
        },
        "cards": cards,
        "source_status": statuses,
        "stats": {
            "fetched": len(items),
            "sources_ok": ok,
            "sources_total": len(statuses),
            "clusters": len(clusters),
            "cards": len(cards),
            "brief_cards": {key: len(value) for key, value in workspace_picks.items()},
            "llm": {
                "calls": service.budget.used,
                "limit": service.budget.limit,
                "cache_hits": service.cache_hits,
                "failures": service.failures,
            },
        },
    }

    # The edition copy contains only the cards actually selected by a workspace.
    selected_cards_public = [
        card for card in cards if card["id"] in all_selected_ids
    ]
    edition_meta = json.loads(json.dumps(meta, ensure_ascii=False))
    edition_meta["cards"] = selected_cards_public
    edition_meta["stats"] = dict(meta["stats"])
    edition_meta["stats"]["cards"] = len(selected_cards_public)

    errors = validate_brief(meta, config)
    if errors:
        raise RuntimeError("brief validation failed:\n- " + "\n- ".join(errors[:20]))
    edition_errors = validate_brief(edition_meta, config)
    if edition_errors:
        raise RuntimeError("archive validation failed:\n- " + "\n- ".join(edition_errors[:20]))

    if args.dry_run:
        log("dry run; not writing")
        for workspace_id, picks in workspace_picks.items():
            log(f"  {workspace_id}:")
            for pick in picks:
                card = card_by_id[pick["card_id"]]
                log(f"    [{card['topic']}] {card['headline']}  ({card['score']})")
        log(service.report())
        return 0

    out_dir = Path(args.out)
    archive_dir = out_dir / "archive"
    edition_file = now.strftime("%Y-%m-%d-%H%M") + ".json"
    edition_path = archive_dir / edition_file
    write_json_atomic(out_dir / "today.json", meta)
    write_json_atomic(edition_path, edition_meta)
    update_archive_index(out_dir, edition_path, edition_meta, now)

    cache_dir.mkdir(parents=True, exist_ok=True)
    write_json_atomic(seen_path, update_seen(seen, scored, now, keep_days=14))
    service.save_cache()

    log(f"wrote {out_dir / 'today.json'} ({len(cards)} cards)")
    log(f"wrote {edition_path} ({len(selected_cards_public)} picked cards)")
    log(service.report())
    if service.provider_notes:
        for note in service.provider_notes[-3:]:
            log(f"  note: {note}")
    return 0


def main() -> int:
    args = parse_args()
    try:
        return build(args)
    except Exception as error:
        print(f"ERROR: {type(error).__name__}: {error}", file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
