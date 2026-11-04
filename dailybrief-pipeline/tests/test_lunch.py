from __future__ import annotations

import json
import unittest
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]
LUNCH = ROOT / "dailybrief" / "data" / "lunch.json"


class LunchDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(LUNCH.read_text(encoding="utf-8"))
        cls.places = cls.data.get("places") or []

    def test_schema_and_audience(self):
        self.assertEqual(self.data.get("schema"), 1)
        self.assertEqual(self.data.get("audience"), "Siu Gai Mo")
        self.assertTrue(self.data.get("office"))
        date.fromisoformat(self.data["updated_at"])
        self.assertGreaterEqual(len(self.places), 8)

    def test_place_ids_are_unique_and_stable(self):
        ids = [place.get("id") for place in self.places]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertTrue(all(ids))

    def test_required_fields(self):
        for place in self.places:
            label = place.get("id")
            self.assertTrue(place.get("name"), label)
            self.assertTrue(place.get("cuisine"), label)
            self.assertTrue(place.get("address"), label)
            self.assertTrue(place.get("hours"), label)
            self.assertTrue(place.get("note"), label)
            self.assertIsInstance(place.get("walk_minutes"), int, label)
            self.assertGreaterEqual(place["walk_minutes"], 0, label)
            self.assertLessEqual(place["walk_minutes"], 10, label)
            self.assertIsInstance(place.get("price_max"), int, label)
            self.assertGreater(place["price_max"], 0, label)
            self.assertIsInstance(place.get("dine_in"), bool, label)
            self.assertIsInstance(place.get("takeaway"), bool, label)
            self.assertIsInstance(place.get("group"), bool, label)
            self.assertIsInstance(place.get("solo"), bool, label)
            date.fromisoformat(place["last_verified"])

    def test_links_are_http(self):
        for place in self.places:
            for key in ("map_url", "openrice_url"):
                value = place.get(key) or ""
                if not value:
                    self.assertEqual(key, "openrice_url", place.get("id"))
                    continue
                parts = urlsplit(value)
                self.assertEqual(parts.scheme, "https", place.get("id"))
                self.assertTrue(parts.netloc, place.get("id"))

    def test_team_lunch_seed_is_present(self):
        self.assertTrue(any(place.get("group") for place in self.places))
        self.assertTrue(any(place.get("takeaway") for place in self.places))


if __name__ == "__main__":
    unittest.main()
