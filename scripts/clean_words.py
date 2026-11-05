"""Clean the source dictionary once; no third-party packages are required."""

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def clean_words(source: Path, destination: Path) -> int:
    """Keep unique English words of 5–9 letters in deterministic order."""
    with source.open(encoding="utf-8-sig") as stream:
        words = {
            word
            for line in stream
            if 5 <= len(word := line.strip().lower()) <= 9
            and word.isascii()
            and word.isalpha()
        }

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        "".join(f"{word}\n" for word in sorted(words)), encoding="utf-8", newline="\n"
    )
    return len(words)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=ROOT / "data/raw_words.txt")
    parser.add_argument("--output", type=Path, default=ROOT / "data/words.txt")
    args = parser.parse_args()
    if args.input.resolve() == args.output.resolve():
        parser.error("Input and output must be different files.")
    count = clean_words(args.input, args.output)
    print(f"Saved {count:,} cleaned words to {args.output}")


if __name__ == "__main__":
    main()
