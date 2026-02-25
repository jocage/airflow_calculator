# AGENTS.md

## Cursor Cloud specific instructions

This is a **static HTML/CSS/JS** project (Airflow Calculator) with no build step, no package manager, and no dependencies to install.

### Running the dev server

```bash
python3 -m http.server 3000
```

Then open `http://localhost:3000/index.html` in a browser. Both `index.html` (forward calculation) and `reverse.html` (reverse calculation) are entry points.

### Lint / Test / Build

- **No linter, test framework, or build tool is configured.** There is no `package.json`, no ESLint, no Jest, etc.
- The project deploys as-is to GitHub Pages via `.github/workflows/static.yml`.
- To validate changes, serve the files locally and test manually in the browser.
