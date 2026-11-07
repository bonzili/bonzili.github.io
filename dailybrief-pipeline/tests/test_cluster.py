from __future__ import annotations

import sys
import unittest
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from cluster import cluster_items
from util import HKT, iso


def item(title: str, *, topic: str = "ai", url: str | None = None, source: str = "Test") -> dict:
    return {
        "id": title,
        "topic": topic,
        "title": title,
        "url": url or f"https://example.com/{abs(hash(title))}",
        "publisher": source,
        "published": iso(datetime(2026, 11, 4, 6, 0, tzinfo=HKT)),
        "summary": title,
        "lang": "en",
        "trust": 0.8,
        "heat": 0.4,
        "comments": [],
    }


class ClusterTests(unittest.TestCase):
    def test_english_duplicates_cluster(self):
        now = datetime(2026, 11, 4, 7, 0, tzinfo=HKT)
        items = [
            item("OpenAI releases GPT-6.1 Terra with a 1M-token context window"),
            item("OpenAI launches GPT-6.1 Terra with a 1M token context window"),
        ]
        clusters = cluster_items(items, now)
        self.assertEqual(len(clusters), 1)
        self.assertEqual(clusters[0]["cluster_size"], 2)

    def test_cjk_duplicates_cluster(self):
        now = datetime(2026, 11, 4, 7, 0, tzinfo=HKT)
        items = [
            item("五月天石頭爆退團 阿信深夜感性說話了", topic="mayday"),
            item("五月天石頭傳退團 阿信深夜發文", topic="mayday"),
        ]
        clusters = cluster_items(items, now)
        self.assertEqual(len(clusters), 1)

    def test_different_topics_do_not_cluster(self):
        now = datetime(2026, 11, 4, 7, 0, tzinfo=HKT)
        items = [
            item("OpenAI releases a new model", topic="ai"),
            item("OpenAI releases a new model", topic="cyber"),
        ]
        clusters = cluster_items(items, now)
        self.assertEqual(len(clusters), 2)

    def test_cross_language_is_not_merged(self):
        now = datetime(2026, 11, 4, 7, 0, tzinfo=HKT)
        items = [
            item("Mayday Stone leaves the band", topic="mayday"),
            item("五月天石頭退團", topic="mayday"),
        ]
        clusters = cluster_items(items, now)
        self.assertEqual(len(clusters), 2)

    def test_no_cluster_items_stay_separate_despite_shared_prefix(self):
        now = datetime(2026, 11, 4, 7, 0, tzinfo=HKT)
        first = item("New on OpenRouter: LiquidAI: LFM3-1.7B", url="https://openrouter.ai/liquid/lfm-3-1.7b")
        second = item("New on OpenRouter: Google: Gemini Omni 1.2 Flash", url="https://openrouter.ai/google/gemini-omni-1.2-flash")
        first["no_cluster"] = True
        second["no_cluster"] = True
        clusters = cluster_items([first, second], now)
        self.assertEqual(len(clusters), 2)

    def test_short_titles_do_not_merge_on_words_alone(self):
        now = datetime(2026, 11, 4, 7, 0, tzinfo=HKT)
        items = [
            item("News update", url="https://example.com/news-one"),
            item("News update", url="https://example.com/news-two"),
        ]
        clusters = cluster_items(items, now)
        self.assertEqual(len(clusters), 2)


if __name__ == "__main__":
    unittest.main()
