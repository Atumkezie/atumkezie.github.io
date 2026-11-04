# Harikrishna Trivedi · Portfolio

**AI engineering, software, and music.**

A personal portfolio built with Astro, Josefin Sans, Jost, and Lenis. A continuous day/night sky connects an original typographic opening, a short personal journey, two project case studies, and a dedicated music section featuring my keyboard performance.

> AI finds the patterns. Music makes you feel them. I build in the space between.

**Release 1.0.0.** Website address: **https://hk0922.github.io/**. The included GitHub Actions workflow builds, verifies, and deploys the site from `main`. See the repository’s Actions tab for the latest deployment status.

## Start here

- **Preview the download:** extract the complete folder and open `OPEN_PREVIEW.html`. Keep `review/` beside it for the project pages, résumé, and performance.
- **Publish:** follow [the GitHub Pages guide](docs/GITHUB_PAGES.md).
- **Edit:** use [the maintenance map](docs/MAINTENANCE.md).
- **Verification:** see [the validation record](docs/VALIDATION.md).

The portable preview and built files are included in the release ZIP and ignored by Git. A source clone can recreate them with the commands below.

## What the site includes

- A shared light-blue daytime sky with an edge sun, clouds, and birds; a navy night sky with stars and a moon.
- A connected journey through music, full-stack work, applied AI, and current MS Computer Science study at NJIT.
- Individual PatchPilot AI and CareContext case studies, with project links and accurate prototype boundaries.
- A dedicated music section with the supplied recording and synchronized playback controls, without autoplay.
- Smooth section navigation, reversible scroll reveals, word focus, and restrained thumbnail parallax.
- A finite loading animation on first load and reload, with reduced-motion and manual-pause support.
- The supplied résumé, local fonts and media, canonical metadata, sitemap, robots.txt, and a matching 404 page.

## Selected work

| Project | Focus | Source |
| --- | --- | --- |
| PatchPilot AI | Supervised software repair with scoped changes, executable evidence, and human review | [Repository](https://github.com/HK0922/patchpilot-ai) |
| CareContext | Public literature discovery and evidence exploration over fictional records | [GitHub profile](https://github.com/HK0922); exact project repository not yet supplied |

Project URLs are centralized in `src/data/projects.mjs`. CareContext's profile link updates to a repository link when `carecontextRepository` is set to the exact published URL.

## Stack

| Layer | Technology |
| --- | --- |
| Static site | Astro 7.4.5 |
| Language | Astro templates, JavaScript, CSS |
| Motion | Lenis 1.3.27 and scroll-position calculations |
| Typography | Self-hosted Josefin Sans and Jost variable fonts |
| Build | Node.js 24, npm lockfile, esbuild |
| Tests | Node's built-in test runner and production/export checks |
| Hosting | GitHub Pages through GitHub Actions |

The browser needs no model API key, backend service, database, or third-party font request. The sky is built with CSS and SVG; there is no 3D runtime.

## Local development

Use Node.js **24** (`.nvmrc` is included):

```bash
npm ci
npm run dev
```

Build and check the production output:

```bash
npm test
npm run build
npm run check
npm run export:review
```

`npm run preview` serves the production build. `npm run package` creates the release ZIP with Python 3. The package includes source, static output, portable preview, media, documentation, dependency licenses, and a hashed file manifest.

## Repository map

| Path | Purpose |
| --- | --- |
| `src/pages/` | Homepage, two case studies, and 404 page |
| `src/components/` | Shared navigation, sky, footer, and project illustrations |
| `src/layouts/Base.astro` | Shared document structure and metadata |
| `src/styles/site.css` | Approved visual design and responsive styles |
| `src/scripts/` | Smooth scrolling and reversible motion |
| `src/data/projects.mjs` | Project GitHub URLs |
| `public/` | Résumé, performance, browser controls, sitemap, and robots.txt |
| `tests/` | Preference, media, loader, scroll, and export regression tests |
| `scripts/` | Build, verification, preview export, and packaging |
| `.github/workflows/deploy.yml` | Tests/build on pull requests; Pages deployment from main |
| `docs/` | Publishing, maintenance, design, validation, and dependency licenses |

## Deployment

Create **hk0922.github.io** under the **HK0922** account, choose **GitHub Actions** in the repository's Pages settings, and push the source to `main`. The workflow installs locked dependencies, tests and builds the site, validates its output, and publishes only `dist/`. Pull requests run checks without deploying. Detailed steps and troubleshooting are in [GITHUB_PAGES.md](docs/GITHUB_PAGES.md).

The workflow needs no custom secret. Its deployment job receives GitHub's Pages and identity permissions; the build job has read-only repository access. The first hosted run confirms the deployment configuration; subsequent pushes to `main` publish verified updates.

## Content and verification

Music copy reflects 15 years of learning and playing piano and keyboard with London College of Music, without an inferred degree or examination grade. The supplied performance is an approximately 18-second H.264/AAC clip. Project visuals are labeled illustrations.

The latest supplied résumé is included unchanged. Its printed handle is `HK0912`; all website GitHub links use the confirmed `HK0922`.

The existing 26 automated interaction and export tests pass, alongside the production checks. The approved homepage, case-study content, styling, motion, résumé, and performance are preserved. The pre-deployment verification record and its limits are documented in [VALIDATION.md](docs/VALIDATION.md). Current hosted build and deployment status appears in GitHub Actions.

## Credits and rights

Personal content and performance: Harikrishna Trivedi. Implementation was developed with AI assistance and human review. The reference-inspired composition uses original code-native visual elements; external sites' logos, code, and assets are not copied. Third-party font and Lenis licenses are in `docs/licenses/`. Personal résumé and performance media are not licensed for reuse.
