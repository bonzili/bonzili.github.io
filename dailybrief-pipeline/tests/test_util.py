from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from util import (
    clean_title, first_sentence, infer_jurisdiction, is_cjk_text,
    summary_matches_title, text_has_keyword, title_tokens,
)


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

    def test_editorial_keyword_matches_plurals(self):
        self.assertTrue(text_has_keyword("New models shipped", "model"))
        self.assertTrue(text_has_keyword("Two CVEs patched", "CVE"))
        self.assertFalse(text_has_keyword("Modelled after a boat", "model"))

    def test_summary_must_match_headline(self):
        bad = ("Hong Kong seeks to balance finance growth against cyber risks",
               "Chinese Vice-Premier He Lifeng said that building Hong Kong remains a key strategy for China as he outlined four ways for the city to boost its long-term prospects and support the country's development.")
        good = ("Hong Kong records 15th straight quarter of growth as GDP rises 5.2%",
                "Hong Kong's economy grew by 5.2 per cent year on year in the third quarter, marking its 15th consecutive quarter of expansion, while retail sales rose by 6.4 per cent in September.")
        self.assertFalse(summary_matches_title(*bad))
        self.assertTrue(summary_matches_title(*good))

    def test_jurisdiction_inference(self):
        self.assertEqual(infer_jurisdiction("The UPC in Milan ruled on Sandoz", "US"), "EU")
        self.assertEqual(infer_jurisdiction("The PCPD in Hong Kong issued guidance", "APAC"), "Hong Kong")
        self.assertEqual(infer_jurisdiction("U.S. fair use filing", "APAC"), "US")
        self.assertEqual(infer_jurisdiction("Upcoming changes to the law", "APAC"), "APAC")


if __name__ == "__main__":
    unittest.main()
