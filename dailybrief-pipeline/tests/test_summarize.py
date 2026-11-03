from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from summarize import SummaryService


class BrokenProvider:
    name = "broken"

    def summarize(self, *args, **kwargs):
        raise ValueError("Expecting value: line 1 column 1 (char 0)")


class SummaryFallbackTests(unittest.TestCase):
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
