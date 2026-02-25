# Airflow Calculator

Static client-side web app (vanilla HTML/CSS/JS) for calculating equivalent diameters of holes. No build step, no package manager, no runtime dependencies.

## Cursor Cloud specific instructions

- **Serve locally**: `python3 -m http.server 8080` from repo root, then open `http://localhost:8080/index.html`.
- **No lint/test/build tooling** exists in this repo. There are no `package.json`, test frameworks, or linters configured.
- Two pages: `index.html` (forward calc) and `reverse.html` (reverse calc). Navigation is via tab links at the top of each page.
- UI labels are in Russian.
- Deployed to GitHub Pages via `.github/workflows/static.yml` on pushes to `main`.
