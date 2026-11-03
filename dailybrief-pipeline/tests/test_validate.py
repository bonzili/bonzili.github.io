from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from validate import validate_brief


def valid_brief() -> dict:
    return {
        "schema": 1,
        "generated_at": "2026-11-04T07:00:00+08:00",
        "topics": [{"id": "ai", "name": {"en": "AI"}, "short": "AI", "color": "#3157D5"}],
        "cards": [{
            "id": "card1",
            "topic": "ai",
            "headline": "A headline",
            "why": "Why it matters.",
            "bullets": ["One", "Two", "Three"],
            "sources": [{"title": "Source", "url": "https://example.com", "publisher": "Example", "published": "2026-11-04T06:00:00+08:00"}],
        }],
        "workspaces": {
            "me": {
                "cap": 12,
                "picks": [{"card_id": "card1", "why": "Why.", "bullets": ["One", "Two"]}],
            }
        },
    }


class ValidateTests(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(validate_brief(valid_brief()), [])

    def test_unknown_card_reference(self):
        data = valid_brief()
        data["workspaces"]["me"]["picks"][0]["card_id"] = "missing"
        self.assertTrue(validate_brief(data))

    def test_non_http_source(self):
        data = valid_brief()
        data["cards"][0]["sources"][0]["url"] = "javascript:alert(1)"
        self.assertTrue(validate_brief(data))


if __name__ == "__main__":
    unittest.main()
