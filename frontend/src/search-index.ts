import indexUrl from './generated/word-index.json?url';
import type { SearchIndex } from './solver';

let pendingIndex: Promise<SearchIndex> | undefined;

export function loadSearchIndex(): Promise<SearchIndex> {
  // Vite emits a hashed static asset, including when hosted under a subpath.
  // Cache the download for subsequent searches, but allow retry after a failure.
  pendingIndex ??= fetch(indexUrl)
    .then(async (response) => {
      if (!response.ok) throw new Error('Could not load the dictionary. Please try again.');
      const data: SearchIndex = await response.json();
      if (data.version !== 1 || !data.wordsBySignature || typeof data.wordsBySignature !== 'object') {
        throw new Error('Invalid dictionary. Please reload the page.');
      }
      return data;
    })
    .catch((error: unknown) => {
      pendingIndex = undefined;
      throw error;
    });
  return pendingIndex;
}
