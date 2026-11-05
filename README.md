# Countdown Word Solver

An English word solver inspired by the letters round of the British television game show **Countdown**. Enter nine letters to find words of five to nine letters, grouped from longest to shortest.

Built with **React, TypeScript, and Vite**, with **Python** scripts for preparing the dictionary. All searches run in the browser, and the application can be hosted as a static website.

## Features

- Search a dictionary of 192,822 English words.
- Respect letter counts: a letter can only be used as many times as it appears in the input.
- Accept uppercase letters and whitespace, with validation for invalid input.
- Show results grouped by word length and sorted alphabetically within each group.
- Load the dictionary on the first search and reuse it for subsequent searches in the same session.
- Display loading, error, and no-match states, with labelled inputs and accessible result announcements.

## Run locally

Requirements: **Node.js 22.13+** and npm. Python is only needed to regenerate the dictionary.

From the repository root:

```sh
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite. The generated search index is included in the repository, so there is no data preparation step before the first run.

Try `streaming` as a nine-letter input.

## How the search works

The Python preparation scripts clean the source dictionary and group anagrams under a shared key: the letters of each word in alphabetical order. For example, `stare` and `tears` both have the key `aerst`. Repeated letters are preserved in the key.

When a user submits nine letters, the browser generates their unique combinations of five to nine letters and looks up the corresponding keys. With nine distinct letters, this requires at most **256 dictionary lookups**, rather than scanning every word on each search. Results are then grouped and sorted for display.

The index is downloaded as a separate static JSON asset and cached in memory. Vite gives the production asset a content-based filename. This keeps the search logic small, but the full dictionary still needs to be downloaded on the first search: approximately **4 MB before compression**.

## Technology and structure

| Component | Technology / purpose |
| --- | --- |
| User interface | React and TypeScript |
| Development and production builds | Vite |
| Dictionary preparation | Python standard library |
| Frontend tests | Node.js test runner |
| Data pipeline tests | Python unittest |
| Continuous integration | GitHub Actions |

```text
.
├── .github/workflows/       # Automated checks and manual Pages deployment
├── data/                   # Source and cleaned dictionaries
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Search form and results
│   │   ├── solver.ts       # Browser-side search algorithm
│   │   ├── search-index.ts # Static index loading and caching
│   │   └── generated/      # Prebuilt search index
│   └── tests/              # Search and index regression tests
└── scripts/                # One-off dictionary preparation and its tests
```

## Tests and checks

From `frontend/`:

```sh
npm test
npm run lint
npm run build
```

From the repository root:

```sh
python -m unittest discover -s scripts -p "test_*.py"
```

The tests verify input validation, repeated letters, empty results, dictionary integrity, and agreement with an independent full-dictionary search. Python tests cover cleaning, index generation, and invalid source data.

The CI workflow runs these checks on pushes and pull requests. It also regenerates the dictionary files and checks that the committed files are up to date.

## Build and deploy

From `frontend/`:

```sh
npm run build
npm run preview
```

The production output is in `frontend/dist/`. Deploy that entire directory, including `assets/`, to a static host. Neither Python nor the source dictionaries are needed on the server.

### GitHub Pages

A manual [GitHub Pages workflow](.github/workflows/pages.yml) is included:

1. Push the project to your GitHub repository's default branch.
2. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. In **Actions**, select **Deploy to GitHub Pages**, then **Run workflow** on the default branch.
4. Once deployment succeeds, use the URL shown by the deployment as the repository's **Website** link.

The workflow uses Pages metadata to set the asset base path for both repository sites and account sites. Deployment is manual; pushing code only runs CI. See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for the hosting setup.

For other hosts that serve the app from a subdirectory, build with the appropriate path:

```sh
npm run build -- --base=/your-subdirectory/
```

In Windows PowerShell, use `npm.cmd run build -- --base=/your-subdirectory/` to forward the base-path option.

## Regenerate the dictionary

Requires **Python 3.10+**. Both scripts use only the standard library.

Put one source word per line in `data/raw_words.txt`, then run from the repository root:

```sh
python scripts/clean_words.py
python scripts/build_search_index.py
```

1. `clean_words.py` trims surrounding whitespace, converts words to lowercase, removes duplicates, and retains only five-to-nine-letter words containing A–Z. It writes the sorted result to `data/words.txt`.
2. `build_search_index.py` groups anagrams by their sorted letters and writes `frontend/src/generated/word-index.json`.

Default paths are resolved relative to the scripts, so the scripts also work when called from another working directory. Both accept `--input` and `--output` arguments for alternative files. Rebuild the frontend after changing the index.

## Inspiration and dictionary

This is an independent portfolio project inspired by **Countdown**, with no affiliation to the television programme. It demonstrates a typed React interface, a browser-side search algorithm, a reproducible Python data pipeline, and regression testing.

Matches come from the bundled dictionary and may include uncommon words. The app does not attempt to reproduce the programme's official dictionary or word-admission rules.

The dictionary comes from [dwyl/english-words](https://github.com/dwyl/english-words), published under the Unlicense. Source verification and the data license are documented in [data/README.md](data/README.md).
