# Repository Guidelines

## Project Structure & Module Organization
This repository is a static front-end demo with no build system. Keep page structure in `index.html` and `order.html`, shared behavior in `script.js`, and all styling in `style.css`. Store brand assets beside the pages, for example `Logo.png`. There is currently no `src/` or `tests/` directory, so keep additions small and predictable unless you are introducing a larger refactor.

## Build, Test, and Development Commands
There is no compile step.

- `python3 -m http.server 8000` runs the site locally at `http://localhost:8000`.
- `open index.html` opens the homepage directly in a browser on macOS.
- `php -S localhost:8000` is a reasonable alternative if you want to stay within the XAMPP/PHP toolchain.

Before opening a PR, manually verify both pages, navigation links, responsive layout, and the order flow in `order.html`.

## Coding Style & Naming Conventions
Match the existing style: 2-space indentation in HTML and CSS, semicolon-terminated JavaScript, and modern `const`/`let` usage. Use descriptive kebab-case for CSS classes such as `.hero-section` and `.menu-card`, and camelCase for JavaScript identifiers such as `updateSummary` or `pickupModes`. Prefer shared selectors and variables over one-off inline styles or duplicated constants.

## Testing Guidelines
There is no automated test suite yet. Test changes manually in a browser:

- homepage rendering and navigation in `index.html`
- order calculations, form validation, and confirmation state in `order.html`
- persisted draft behavior through `localStorage`
- mobile menu and responsive layout at narrow widths

If you add automated coverage later, place browser-facing tests in a `tests/` folder and name files after the feature, for example `order-flow.test.js`.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commits with optional prefixes, such as `docs: add project README` and `style: update color variables`. Follow that pattern and keep each commit scoped to one concern.

Pull requests should include a clear summary, note any UI or behavior changes, link related issues when available, and attach screenshots for visual updates to `index.html`, `order.html`, or `style.css`.

## Security & Configuration Tips
Do not commit secrets, API keys, or production credentials. This demo is fully client-side; any pricing or order logic in `script.js` is visible to users, so do not treat it as secure business logic.
