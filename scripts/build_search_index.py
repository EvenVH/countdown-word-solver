"""Generate the static browser search index from the cleaned dictionary."""

import argparse
from collections import defaultdict
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def build_index(source: Path, destination: Path) -> int:
    """Group anagrams by sorted letters, retaining repeated letters in each key."""
    with source.open(encoding="utf-8") as stream:
        words = sorted({line.strip() for line in stream if line.strip()})

    index = defaultdict(list)
    for word in words:
        if not (5 <= len(word) <= 9 and word.isascii() and word.isalpha() and word.islower()):
            raise ValueError(f"Invalid cleaned word: {word!r}. Run clean_words.py first.")
        index["".join(sorted(word))].append(word)

    if not words:
        raise ValueError("The cleaned dictionary contains no words.")

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        json.dumps({"version": 1, "wordsBySignature": index}, sort_keys=True, separators=(",", ":")) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    return len(words)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=ROOT / "data/words.txt")
    parser.add_argument("--output", type=Path, default=ROOT / "frontend/src/generated/word-index.json")
    args = parser.parse_args()
    if args.input.resolve() == args.output.resolve():
        parser.error("Input and output must be different files.")
    count = build_index(args.input, args.output)
    print(f"Indexed {count:,} words in {args.output}")


if __name__ == "__main__":
    main()
