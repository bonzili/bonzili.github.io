from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from util import clean_title, first_sentence, infer_jurisdiction, is_cjk_text, title_tokens


class UtilTests(unittest.TestCase):
    def test_clean_title_strips_publisher_suffix(self):
        self.assertEqual(clean_title("Story title - RTHK", "RTHK"), "Story title")

    def test_cjk_detection(self):
        self.assertTrue(is_cjk_text("五月天石頭退團"))
        self.assertFalse(is_cjk_text("Mayday Stone leaves the band"))

    def test_tokens_include_cjk_bigrams(self):
        tokens = title_tokens("五月天石頭退團")
        self.assertIn("五月", tokens)
        self.assertGreater(len(tokens), 3)

    def test_first_sentence(self):
        self.assertEqual(first_sentence("One thing happened. Another followed."), "One thing happened.")

    def test_jurisdiction_inference(self):
        self.assertEqual(infer_jurisdiction("The UPC in Milan ruled on Sandoz", "US"), "EU")
        self.assertEqual(infer_jurisdiction("The PCPD in Hong Kong issued guidance", "APAC"), "Hong Kong")
        self.assertEqual(infer_jurisdiction("U.S. fair use filing", "APAC"), "US")
        self.assertEqual(infer_jurisdiction("Upcoming changes to the law", "APAC"), "APAC")


if __name__ == "__main__":
    unittest.main()
