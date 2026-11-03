from __future__ import annotations

import sys
import unittest
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from selection import score_clusters, select_for_workspace
from util import HKT, iso


def cluster(cid: str, topic: str, score: float) -> dict:
    return {
        "id": cid,
        "topic": topic,
        "score": score,
        "published": iso(datetime(2026, 11, 4, 6, 0, tzinfo=HKT)),
        "sources": [{"url": f"https://example.com/{cid}", "trust": 0.8}],
        "cluster_size": 1,
    }


class SelectionTests(unittest.TestCase):
    def test_topic_caps_and_total_cap(self):
        topics = {"a": {"min_score": 0.0}, "b": {"min_score": 0.0}}
        workspace = {"topics": ["a", "b"], "cap": 4, "topic_cap": 2}
        clusters = [
            cluster("a1", "a", 0.9), cluster("a2", "a", 0.8), cluster("a3", "a", 0.7),
            cluster("b1", "b", 0.6), cluster("b2", "b", 0.5), cluster("b3", "b", 0.4),
        ]
        selected = select_for_workspace(clusters, workspace, topics, datetime(2026, 11, 4, 7, 0, tzinfo=HKT))
        self.assertEqual(len(selected), 4)
        counts = {}
        for row in selected:
            counts[row["topic"]] = counts.get(row["topic"], 0) + 1
        self.assertLessEqual(counts["a"], 2)
        self.assertLessEqual(counts["b"], 2)

    def test_topic_specific_cap(self):
        topics = {"a": {"min_score": 0.0}, "b": {"min_score": 0.0}}
        workspace = {"topics": ["a", "b"], "cap": 4, "topic_cap": 3, "topic_caps": {"a": 1}}
        clusters = [cluster("a1", "a", 0.9), cluster("a2", "a", 0.8), cluster("b1", "b", 0.7), cluster("b2", "b", 0.6)]
        selected = select_for_workspace(clusters, workspace, topics, datetime(2026, 11, 4, 7, 0, tzinfo=HKT))
        self.assertEqual(sum(1 for row in selected if row["topic"] == "a"), 1)

    def test_tag_minimum_brings_forward_hk_cards(self):
        topics = {"cyber": {"min_score": 0.0}}
        workspace = {
            "topics": ["cyber"], "cap": 4, "topic_cap": 4,
            "tag_min": {"cyber": {"HK": 2}},
        }
        clusters = [
            cluster("g1", "cyber", 0.9), cluster("g2", "cyber", 0.8),
            cluster("g3", "cyber", 0.7), cluster("h1", "cyber", 0.4),
            cluster("h2", "cyber", 0.3),
        ]
        for row in clusters:
            row["tags"] = ["HK"] if row["id"].startswith("h") else ["Global"]
        selected = select_for_workspace(clusters, workspace, topics, datetime(2026, 11, 4, 7, 0, tzinfo=HKT))
        tags = [tag for row in selected for tag in row.get("tags", [])]
        self.assertEqual(tags.count("HK"), 2)
        self.assertEqual(len(selected), 4)

    def test_tag_cap_limits_tool_cards(self):
        topics = {"ai": {"min_score": 0.0}}
        workspace = {
            "topics": ["ai"], "cap": 4, "topic_cap": 4,
            "tag_caps": {"ai": {"Tool": 2}},
        }
        clusters = [
            cluster("t1", "ai", 0.9), cluster("t2", "ai", 0.8),
            cluster("t3", "ai", 0.7), cluster("t4", "ai", 0.6),
            cluster("m1", "ai", 0.5), cluster("m2", "ai", 0.4),
        ]
        for row in clusters:
            row["tags"] = ["Tool"] if row["id"].startswith("t") else ["Model"]
        selected = select_for_workspace(clusters, workspace, topics, datetime(2026, 11, 4, 7, 0, tzinfo=HKT))
        tools = [row for row in selected if "Tool" in row.get("tags", [])]
        self.assertEqual(len(selected), 4)
        self.assertLessEqual(len(tools), 2)

    def test_old_items_drop_out(self):
        topics = {"a": {"min_score": 0.0, "max_age_hours": 48, "half_life_hours": 18}}
        old = cluster("old", "a", 0.9)
        old["published"] = "2026-10-01T07:00:00+08:00"
        fresh = cluster("fresh", "a", 0.2)
        fresh["published"] = "2026-11-04T06:00:00+08:00"
        scored = score_clusters([old, fresh], {}, topics, datetime(2026, 11, 4, 7, 0, tzinfo=HKT))
        self.assertEqual([row["id"] for row in scored], ["fresh"])


if __name__ == "__main__":
    unittest.main()
