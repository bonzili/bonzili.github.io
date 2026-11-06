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

    def test_tool_items_get_a_longer_age_window(self):
        topics = {
            "ai": {
                "min_score": 0.0, "max_age_hours": 72, "half_life_hours": 18,
                "tool_max_age_hours": 336,
            }
        }
        tool = cluster("tool", "ai", 0.4)
        tool["published"] = "2026-10-25T07:00:00+08:00"
        tool["tags"] = ["Tool"]
        model = cluster("model", "ai", 0.4)
        model["published"] = "2026-10-25T07:00:00+08:00"
        model["tags"] = ["Model"]
        scored = score_clusters([tool, model], {}, topics, datetime(2026, 11, 4, 7, 0, tzinfo=HKT))
        self.assertEqual([row["id"] for row in scored], ["tool"])

    def test_thin_card_is_demoted_below_explained_card(self):
        topics = {"a": {"min_score": 0.0, "thin_penalty": 0.7}}
        workspace = {"topics": ["a"], "cap": 1, "topic_cap": 1}
        thin = cluster("thin", "a", 0.9)
        thin["headline"] = "Headline only"
        thin["items"] = [{
            "title": "Headline only",
            "summary": "Headline only - Publisher",
            "publisher": "Publisher",
        }]
        full = cluster("full", "a", 0.8)
        full["headline"] = "Explained story"
        full["items"] = [{
            "title": "Explained story",
            "summary": "The regulator said the new rule takes effect next month and covers all providers.",
            "publisher": "Publisher",
        }]
        selected = select_for_workspace(
            [thin, full], workspace, topics,
            datetime(2026, 11, 7, 3, 0, tzinfo=HKT),
        )
        self.assertEqual([row["id"] for row in selected], ["full"])

    def test_workspace_topic_filter_drops_unrelated_hk_story(self):
        topics = {"hk": {"min_score": 0.0}}
        workspace = {
            "topics": ["hk"], "cap": 3, "topic_cap": 3,
            "topic_filters": {"hk": ["法庭", "法院", "判刑"]},
        }
        fire = cluster("fire", "hk", 0.9)
        fire["headline"] = "元朗三級火警（二）"
        court = cluster("court", "hk", 0.8)
        court["headline"] = "法庭就黃之鋒串謀勾結案判刑"
        selected = select_for_workspace(
            [fire, court], workspace, topics,
            datetime(2026, 11, 7, 3, 0, tzinfo=HKT),
        )
        self.assertEqual([row["id"] for row in selected], ["court"])

    def test_near_duplicate_stories_are_not_selected_twice(self):
        topics = {"hk": {"min_score": 0.0}}
        workspace = {"topics": ["hk"], "cap": 3, "topic_cap": 3}
        fire1 = cluster("fire1", "hk", 0.9)
        fire1["headline"] = "元朗三級火警（二）"
        fire2 = cluster("fire2", "hk", 0.8)
        fire2["headline"] = "元朗白沙村一個衣紙倉庫發生三級火"
        other = cluster("other", "hk", 0.7)
        other["headline"] = "香港第三季 GDP 增長 5.2%"
        selected = select_for_workspace(
            [fire1, fire2, other], workspace, topics,
            datetime(2026, 11, 7, 3, 0, tzinfo=HKT),
        )
        headlines = [row["headline"] for row in selected]
        self.assertIn("元朗三級火警（二）", headlines)
        self.assertNotIn("元朗白沙村一個衣紙倉庫發生三級火", headlines)
        self.assertIn("香港第三季 GDP 增長 5.2%", headlines)

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
