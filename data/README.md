# Dictionary data

| File | Purpose |
| --- | --- |
| `raw_words.txt` | Original input dictionary, one word per line |
| `words.txt` | Deduplicated, lowercase A–Z words of five to nine letters |
| `../frontend/src/generated/word-index.json` | Browser search index generated from `words.txt` |

## Source and attribution

The raw dictionary is `words_alpha.txt` from [dwyl/english-words](https://github.com/dwyl/english-words/blob/master/words_alpha.txt), stored locally as `raw_words.txt`.

The supplied file was verified byte-for-byte using its Git blob SHA-1, which matches the [upstream file metadata](https://api.github.com/repos/dwyl/english-words/contents/words_alpha.txt):

```text
d3a119e7ce57d068c3f3c9cbd694fc2ff14571ab
```

The upstream repository provides the dictionary under [the Unlicense](https://github.com/dwyl/english-words/blob/master/LICENSE.md). A copy is included in [LICENSE.txt](LICENSE.txt). This notice concerns the dictionary data; the cleaned list and browser index are generated from that source.

The raw file retains its original line endings for source verification. Generated files use LF line endings on every platform.

See the [project README](../README.md#regenerate-the-dictionary) for regeneration instructions.
