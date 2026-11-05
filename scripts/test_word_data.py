"""Regression checks for the one-off data preparation pipeline."""

import json
from pathlib import Path
import tempfile
import unittest

from build_search_index import build_index
from clean_words import clean_words


class WordDataTests(unittest.TestCase):
    def test_cleaning_and_index_generation(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "raw.txt"
            cleaned = root / "cleaned/words.txt"
            output = root / "generated/index.json"
            source.write_text(
                "\ufeff STREAMING \nstreaming\nLETTER\nletter\nrelets\ncan't\n"
                "two words\nstréaming\n12345\ncat\ntoolongword\napple\n",
                encoding="utf-8",
            )
            self.assertEqual(clean_words(source, cleaned), 4)
            self.assertEqual(cleaned.read_text(encoding="utf-8").splitlines(),
                             ["apple", "letter", "relets", "streaming"])
            self.assertEqual(build_index(cleaned, output), 4)
            data = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(data["version"], 1)
            self.assertEqual(data["wordsBySignature"]["eelrtt"], ["letter"])
            self.assertEqual(data["wordsBySignature"]["eelrst"], ["relets"])
            original = output.read_bytes()
            build_index(cleaned, output)
            self.assertEqual(output.read_bytes(), original)

    def test_rejects_unclean_or_empty_input_without_overwriting_index(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "words.txt"
            output = root / "index.json"
            output.write_text("existing index", encoding="utf-8")
            for content in ["UPPER\n", "two words\n", "stréaming\n", ""]:
                source.write_text(content, encoding="utf-8")
                with self.assertRaises(ValueError):
                    build_index(source, output)
                self.assertEqual(output.read_text(encoding="utf-8"), "existing index")


if __name__ == "__main__":
    unittest.main()
