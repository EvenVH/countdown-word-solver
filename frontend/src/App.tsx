import { useState } from 'react';
import { loadSearchIndex } from './search-index';
import { normalizeLetters, solveLetters } from './solver';
import type { SolveResult } from './solver';
import './App.css';

function App() {
  const [letters, setLetters] = useState('');
  const [results, setResults] = useState<SolveResult[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedLetters, setSearchedLetters] = useState('');

  return (
    <main>
      <h1>Countdown Word Solver</h1>
      <p>Enter 9 letters and find the longest possible English words.</p>

      <form onSubmit={async (event) => {
        event.preventDefault();
        if (loading) return;
        const cleaned = normalizeLetters(letters);
        setResults([]);
        setSearchedLetters('');

        if (!/^[a-z]{9}$/.test(cleaned)) {
          setError('Please enter exactly 9 letters (A–Z).');
          return;
        }

        setLoading(true);
        setError('');
        try {
          const index = await loadSearchIndex();
          setResults(solveLetters(cleaned, index));
          setSearchedLetters(cleaned);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not load the dictionary. Please try again.');
        } finally {
          setLoading(false);
        }
      }}>
        <label htmlFor="letters">Your 9 letters</label>
        <input
          id="letters"
          type="text"
          value={letters}
          onChange={(event) => setLetters(event.target.value)}
          placeholder="e.g. streaming"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          disabled={loading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'search-error' : undefined}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading dictionary…' : 'Solve'}
        </button>
      </form>

      {error && <p id="search-error" role="alert">{error}</p>}

      <section aria-label="Search results" aria-live="polite" aria-busy={loading}>
        {!searchedLetters && !error && !loading && <p>No results yet.</p>}
        {searchedLetters && <p>Results for <strong>{searchedLetters.toUpperCase()}</strong></p>}
        {searchedLetters && results.length === 0 && <p>No matching words of 5–9 letters found.</p>}
        {results.map((group) => (
          <div className="word-group" key={group.length}>
            <h2>{group.length}-letter words <small>({group.words.length})</small></h2>
            <p>{group.words.join(', ')}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;
