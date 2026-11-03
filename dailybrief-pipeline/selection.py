"""Score clusters and choose each workspace's finite brief."""
from __future__ import annotations

from collections import Counter
from datetime import datetime, timedelta
from typing import Any

from util import age_hours, clamp, iso, parse_datetime


def score_clusters(clusters: list[dict], seen: dict[str, Any], topics: dict[str, Any],
                   now: datetime) -> list[dict]:
    scored = []
    for cluster in clusters:
        topic = topics.get(cluster.get("topic"), {})
        published = parse_datetime(cluster.get("published"), None)
        age = age_hours(published, now)
        max_age = float(topic.get("max_age_hours", 72))
        if age > max_age:
            continue

        half_life = float(topic.get("half_life_hours", 18))
        freshness = 0.5 ** (age / max(1.0, half_life))
        trust = max((float(source.get("trust", 0.5)) for source in cluster.get("sources", [])), default=0.5)
        trust = clamp(trust + 0.02 * max(0, cluster.get("cluster_size", 1) - 1))
        heat = clamp(float(cluster.get("heat", 0)))
        size = min(1.0, float(cluster.get("cluster_size", 1)) / 4.0)

        base = 0.42 * freshness + 0.27 * trust + 0.20 * heat + 0.11 * size

        previous = seen.get(cluster["id"])
        repeat_factor = 1.0
        new_sources = 0
        if previous:
            previous_urls = set(previous.get("source_urls") or [])
            current_urls = {source.get("url") for source in cluster.get("sources", []) if source.get("url")}
            new_sources = len(current_urls - previous_urls)
            last_seen = parse_datetime(previous.get("last_seen"), None)
            hours_since = ((now - last_seen).total_seconds() / 3600.0) if last_seen else 999.0
            if new_sources:
                repeat_factor = 0.92
            elif hours_since <= 36:
                repeat_factor = 0.32
            else:
                repeat_factor = 0.16

        score = clamp(base * repeat_factor)
        if score < 0.02:
            continue
        cluster["score"] = round(score, 4)
        cluster["base_score"] = round(base, 4)
        cluster["repeat_factor"] = round(repeat_factor, 3)
        cluster["new_sources"] = new_sources
        cluster["first_seen"] = (previous or {}).get("first_seen") or iso(now)
        cluster["updated"] = iso(now)
        cluster["is_new"] = previous is None
        scored.append(cluster)

    scored.sort(key=lambda cluster: (
        float(cluster.get("score", 0)),
        parse_datetime(cluster.get("published"), None) or datetime.min,
        cluster.get("id", ""),
    ), reverse=True)
    return scored


def select_for_workspace(clusters: list[dict], workspace: dict[str, Any],
                         topics: dict[str, Any], now: datetime) -> list[dict]:
    allowed = set(workspace.get("topics") or [])
    weights = workspace.get("topic_weights") or {}
    caps = workspace.get("topic_caps") or {}
    default_cap = int(workspace.get("topic_cap", 4))
    cap = int(workspace.get("cap", 12))

    candidates = []
    for cluster in clusters:
        topic_id = cluster.get("topic")
        if topic_id not in allowed:
            continue
        topic = topics.get(topic_id, {})
        if float(cluster.get("score", 0)) < float(topic.get("min_score", 0.05)):
            continue
        rank = float(cluster.get("score", 0)) * float(weights.get(topic_id, 1.0))
        candidates.append((rank, cluster))
    candidates.sort(key=lambda row: (
        row[0],
        parse_datetime(row[1].get("published"), None) or datetime.min,
        row[1].get("id", ""),
    ), reverse=True)

    selected: list[dict] = []
    counts: Counter[str] = Counter()
    selected_ids: set[str] = set()

    # One guaranteed slot per topic when that topic has a live story. This is
    # what stops a busy AI or legal day from squeezing out Mayday or Jackson.
    if int(workspace.get("min_per_topic", 1)) > 0:
        first_by_topic: dict[str, dict] = {}
        for _rank, cluster in candidates:
            first_by_topic.setdefault(cluster.get("topic", ""), cluster)
        for topic_id in workspace.get("topics") or []:
            cluster = first_by_topic.get(topic_id)
            if not cluster or len(selected) >= cap:
                continue
            selected.append(cluster)
            selected_ids.add(cluster["id"])
            counts[topic_id] += 1

    # A topic can require a minimum number of cards carrying a particular tag.
    # This is how the cyber brief guarantees a Hong Kong desk (tag HK) without
    # sacrificing the global stories.
    for topic_id, tag_minimums in (workspace.get("tag_min") or {}).items():
        if topic_id not in allowed or not isinstance(tag_minimums, dict):
            continue
        topic_cap = int(caps.get(topic_id, default_cap))
        for tag, minimum in tag_minimums.items():
            try:
                minimum = int(minimum)
            except (TypeError, ValueError):
                continue
            current = sum(
                1 for cluster in selected
                if cluster.get("topic") == topic_id and tag in (cluster.get("tags") or [])
            )
            if current >= minimum:
                continue
            for _rank, cluster in candidates:
                if current >= minimum or len(selected) >= cap:
                    break
                if cluster.get("id") in selected_ids:
                    continue
                if cluster.get("topic") != topic_id or tag not in (cluster.get("tags") or []):
                    continue
                if counts[topic_id] >= topic_cap:
                    break
                selected.append(cluster)
                selected_ids.add(cluster["id"])
                counts[topic_id] += 1
                current += 1

    rank_by_id = {cluster["id"]: rank for rank, cluster in candidates}
    for _rank, cluster in candidates:
        if len(selected) >= cap:
            break
        if cluster["id"] in selected_ids:
            continue
        topic_id = cluster.get("topic", "")
        topic_cap = int(caps.get(topic_id, default_cap))
        if counts[topic_id] >= topic_cap:
            continue
        selected.append(cluster)
        selected_ids.add(cluster["id"])
        counts[topic_id] += 1

    selected.sort(key=lambda cluster: rank_by_id.get(cluster["id"], 0), reverse=True)
    return selected


def update_seen(seen: dict[str, Any], clusters: list[dict], now: datetime,
                keep_days: int = 14) -> dict[str, Any]:
    updated = dict(seen)
    for cluster in clusters:
        previous = updated.get(cluster["id"]) or {}
        updated[cluster["id"]] = {
            "first_seen": previous.get("first_seen") or iso(now),
            "last_seen": iso(now),
            "source_urls": [source.get("url") for source in cluster.get("sources", []) if source.get("url")],
            "count": cluster.get("cluster_size", 1),
        }
    cutoff = now - timedelta(days=keep_days)
    pruned = {}
    for key, value in updated.items():
        last_seen = parse_datetime(value.get("last_seen"), None)
        if last_seen is None or last_seen >= cutoff:
            pruned[key] = value
    return pruned
