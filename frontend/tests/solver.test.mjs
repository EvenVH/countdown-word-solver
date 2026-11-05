import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { solveLetters } from '../src/solver.ts';

const index = JSON.parse(readFileSync(new URL('../src/generated/word-index.json', import.meta.url), 'utf8'));
const words = readFileSync(new URL('../../data/words.txt', import.meta.url), 'utf8').trim().split(/\r?\n/);

test('generated index contains every cleaned word exactly once under the correct signature', () => {
  const indexedWords = [];
  for (const [signature, entries] of Object.entries(index.wordsBySignature)) {
    for (const word of entries) {
      assert.equal([...word].sort().join(''), signature);
      indexedWords.push(word);
    }
  }
  assert.deepEqual(indexedWords.sort(), words);
});

test('matches a full dictionary scan for distinct and repeated letters', () => {
  const racks = ['streaming', 'lettersss', 'aaaaaaaaa', 'zzzzzzzzz', 'abcdefghi', 'bookkeeps'];
  const nineLetterWords = words.filter((word) => word.length === 9);
  for (let i = 0; i < 20; i += 1) racks.push(nineLetterWords[i * 2341]);

  for (const rack of racks) {
    // Independent reference search: consume each available letter once.
    const expected = new Map();
    for (const word of words) {
      let remaining = rack;
      let possible = true;
      for (const letter of word) {
        const position = remaining.indexOf(letter);
        if (position < 0) {
          possible = false;
          break;
        }
        remaining = remaining.slice(0, position) + remaining.slice(position + 1);
      }
      if (possible) {
        if (!expected.has(word.length)) expected.set(word.length, []);
        expected.get(word.length).push(word);
      }
    }
    const grouped = [...expected.entries()]
      .sort(([a], [b]) => b - a)
      .map(([length, matches]) => ({ length, words: matches }));
    assert.deepEqual(solveLetters(rack, index), grouped, rack);
  }
});

test('accepts uppercase and whitespace, and rejects invalid input', () => {
  assert.deepEqual(solveLetters(' S TREAMING\n', index), solveLetters('streaming', index));
  for (const invalid of ['', 'short', 'streamings', 'stream1ng', 'stréaming', 'stream!ng']) {
    assert.throws(() => solveLetters(invalid, index), /exactly 9 letters/);
  }
});

test('returns an empty result when no word matches', () => {
  assert.deepEqual(solveLetters('zzzzzzzzz', index), []);
});
