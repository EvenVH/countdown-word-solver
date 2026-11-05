export type SolveResult = {
  length: number;
  words: string[];
};

export type SearchIndex = {
  version: 1;
  wordsBySignature: Record<string, string[]>;
};

export function normalizeLetters(letters: string): string {
  return letters.replace(/\s/g, '').toLowerCase();
}

export function solveLetters(letters: string, index: SearchIndex): SolveResult[] {
  const cleaned = normalizeLetters(letters);
  if (!/^[a-z]{9}$/.test(cleaned)) {
    throw new Error('Please enter exactly 9 letters (A–Z).');
  }

  const sorted = [...cleaned].sort();
  const matches = new Map<number, string[]>();

  // At most 256 signatures for 9 distinct letters; no full dictionary scan.
  function visit(start: number, signature: string) {
    if (signature.length >= 5) {
      const words = index.wordsBySignature[signature];
      if (words) {
        const group = matches.get(signature.length) ?? [];
        group.push(...words);
        matches.set(signature.length, group);
      }
    }

    for (let position = start; position < sorted.length; position += 1) {
      if (position > start && sorted[position] === sorted[position - 1]) continue;
      visit(position + 1, signature + sorted[position]);
    }
  }

  visit(0, '');
  return [...matches.entries()]
    .sort(([a], [b]) => b - a)
    .map(([length, words]) => ({ length, words: words.sort() }));
}
