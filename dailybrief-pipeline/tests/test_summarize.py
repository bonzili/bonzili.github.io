from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from summarize import (
    ExtractiveProvider, ProviderUnavailable, SummaryError, SummaryService,
    numbers_grounded,
)


class BrokenProvider:
    name = "broken"

    def summarize(self, *args, **kwargs):
        raise ValueError("Expecting value: line 1 column 1 (char 0)")


class FlakyProvider:
    name = "flaky"

    def __init__(self):
        self.calls = 0

    def summarize(self, card, *args, **kwargs):
        self.calls += 1
        if self.calls == 1:
            raise SummaryError("not enough bullets")
        return {"bullets": ["A grounded bullet.", "Another grounded bullet."], "why": "Why it matters."}


class UnavailableProvider:
    name = "unavailable"

    def summarize(self, *args, **kwargs):
        raise ProviderUnavailable("rate limited")


class SummaryFallbackTests(unittest.TestCase):
    def test_numbers_must_appear_in_sources(self):
        result = {"bullets": ["Revenue grew 42% this year."], "why": "A 42% jump."}
        self.assertFalse(numbers_grounded(result, "Revenue grew 12% this year."))
        self.assertTrue(numbers_grounded(result, "Revenue grew 42% this year."))

    def test_card_level_failure_keeps_provider_for_later_cards(self):
        with tempfile.TemporaryDirectory() as tmp:
            config = {"summarization": {"cache_path": str(Path(tmp) / "cache.json"), "max_calls": 4}}
            service = SummaryService(config, "extractive")
            provider = FlakyProvider()
            service.providers = [provider]
            card = {
                "id": "c1", "headline": "A useful headline", "publisher": "Example",
                "headline_lang": "en", "topic": "ai", "bullets": ["fallback"],
                "why": "fallback", "jurisdiction": "",
            }
            cluster = {
                "summary": "A useful sentence about the thing that happened today.",
                "items": [{
                    "title": "A useful headline",
                    "summary": "A useful sentence about the thing that happened today.",
                    "publisher": "Example", "trust": 0.8, "published": "", "lang": "en",
                }],
            }
            first = service.summarize(card, cluster, {"name": {"en": "AI"}}, {"persona": "reader"}, "en", "en")
            second = service.summarize(card, cluster, {"name": {"en": "AI"}}, {"persona": "reader"}, "en", "en")
            self.assertEqual(first["mode"], "extractive")
            self.assertEqual(second["mode"], "ai")
            self.assertEqual(provider.calls, 2)
            self.assertEqual(service.providers, [provider])

    def test_provider_unavailable_is_disabled(self):
        with tempfile.TemporaryDirectory() as tmp:
            config = {"summarization": {"cache_path": str(Path(tmp) / "cache.json"), "max_calls": 4}}
            service = SummaryService(config, "extractive")
            service.providers = [UnavailableProvider()]
            self.assertFalse(service.providers == [])
            card = {"id": "c1", "headline": "H", "publisher": "P", "headline_lang": "en", "topic": "ai", "bullets": ["b"], "why": "w", "jurisdiction": ""}
            cluster = {"items": [{"title": "H", "summary": "A useful sentence about today.", "publisher": "P", "trust": 0.8, "published": "", "lang": "en"}]}
            result = service.summarize(card, cluster, {"name": {"en": "AI"}}, {"persona": "reader"}, "en", "en")
            self.assertEqual(result["mode"], "extractive")
            self.assertEqual(service.providers, [])

    def test_extractive_does_not_use_short_abbreviation_fragment(self):
        provider = ExtractiveProvider()
        card = {
            "id": "c1", "headline": "GAO Report: USPTO backlog", "publisher": "IPWatchdog",
            "headline_lang": "en", "topic": "legal", "bullets": ["fallback"],
            "why": "fallback", "jurisdiction": "US",
        }
        cluster = {"items": [{
            "title": "GAO Report: USPTO backlog",
            "summary": "Today, the U.S. Government Accountability Office said the USPTO backlog plan is unsustainable without staffing changes.",
            "publisher": "IPWatchdog", "trust": 0.8, "published": "", "lang": "en",
        }]}
        result = provider.summarize(card, cluster, {"name": {"en": "APAC legal"}}, {"persona": "lawyer"}, "en", "en")
        self.assertNotEqual(result["why"], "US: Today, the U.S.")

    def test_provider_crash_falls_back_to_extractive(self):
        with tempfile.TemporaryDirectory() as tmp:
            config = {"summarization": {"cache_path": str(Path(tmp) / "cache.json"), "max_calls": 4}}
            service = SummaryService(config, "extractive")
            service.providers = [BrokenProvider()]
            card = {
                "id": "c1", "headline": "A useful headline", "publisher": "Example",
                "headline_lang": "en", "topic": "ai", "bullets": ["fallback"],
                "why": "fallback", "jurisdiction": "",
            }
            cluster = {
                "summary": "A useful sentence about the thing that happened today.",
                "items": [{
                    "title": "A useful headline",
                    "summary": "A useful sentence about the thing that happened today.",
                    "publisher": "Example", "trust": 0.8, "published": "", "lang": "en",
                }],
            }
            result = service.summarize(card, cluster, {"name": {"en": "AI"}}, {"persona": "reader"}, "en", "en")
            self.assertTrue(result["bullets"])
            self.assertTrue(result["why"])
            self.assertEqual(service.failures, 1)
            self.assertEqual(service.providers, [])


if __name__ == "__main__":
    unittest.main()
