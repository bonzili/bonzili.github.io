from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from summarize import (
    ExtractiveProvider, ProviderUnavailable, SummaryError, SummaryService,
    numbers_grounded, prompt_for, strip_off_topic_bullets,
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


class ContaminatedProvider:
    name = "contaminated"

    def summarize(self, *args, **kwargs):
        return {
            "bullets": [
                "Keycloak CVE-2026-117691 allows a SAML signature bypass.",
                "The flaw affects federated identity flows.",
                "Mayday fans should note the band is on hiatus.",
            ],
            "why": "Patch federated identity providers.",
        }


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

    def test_off_topic_provider_padding_is_stripped_before_shipping(self):
        with tempfile.TemporaryDirectory() as tmp:
            config = {"summarization": {"cache_path": str(Path(tmp) / "cache.json"), "max_calls": 4}}
            service = SummaryService(config, "extractive")
            service.providers = [ContaminatedProvider()]
            card = {
                "id": "c1", "headline": "Keycloak CVE", "publisher": "Example",
                "headline_lang": "en", "topic": "rt", "bullets": ["fallback"],
                "why": "fallback", "jurisdiction": "",
            }
            cluster = {"items": [{
                "title": "Keycloak CVE",
                "summary": "Keycloak CVE-2026-117691 allows a SAML signature bypass. The flaw affects federated identity flows.",
                "publisher": "Example", "trust": 0.8, "published": "", "lang": "en",
            }]}
            result = service.summarize(card, cluster, {"name": {"en": "RT"}}, {"persona": "reader"}, "en", "en")
            self.assertEqual(result["mode"], "ai")
            self.assertEqual(len(result["bullets"]), 2)
            self.assertNotIn("Mayday", " ".join(result["bullets"]))

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

    def test_off_topic_bullet_is_removed(self):
        result = {
            "bullets": [
                "Keycloak CVE-2026-117691 allows a SAML signature bypass.",
                "The flaw affects federated identity flows and account takeover.",
                "Mayday fans should note the band is on hiatus this season.",
            ],
            "why": "Patch identity providers that rely on SAML federation.",
        }
        source = (
            "Keycloak CVE-2026-117691 allows a SAML signature bypass. "
            "The flaw affects federated identity flows and account takeover."
        )
        cleaned = strip_off_topic_bullets(result, source, "rt")
        self.assertIsNotNone(cleaned)
        self.assertEqual(len(cleaned["bullets"]), 2)
        self.assertNotIn("Mayday", " ".join(cleaned["bullets"]))

    def test_summary_with_only_one_grounded_bullet_is_rejected(self):
        result = {
            "bullets": [
                "A real fact from the source.",
                "易烊千璽近期參與公益活動。",
            ],
            "why": "A real takeaway.",
        }
        self.assertIsNone(strip_off_topic_bullets(
            result, "A real fact from the source.", "legal",
        ))

    def test_jackson_break_does_not_use_negative_legal_framing(self):
        card = {
            "id": "c1", "headline": "易烊千璽穿搭", "publisher": "Example",
            "headline_lang": "zh-Hant", "topic": "jackson",
        }
        _system, user = prompt_for(
            card, {"items": []}, {"name": {"en": "Jackson Yee"}},
            {"persona": "a lawyer"}, "zh-Hant", "zh-Hant",
        )
        self.assertIn("do not write that it is unrelated to legal work", user)

    def test_extractive_does_not_repeat_a_headline_as_a_bullet(self):
        provider = ExtractiveProvider()
        card = {
            "id": "c1", "headline": "Headline only", "publisher": "Example",
            "headline_lang": "en", "topic": "ai", "bullets": ["fallback"],
            "why": "fallback", "jurisdiction": "",
        }
        cluster = {"items": [
            {
                "title": "Headline only", "summary": "", "publisher": "Example",
                "trust": 0.9, "published": "", "lang": "en",
            },
            {
                "title": "Useful follow-up",
                "summary": "A useful sentence about the thing that happened today.",
                "publisher": "Example", "trust": 0.8, "published": "", "lang": "en",
            },
        ]}
        result = provider.summarize(card, cluster, {"name": {"en": "AI"}}, {"persona": "reader"}, "en", "en")
        self.assertEqual(result["bullets"], [
            "A useful sentence about the thing that happened today.",
        ])

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
