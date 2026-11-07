from __future__ import annotations

import json
import sys
import unittest
from datetime import datetime
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fetch import (
    artificial_analysis_item, contains_keyword, enrich_thin_sources, fetch_hn,
    matches_filter, parse_artificial_analysis, parse_count,
    strip_news_date_suffix, useful_page_text,
)
from util import HKT, body_text, has_body_text


AA_HTML = """
<html><head>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which AI model ranks #1 on the LLM Leaderboard?",
      "acceptedAnswer": {"@type": "Answer", "text": "Gemini 4 Carbon (High) currently ranks #1 on the Artificial Analysis LLM Leaderboard with an Intelligence Index score of 59, out of 91 models ranked."}
    },
    {
      "@type": "Question",
      "name": "What are the top models on the LLM Leaderboard?",
      "acceptedAnswer": {"@type": "Answer", "text": "The top models by Intelligence Index are: 1. Gemini 4 Carbon (High) (59), 2. Claude Opus 5.5 (Max, Default Fallback) (58), 3. Gemini 4 Carbon (Medium) (58)."}
    },
    {
      "@type": "Question",
      "name": "Which is the best open weights model on the leaderboard?",
      "acceptedAnswer": {"@type": "Answer", "text": "DeepSeek V4.1 Flash is the highest-ranked open weights model with an Intelligence Index score of 32."}
    }
  ]
}
</script>
</head><body></body></html>
"""


class FetchTests(unittest.TestCase):
    def test_keyword_matches_common_plurals(self):
        self.assertTrue(contains_keyword("two new models", "model"))
        self.assertTrue(contains_keyword("three CVEs", "CVE"))
        self.assertTrue(contains_keyword("patches released", "patch"))
        self.assertFalse(contains_keyword("modelled data", "model"))

    def test_old_jackson_headline_is_filtered(self):
        source = {"exclude_keywords": ["私人IG", "朝聖", "10萬粉"]}
        self.assertFalse(matches_filter(
            source,
            "是真的！易烊千璽私人IG曝光 瞬間湧10萬粉朝聖",
            "",
        ))

    def test_no_cluster_flag_is_carried_to_items(self):
        from fetch import base_item
        source = {
            "id": "openrouter-new", "name": "OpenRouter", "topic": "ai",
            "trust": 0.8, "lang": "en", "no_cluster": True,
        }
        row = base_item(
            source, title="New on OpenRouter: Model A", url="https://example.com/a",
            publisher="OpenRouter", published=datetime(2026, 11, 7, 4, 0, tzinfo=HKT),
            summary="A model.", now=datetime(2026, 11, 7, 4, 0, tzinfo=HKT),
        )
        self.assertTrue(row["no_cluster"])

    def test_business_story_is_filtered_from_ai_topic(self):
        source = {"exclude_keywords": ["valuation", "IPO", "funding", "stock"]}
        self.assertFalse(matches_filter(
            source,
            "Anthropic IPO buyers see valuation as low as $1.1T",
            "",
        ))

    def test_google_news_date_suffix_is_stripped(self):
        self.assertEqual(
            strip_news_date_suffix("黃之鋒勾結外國勢力案周四判刑 - 20261104 - 港聞"),
            "黃之鋒勾結外國勢力案周四判刑",
        )
        self.assertEqual(
            strip_news_date_suffix("5機構泄資料 客戶最高損失150萬 - 20261103 - 港聞"),
            "5機構泄資料 客戶最高損失150萬",
        )

    def test_parse_count(self):
        self.assertEqual(parse_count("1,234 stars today"), 1234)
        self.assertEqual(parse_count("no digits"), 0)

    def test_artificial_analysis_faq_is_parsed(self):
        parsed = parse_artificial_analysis(AA_HTML)
        self.assertIn("Gemini 4 Carbon", parsed["top"])
        self.assertIn("score of 59", parsed["top1"])
        self.assertIn("DeepSeek", parsed["open_weights"])

    def test_artificial_analysis_item_headline_uses_top_score(self):
        parsed = parse_artificial_analysis(AA_HTML)
        source = {
            "id": "artificial-analysis", "name": "Artificial Analysis",
            "topic": "ai", "tags": ["Benchmark"],
            "url": "https://artificialanalysis.ai/leaderboards/models",
        }
        item = artificial_analysis_item(parsed, source, datetime(2026, 11, 4, 7, 0, tzinfo=HKT))
        self.assertIn("Gemini 4 Carbon (High)", item["title"])
        self.assertIn("(59)", item["title"])
        self.assertIn("Benchmark", item["tags"])
        self.assertIn("top models", item["summary"])


class ThinSourceTests(unittest.IsolatedAsyncioTestCase):
    def test_google_news_title_is_not_article_text(self):
        item = {
            "title": "Japan's Takaichi pushes for tougher cybersecurity laws",
            "summary": "Japan's Takaichi pushes for tougher cybersecurity laws - Nikkei Asia",
            "publisher": "Nikkei Asia",
        }
        self.assertEqual(body_text(item), "")
        self.assertFalse(has_body_text({"items": [item]}))

    def test_google_news_boilerplate_is_not_article_text(self):
        self.assertFalse(useful_page_text(
            "Comprehensive up-to-date news coverage, aggregated from sources all over the world by Google News."
        ))
        self.assertTrue(useful_page_text(
            "The minister said Japan will submit a tougher cybersecurity bill to parliament next year."
        ))

    def test_a_real_summary_counts_as_article_text(self):
        item = {
            "title": "Japan's Takaichi pushes for tougher cybersecurity laws",
            "summary": "The minister said the government will submit a bill to parliament next year.",
            "publisher": "Nikkei Asia",
        }
        self.assertTrue(has_body_text({"items": [item]}))

    async def test_thin_card_gets_article_description(self):
        html = """
        <html><head>
        <meta name="description" content="The minister said Japan will submit a tougher cybersecurity bill to parliament next year after a surge in attacks.">
        </head><body></body></html>
        """

        class FakeResponse:
            text = html

        async def fake_get(*args, **kwargs):
            return FakeResponse()

        cluster = {
            "headline": "Japan's Takaichi pushes for tougher cybersecurity laws",
            "summary": "",
            "items": [{
                "title": "Japan's Takaichi pushes for tougher cybersecurity laws",
                "summary": "Japan's Takaichi pushes for tougher cybersecurity laws - Nikkei Asia",
                "publisher": "Nikkei Asia", "url": "https://example.com/story",
                "trust": 0.8, "published": "",
            }],
        }
        with patch("fetch.get", fake_get):
            await enrich_thin_sources([cluster], datetime(2026, 11, 7, 4, 0, tzinfo=HKT))
        self.assertIn("tougher cybersecurity bill", cluster["summary"])
        self.assertTrue(has_body_text(cluster))


class HNFilterTests(unittest.IsolatedAsyncioTestCase):
    async def test_hn_respects_topic_excludes(self):
        payload = {
            "hits": [{
                "title": "Anthropic IPO buyers see valuation as low as $1.1T",
                "points": 400,
                "num_comments": 120,
                "objectID": "1",
                "url": "https://example.com/anthropic",
                "created_at": "2026-11-06T19:00:00Z",
                "story_text": "",
            }]
        }

        class FakeResponse:
            def json(self):
                return payload

        async def fake_get(*args, **kwargs):
            return FakeResponse()

        source = {
            "id": "hn-front", "name": "Hacker News", "topic": "ai",
            "trust": 0.65, "lang": "en", "keywords": ["Anthropic"],
            "exclude_keywords": ["valuation", "IPO"], "min_points": 60,
            "max_items": 5,
        }
        with patch("fetch.get", fake_get):
            items = await fetch_hn(None, source, datetime(2026, 11, 7, 4, 0, tzinfo=HKT))
        self.assertEqual(items, [])


if __name__ == "__main__":
    unittest.main()
