# Sherekilebi Labs website

An independent robotics workshop in Varketili, Tbilisi, Georgia. This React / TypeScript / Vite site includes a project index, dedicated project readers, an accessible tape-roll project slider, and **Lab Dispatches** at `/news`.

## Run and build

Use Node.js 22.12+ (Node 24 is suitable).

```sh
git clone https://github.com/Sherekilebi-labs/Sherekilebi-labs.github.io.git
cd Sherekilebi-labs.github.io
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173`.

```sh
npm run build
npm run preview
```

The preview is normally `http://127.0.0.1:4173`. The complete static site is in `dist/`; serve it over HTTP from the host's root path. The build emits `news/index.html` and `projects/<id>/index.html` as well as the root page, so known routes can load directly on static hosts that support directory indexes. Configure an SPA fallback to `/index.html` if your host does not resolve those routes. Arbitrary unknown URLs need that fallback to reach the React 404 page. The production site is hosted at **https://sherekilebi-labs.github.io/** through GitHub Pages.

## Content

- `src/data/lab.json`: projects, equipment, people, lab origins, and repository URLs. Your contributor profile edits are preserved.
- `src/data/types.ts`: project and dispatch interfaces.
- `content/news/*.json`: one independently editable dispatch per file. See [HOW_TO_POST.md](HOW_TO_POST.md) for the three-step posting guide.
- `content.sources.json`: selected local documentation and code excerpts retained for authoring reference, plus imported assets.
- `src/data/generated/excerpts.json`: offline authoring references; these are not imported into the website or displayed on project pages.
- `public/media/web/`: selected resized, metadata-free web derivatives. Original and unused media stay local and are ignored by Git.
- `src/components/` and `src/pages/`: shared cards, carousel, Markdown renderer, news timeline, and project readers.

The source-code repository mapping is:

| Website project | GitHub repository |
| --- | --- |
| Tekkai 2.0 | [Tekkai-2.0](https://github.com/Sherekilebi-labs/Tekkai-2.0) |
| Active Spoiler | [Active-Spoiler](https://github.com/Sherekilebi-labs/Active-Spoiler) |
| Door Security System | [Door-Security-System](https://github.com/Sherekilebi-labs/Door-Security-System) |
| CupExS Drag Racer | [CupExS-drag-racer](https://github.com/Sherekilebi-labs/CupExS-drag-racer) |
| GYM Scale | [GYM-scale](https://github.com/Sherekilebi-labs/GYM-scale) |

The pop-up spoiler now uses `Project Tsintsadze`: two ESP32 firmwares, four encoder-feedback DC motors, two four-bar wing linkages, and a local response-curve dashboard. Its source excerpts come from `include/model.h`; the previous standalone mapping and servo-drive implementation is no longer the current project.

LARA has an explicit repository placeholder. Add its future URL to `sourceUrl` and remove `sourcePending`. Tekkai 2.0 uses the reviewed Sumo 2026 firmware from `~/program files/PlatformIO/Projects/Sumo 2026`; the current public source is Tekkai-2.0. The separately labelled 2024 link remains historical. Opponent pursuit takes priority over edge checks in this firmware. AeroDHS was an earlier Active Spoiler version and is no longer listed as a separate project.

Actuator A0, RoBook, and the former research-domain section have been removed from the website. The project count derives from the current records. Project cards and carousel items link to `/projects/<id>`; dispatches cross-link using `relatedProject`.

## Dark theme preview

The current theme uses the flight deck's blue-gray (`#2d3440`), white primary text, softer secondary text, and a shared set of component color roles. `src/dark-theme.css` is imported after the original stylesheet in `src/main.tsx`. To restore the paper theme, comment out that one import and set the `theme-color` meta tag in `index.html` back to `#f3eee2`. The base stylesheet retains light palette roles; the dark stylesheet overrides the theme tokens.

## Fonts and visual identity

The site uses the supplied **Sherekilebi logo.png** and a true vector **tsatmfreni.svg** converted from the supplied PNG. The SVG contains colored paths, with no embedded bitmap. The old icon file has been removed from the site.

Large titles now use **Helvetica Bold (700)**. Body text uses Helvetica, with Helvetica Neue and Arial fallbacks. Eurostile Extended and the Michroma fallback have been removed from the title stack. No commercial font binary is embedded or distributed. Monospace labels use the bundled JetBrains Mono font and its SIL OFL notice.

The visual identity uses original workshop / flight-log copy and the artwork you confirmed you own or have permission to use. The original paper and brass palette is preserved beneath the optional dark preview stylesheet. The text acknowledges Eldar Shengelaia's *The Eccentrics* as the name's inspiration and states that the lab is independent. The site does not import film stills, posters, dialogue, soundtrack, or footage. Attribution is not represented as a substitute for permission. See [BRANDING.md](BRANDING.md) for sources and future-media guidance.

## Update project content

A project `summary` can be a string or an array of non-empty text lines; the data loader normalizes the latter for rendering.

Edit the relevant project in `src/data/lab.json`: `id`, `number`, `title`, `folder`, `sourceRoot`, `category`, `status`, `summary`, `tags`, `notes`, `specs`, `bom`, and media. Leave undocumented component lists and project-specific credits empty. `sourceUrl` is the primary GitHub link; `sourceLinks` supports clearly labelled alternate or historical sources; `sourcePending` is a non-clickable placeholder.

Project `summary` supports standard Markdown (paragraphs, `-` bullet lists, `**bold**`, and links) on both cards and project pages. Put `\n\n` before a list and `\n` between its items inside a JSON string; arrays of summary strings are also accepted.

Each project requires an `introduction` Markdown string, rendered under **Overview**. `cardSummary` supplies the concise homepage description. Optional `currentState`, `engineeringTopics`, `results`, and `nextSteps` distinguish progress, implementation, and evidence. Every supplied result needs a method, finding, and limitations; absent sections stay absent. `PROJECT_FACTS.md` records private authoring follow-ups. Project updates derive from the existing news records.

Set `icon` to a supplied project-icon asset to include it in the hero slider. Set `media.src` for its card and project reader. Add `gallery` entries with `src`, `alt`, and factual `caption`. Add `analysisFigures` entries with the same fields for engineering charts displayed below the gallery. Category filters derive from the records; technology tags remain project details. A failed project image falls back to an illustrative schematic.

The featured-project carousel advances every **3 seconds**, with a 600 ms transition. Hovering anywhere inside its border suspends automatic advancement; arrows remain usable. Leaving the carousel starts a fresh three-second interval. Keyboard focus also suspends automatic advancement, and a persistent Pause/Resume control is available. Horizontal touch swipes and arrow keys remain supported. Reduced motion disables autoplay and makes manual transitions instant.

Project sources appear beside the summary, including on phones. The index uses concise summaries and category filters. The hero introduces the lab with a smaller film quote; its longer explanation remains in Our story. Typography uses shared role sizes, and theme colors are centralized in `dark-theme.css`.

Project CAD viewers load **automatically**. A bright **Explore in 3D** sign focuses the already-rendered model; the user does not need to activate it to load the model. Posters and static project images use flex framing and `object-fit: contain` to avoid the former grid/intrinsic-size cropping. Door Security and GYM Scale images keep their full frames.

LARA's simulation section contains only the animated WebP (the supplied GIF-like joint sweep), which runs automatically without playback controls. CupExS has no Testing and results section; its current state records **5 functional kits**. Its logo appears at the top left of its homepage card and the top right of the event photo.

## Refresh excerpts from local source

Project pages use curated content from `lab.json`, without a “From the documentation” section. Lara's current simulation specification is Isaac Sim; old source snapshots do not establish the current project's implementation. The existing simulation images still need their revision and renderer provenance checked before relabeling them as Isaac Sim captures.

The standalone website does not import the excerpt snapshots, and projects do not need an excerpt to pass content validation. The optional authoring workflow still retains them as offline references and refreshes selected assets. To refresh those references with the original project folders available:

```sh
npm run content:sync
npm run content:check
npm run build
```

The importer reads only `content.sources.json` entries. `workspace` sources are relative to the parent HUB directory. `platformio` sources come from `~/Documents/PlatformIO/Projects`, overridable with `PLATFORMIO_PROJECTS`. The Tekkai `platformio2026` source comes from `~/program files/PlatformIO/Projects`, overridable with `PLATFORMIO_2026_PROJECTS`. Markdown sources use exact headings; selected code fragments use explicit start/end markers. The script rejects escaping paths and private configuration files. It never publishes a full source tree or reads a real `secrets.h` into the website.

Curated summaries are reviewed alongside the source. They distinguish accelerometer angles from sensor fusion, separate controller programs, prototype limitations, and actual results from a photograph of a test screen.

## Media and distribution

Only referenced assets from `scripts/public-assets.mjs` ship. Vite's automatic public-directory copy is disabled for production. Unused originals, the screen-viewing photo, original large JPEGs, and unused project pictures remain local. The included web derivatives have no EXIF location or device metadata. The reviewed distribution is about 15.7 MB including optional CAD models and simulation media; this is not the initial page transfer size; the Markdown reader is loaded separately from the homepage.

For a new photo, export a suitably sized, metadata-free WebP into `public/media/web/`, reference it in the project or post JSON, then run `npm run assets:sync` and `npm run build`. The asset command updates the Git allowlist so the new referenced image can be committed; unreferenced originals remain ignored. Images embedded in Markdown must use a simple local `media/...` path or HTTPS URL. Add useful alternative text. For video posts, use `mediaType: "video"`; native playback controls are shown instead of forcing autoplay.

The renderer supports Markdown headings, lists, tables, links, images, and syntax-highlighted code. Raw HTML is skipped and unsafe URL protocols are rejected by the Markdown renderer. The feed sorts pinned posts first, then date descending. The homepage always shows the three newest posts by date regardless of pin status; ties use the post ID for deterministic ordering.

## Version control and GitHub Pages

The website is an independent Git repository. Its root is this directory, and `origin` is [Sherekilebi-labs/Sherekilebi-labs.github.io](https://github.com/Sherekilebi-labs/Sherekilebi-labs.github.io). The parent HUB and local firmware checkouts are outside the website history. No license is granted for the lab artwork or photographs merely by publishing them.

Every push to `main` runs `.github/workflows/deploy.yml`: a clean Node 24 install, content/type/output checks, a production build, Chrome browser and accessibility tests, then a GitHub Pages deployment. A failed check prevents publication. The workflow can also be started manually from the repository's Actions tab. Repository Settings → Pages must use **GitHub Actions** as its source; this is configured for the initial deployment. No deployment token is stored in the repository.

To publish an edit from this directory:

```sh
# After adding new referenced media:
npm run assets:sync
npm run build
git add .
git diff --cached --stat
git commit -m "Update lab website"
git push origin main
```

Watch the [deployment workflow](https://github.com/Sherekilebi-labs/Sherekilebi-labs.github.io/actions) for the result. The source and selected media are public; `.gitignore` keeps unused originals, environment files, dependencies, local firmware exports, and generated build/test outputs out of commits. To revert a published change, use `git revert <commit>` followed by `git push origin main`.

The committed image-dimension snapshots and curated content make CI independent of the surrounding workspace. `content:sync`, `content:check`, and the optional Python image preparation command are local authoring tools; they are not required by deployment. When refreshing local source excerpts for authoring reference, commit the updated snapshots along with the curated content.

## Verification

```sh
npm run check          # TypeScript, data references, media, dates, vector emblem
npm run content:check # Compare excerpts with their local source files
npm run build          # Build, static routes, referenced-asset/output audit
npm test               # Browser interactions, responsive layouts, accessibility
```

Browser tests run against `dist/` and start/stop their own preview server. They use installed Google Chrome by default. To use Playwright Chromium instead:

```sh
npx playwright install chromium
PLAYWRIGHT_CHANNEL=chromium npm test
```

Checks cover category filtering, empty states, manual carousel stability, gapless bidirectional looping, keyboard/touch controls, project links and direct loads, LARA's pending link, feed sorting and filtering, micro-posts, highlighted Markdown, project cross-links, latest-post previews, media fallback, mobile navigation, reduced motion, widths from 320 to 1440 pixels, and automated WCAG A/AA checks. Preview screenshots are written into ignored `test-results/`.

## Full photos, inline

Project galleries and dispatch images no longer open raw files in another tab. Full frames use proportional sizing with `object-fit: contain`, modest height limits, and captions / timestamps outside the image. Portraits are not forced into landscape crops. Project icons keep contained frames; clicking a project card or carousel still navigates to its project page.

The image layout approach and optional future derivative workflow are documented in [IMAGE_LAYOUT_PLAN.md](IMAGE_LAYOUT_PLAN.md). Intrinsic dimensions in `src/data/generated/image-dimensions.json` reserve the correct layout space. After adding or replacing local photos, run `python3 scripts/prepare-image-metadata.py` (Pillow required for this optional authoring command); ordinary website builds use the committed snapshot and need no Python.
