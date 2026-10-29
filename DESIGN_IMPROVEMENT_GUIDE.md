⚠️ DEGRADED: single-context completion (both independent review agents reached their usage limit before delivering complete assessments).

# Sherekilebi Labs: design critique and Codex implementation guide

Review date: 29 October 2026. Target: the current local `website/` source, including the existing uncommitted `src/App.tsx` changes. This is a refinement of the current site, not a replacement identity.

## 1. Design direction

**Make the work easier to understand, assess, and explore.** The site already has distinctive material: actual robot CAD, workshop photographs, a Georgian identity, and an eccentric, hands-on voice. The biggest opportunity is editorial hierarchy. A visitor should quickly understand what the lab builds, why each project matters, what exists today, and what remains experimental.

Keep the blue-gray background, Helvetica headings, supplied emblem, actual project imagery, and occasional humor. Give real artifacts and clear explanations more space than file numbers, badges, source paths, and repeated flight-log terminology. A font replacement or wholesale redesign is unnecessary for the first pass.

Audience assumptions for this guide: curious visitors, potential collaborators, and technically informed readers evaluating the projects. These are inferred from the public portfolio and source links, not confirmed audience research.

Surface modes: homepage/project index = Experience with a clear introduction; project pages = Read; news feed = Read with a more informal voice.

## 2. Changes already applied in this review

- Removed **From the documentation** from the shared project-page template, including its imports and unused CSS. It is removed for all six projects.
- Removed generated excerpt imports from the client data module and the unused excerpt interface. The website no longer bundles those raw documentation snapshots through that module.
- Removed the validator's requirement that every project have a documentation excerpt. Existing snapshots and their optional refresh tools remain offline authoring references; original project documentation is preserved.
- Corrected Lara's Simulation specification to **Isaac Sim**, and replaced the public note about the legacy MuJoCo model with the user-confirmed simulator fact.
- Updated the existing route regression test to require the section's absence on all project pages and the corrected Lara specification.
- Updated the README to explain this separation between curated site content and offline source references.

The remaining recommendations below are a draft implementation brief. They have not been applied to the visual design or project claims. Preserve the user's existing `App.tsx` changes.

## 3. Review evidence and limits

The parent reviewer inspected the live Vite site in Chrome at desktop size (approximately 1512 px wide) and 390 × 844 phone size. Views included the homepage hero and project index, Lara desktop/phone, CupExS desktop, and the phone news feed. The phone menu was opened and used to navigate to Dispatches. All six project records and their shared rendering code were read. The two independent agents captured additional baseline views, but their unfinished reports are not treated as completed independent assessments.

Observed computed sizes include desktop project summaries at 13 px, card status at 8 px, and the technology selector at 10 px. On Lara at 390 px: back link 8 px, summary 14 px, spec labels 9 px, engineering notes 13 px. Its introduction begins around document y=1151 px and its repository panel around y=5216 px after removing the documentation section. These are measurements of this viewport/content combination, not universal layout constants. No horizontal overflow was observed in the sampled home/project views; that does not establish full breakpoint coverage.

The Impeccable context, detector, and storage-slug commands could not run because engine 0.1.5 is unavailable in the permitted cache. No deterministic finding count or trend score is claimed. No overlay was injected: the browser inspection used screenshots and the documented read-only DOM evaluation API. This file is the durable report; automated critique storage was unavailable.

Source audit covered the site records, news, local CupExS fit report and theoretical-model assumptions, current Project Tsintsadze README, and selected GYM Scale firmware/app documentation. It is not a complete hardware or research validation. Code establishes implemented/configured behavior; it does not establish successful physical testing.

## 4. Design assessment

### What works

1. **The artifacts are specific to this lab.** CAD assemblies and bench photographs communicate more than generic robotics illustrations would. Keep both, labeling revision and media type when known.
2. **The site has an identifiable voice.** The emblem, Georgian origin, workshop tone, and occasional humorous news entries feel personal. Concentrate that voice in the story and dispatches, with plain labels for navigation.
3. **Useful foundations already exist.** Project routes, semantic headings, filter states, image dimensions, source links, model posters, reduced-motion handling, and error fallbacks provide a good base for refinement.

### Priority issues

| Priority | Finding and consequence | Concrete direction | Relevant Impeccable workflow |
|---|---|---|---|
| P1 | Current project facts, old implementations, research aims, and achieved results are insufficiently distinguished. This weakens technical credibility. | Use a current-revision facts ledger; label aspirations and evidence; make owner corrections authoritative. | clarify |
| P1 | Small essential labels and mobile source links far below the article make reading and navigation harder. | Raise the type floor; move project actions beneath the summary; simplify metadata. | typeset, adapt |
| P1 | The homepage explains the name before the work; project pages favor implementation inventory over purpose, progress, and outcomes. | Lead with the lab proposition; organize projects as overview → current state → approach → evidence → next steps. | layout, distill |
| P1 | The carousel advances every two seconds, continues on hover/focus, and only pauses briefly after manual input. | Default to manual rotation, or add a persistent pause/play control and appropriate focus behavior. | harden, animate |
| P2 | Repeated decorative framing and inconsistent terminology compete with content. | Reduce file numbers, repository paths, repeated badges, and competing names for news; standardize copy and dates. | clarify, distill, polish |

These are design priorities, not claims that every item is a confirmed accessibility violation. No P0 blocker was established.

### Heuristic health snapshot

Scores are qualitative, 0–4, for the reviewed portfolio experience; they are not a compliance audit. This snapshot reflects the reviewed site after the two explicit content corrections.

| Heuristic | Score | Evidence or limitation |
|---|---:|---|
| Visibility of status | 3 | Filters, project statuses, and model loading state exist; project status is not tied to a clear milestone/date. |
| Match with real-world language | 2 | Purpose is obscured by flight/file language and firmware-first descriptions. |
| User control | 2 | Back links and navigation are available; persistent carousel pause is absent. |
| Consistency | 2 | Page structure is consistent, but typography, date forms, and news terminology vary. |
| Error prevention | n/a | No consequential form or destructive workflow in scope. |
| Recognition over recall | 3 | Visible project labels and categories help; mobile project actions are distant. |
| Expert efficiency | n/a | Portfolio reading does not require a power-user interaction model. |
| Aesthetic/minimalist design | 2 | Strong imagery, but repeated metadata and ornamental framing dilute hierarchy. |
| Error recovery | 3 | Image/model fallbacks, filter resets, and not-found routes exist; see verification notes for checks actually run. |
| Help/documentation | n/a | Standalone application help is not needed for this portfolio. Removing raw excerpts does not reduce this score. |
| **Total** | **17/28** | **Useful foundation with material hierarchy and clarity work.** |

### Cognitive load, journey, and reader risks

The main friction is hierarchy, distraction, and the order in which detail appears. Grouping and visible navigation are generally useful. Six navigation links plus category and technology filters create more decisions than this six-project catalogue needs, but counts alone do not establish a usability failure.

The current journey starts with personality and attractive artifacts, then moves into dense technical detail without consistently showing an outcome. Finish each project with a useful continuation: a recent update, an actual repository, or a concrete next milestone. Avoid ending every page with an unavailable repository and a decorative slogan.

- **First-time visitor:** may understand the film inspiration before understanding what the lab does. State the lab's purpose immediately.
- **Technical collaborator:** cannot reliably distinguish a configured feature, a research goal, and a demonstrated result. Give evidence and revision context.
- **Phone/low-vision reader:** faces 8–10 px labels and long scrolling to source actions. Raise essential text sizes and reorder actions.

## 5. Homepage layout and content organization

### Recommended order

1. **A clear lab introduction alongside one strong project visual.**
2. **Projects**, with concise, comparable summaries.
3. **Latest updates**, showing the three newest dispatches.
4. **The workshop**, combining a short origin story with practical capabilities.
5. **People**, with concise, consistent bios.
6. **A useful closing action**, using existing GitHub links and any verified contact channel supplied later.

Use the existing anchors and routes where possible. Do not rename project IDs or break news deep links to achieve cleaner display labels.

### Hero

Suggested headline: **“Robotics, built in our Tbilisi workshop.”**

Suggested supporting copy: **“We build robot arms, competition robots, and practical tools for the lab—moving between CAD, electronics, code, and experiments.”**

Primary action: **Explore projects**. Secondary action: **Latest updates**.

Move the full film explanation to Our story. The quote can remain as a smaller supporting line or in that story section; it should not be the only H1. Keep its attribution if retained, and do not invent a different translation. Remove the empty `.hero-eyebrow` element and its otherwise unexplained space.

At desktop sizes, retain the two-column relationship between introduction and artifact, but reduce the gap between proposition and action. On phones, put the purpose and primary action before the large visual. Avoid fixing the hero to a viewport height that pushes its action off-screen.

The stats strip is optional. If retained, make it a compact factual line rather than a second oversized hero: project count from `lab.projects.length`, member count from `lab.people.length`, and Tbilisi, Georgia. The current member count is hardcoded as `05`.

### Project index

- Keep the readable visual grid: three columns when cards have room, two at intermediate widths, one when copy becomes cramped. Set breakpoints by content fit, not by shrinking text.
- Give every card a single 20–35-word plain-language summary. Lara's two research bullets belong on its detail page, not in a visually taller catalogue card.
- Preferred card content: image → title → purpose summary → status. Show at most two or three genuinely useful tags. Remove `FILE / 01` and local folder paths from public cards; they do not help visitors choose a project.
- Add a `cardSummary` field rather than forcing one Markdown `summary` to serve both an index and a detailed reader.
- With six projects, retain categories if useful and remove the technology dropdown in the first simplification pass. It mixes technologies, disciplines, and applications and creates sparse combinations. If retained, show a visible label and readable text, and reconsider it when the catalogue grows.
- Current categories mix stage (Prototypes), purpose (Competition), and usage (Lab systems). A cleaner future taxonomy is Research, Competition & education, and Lab systems, but confirm project assignments. Keep development stage separate from category.
- Preserve keyboard navigation and the entire meaningful project link target. Avoid nested links if a whole-card link is used.

### Workshop, story, and people

The equipment section should explain what can be made here, with equipment names as supporting facts. Three compact rows are sufficient. The printer, soldering tools, and mechanical tools are credible; do not turn them into unsupported promises about speed, accuracy, or services offered.

Use a real workshop photograph in Our story only when an appropriate supplied asset exists. `origins.photos` is currently empty; do not fabricate an archival photo. The existing emblem can remain without implying it is a photograph of the first build. Verify the hardcoded “APRIL — JUNE” timeline before retaining it as a factual date range.

Standardize bios to one or two sentences and consistent capitalization. Preserve names and existing affiliations. Academic year is time-sensitive; either record when it was confirmed or use the less perishable “undergraduate student” with owner approval. Keep contributor credits empty until roles are confirmed. All six current `contributorIds` arrays are empty.

## 6. Typography, color, and spacing specification

### Font decision

Keep the established Helvetica/Helvetica Neue/Arial stack for headings and prose. The priority is scale and reading rhythm, not buying or importing a new display face. Keep JetBrains Mono for measurements, short dates, and code. Use the sans-serif face for descriptive captions, status sentences, and instructions. Avoid a third font family.

The current site intentionally uses white text throughout. The conservative first pass can preserve that preference and establish hierarchy through weight, size, and spacing. An optional later palette refinement can use a softer blue-gray secondary text color and a restrained existing gold accent; it must pass contrast checks before adoption. Do not equate every white label with poor contrast: the observed issue is relative emphasis and text size.

| Role | Desktop target | Phone target | Notes |
|---|---|---|---|
| Main display headline | 48–60 px | 34–40 px | About 1.1 line-height; avoid aggressively negative tracking. |
| Page title | 44–56 px | 32–38 px | Keep long names intact without overflow. |
| Section title | 28–34 px | 26–30 px | Clear separation above, tighter relationship to body below. |
| Project/card title | 22–26 px | 22–26 px | Weight 700; avoid shrinking for grid density. |
| Article body | 17–18 px | 16–17 px | Line-height 1.6–1.75, approximately 65–75 characters per line. |
| Card summary | 15–16 px | 15–16 px | Edit copy length before reducing size. |
| Caption/secondary prose | 13–14 px | 13–14 px | Sans-serif for explanatory sentences. |
| Controls/navigation | 14–16 px | 14–16 px | Target approximately 44 px touch height as a design goal. |
| Metadata/status | 12–13 px | 12–13 px | No essential information in the existing 6–9 px range. |

These sizes are design recommendations, not a claim that WCAG specifies a universal minimum font size. Test text enlargement to 200% without losing content or functionality. See [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).

Create a small type-token scale in `styles.css`; remove breakpoint overrides that repeatedly shrink the same role. Keep heading letter spacing around -0.02em to -0.03em, not fixed values that become excessive at small sizes. Body tracking should remain normal.

Use an 8 px spacing rhythm, with 4 px available for small adjustments. Suggested section spacing: 64–80 px desktop, 40–48 px phone. Card padding: 20–24 px. Group related label/value pairs tightly; separate sections more than individual paragraphs. Prefer one useful divider over a border around every nested unit. Preserve intrinsic image dimensions and contain-style framing for hardware.

## 7. Shared project-page structure

Recommended sequence:

1. Back to projects.
2. Title, short purpose statement, status, revision/date, and primary action.
3. Hero artifact with factual caption; retain the static poster and optional 3D interaction.
4. **Overview:** problem, intended user/context, and objective in two short paragraphs.
5. **Current state:** what exists now, what has been demonstrated, and what is still in development. Each is grounded in evidence.
6. **How it works:** three or four named engineering topics. Use bullets for independent facts; numbered steps only when order matters.
7. **Testing and results**, only when there are actual tests/results to explain.
8. Selected workshop images, diagrams, or simulation evidence placed near the relevant explanation.
9. **Next steps** for active projects, or **What we learned** for completed work, when supported.
10. Related dispatches and source files.

Move the main GitHub action into the header flow so it appears near the purpose statement on phones. A desktop sidebar can still contain components and supplementary links. A pending repository should be a quiet sentence (“Source repository not yet published”), not a large dashed box with an outbound-link arrow. Preserve the clearly labeled historical RoboSumo 2024 link.

Use a compact `dl` of genuinely useful facts. For Lara, “Simulation: Isaac Sim” is useful; “Artifacts: CAD, simulation, tracking tools” is less useful than a verified revision or capability. Do not fill missing payload, reach, precision, cost, or test metrics with plausible numbers.

Avoid “Introduction” followed by nearly identical summary paragraphs. Each section must answer a different question. Remove the fixed `01 / 02 / 03` labels; optional sections make that numbering arbitrary. Long pages may use a short “On this page” list based on headings that actually render; omit it on short pages.

### Replacement for the removed documentation section

**Do not add a replacement by default.** A raw source excerpt is not evidence of a working result. Retain repository links for readers seeking implementation details.

The best optional replacement is **Testing and results**, with four fields:

- What was tested and which revision was used.
- Method and conditions.
- Observation or measured result, with units and uncertainty where available.
- Limitation and next experiment.

Start with CupExS, which already has local measurement files and a fit report. For other projects, leave the section absent until meaningful evidence is available. Do not put “Results coming soon” boxes on every page.

## 8. Project-by-project content audit

### L.A.R.A.

**Confirmed correction:** Isaac Sim is the project's simulator, per the owner. The old MuJoCo folder is an archived implementation and must not override that correction.

**Existing issues:** the six-axis research description coexists with animation copy describing a seven-output revision (real model has 6 axis, 7 axis simulation has an additional experimental axis); research objectives are worded as accomplished capabilities; MBZUAI support and “stochastic mechanics” are not explained; a chronology of v1/v2 exists in news but not in the main project narrative. The summary's “Eliminating backlash” is stronger than evidence supplied in the page.

**Suggested card summary:** “A six-axis workshop robot arm exploring backlash reduction and vision-guided tasks with interchangeable tools.”

**Suggested overview opening:** “L.A.R.A. (Lab Assistant Robot Arm) explores how one robot arm could perform different workshop tasks. The project combines mechanical prototyping and simulation in Isaac Sim, with research into backlash reduction and vision-guided tool use.” Keep tool use framed as an objective unless demonstrated capability is confirmed.

**Confirm before expanding:** current axis/actuator count and whether a gripper/tool output explains seven outputs; current mechanical revision; what v1 demonstrated; what changed for v2; the precise backlash method; whether the tool changer and vision pipeline are implemented or planned; the meaning of MBZUAI-backed; measured repeatability/payload/reach only if available. Do not silently replace a named research method with a different one.

**Use existing evidence carefully:** the 27 August dispatch reports a built v1; the 13 October dispatch reports starting v2. Present these as dated project updates, not independent proof of performance. The site period starts in August although the August post mentions a year of conceptual work: distinguish conceptual work from the current build period instead of guessing a start date.

**Media rule:** every existing `lara-sim-*` image came from Isaac Sim. But the sim build is for the version 1 of the robot and not v2. A CAD viewer also does not establish simulation or real-world operation.

### Pop-up Spoiler

**Strength:** the present description and current Tsintsadze documentation support two ESP32 boards, four encoder-feedback motors, and paired four-bar linkages. The site already acknowledges that acceleration-derived tilt and behavior under driving loads need testing.

**Suggested card summary:** “A two-wing spoiler prototype with coordinated motor control and adjustable responses to sensed roll and pitch.”

**Improve the story:** organize the seven long engineering bullets into Mechanism, Control, Tuning, and Testing. A small labeled diagram of one linkage would explain the mechanism better than a code excerpt. Keep exact arm lengths in specifications or a detailed diagram, not in the opening paragraph.

**Confirm/add:** current assembly or installation status, vehicle-fit evidence, mechanical travel/clearance checks, demonstrated synchronized motion, and any measured control error. Treat code-defined shutdown behavior as implemented logic until physical fault testing is documented. Preserve the distinction between a 0–70° wing command and the documented negative physical wing-angle convention; do not write “70° upward travel” without verification.

**Avoid:** claims of proven downforce, cornering benefit, road readiness, or measured aerodynamic performance without test evidence. The October wiring post describes a pre-mounting stage and should be dated if used for current-state copy.

### Tekkai 2.0

**Strength:** the purpose is clear and current notes identify opponent sensing, edge inputs, and debugging. The historical 2024 repository is correctly labeled separately.

**Suggested card summary:** “An autonomous sumo robot that searches for opponents, pushes toward them, and uses edge sensors to stay inside the ring.”

**Suggested introduction revision:** “Tekkai 2.0 was built to find an opponent, push it out of a sumo ring, and avoid crossing the boundary. Compared with the 2024 version, the project description records four-wheel drive, infrared edge detection, stronger motors, and revised ultrasonic sensing.” Confirm the upgrade comparison before publishing it as a definitive specification.

**Confirm/add:** competition/event and class, dimensions and mass, budget, wheel/motor configuration, test/competition outcome, what “Completed” means, and the 2026 source location. If no result is recorded, state the build milestone without implying a ranking. Do not infer a winning result from the completed status or images.

**Layout:** show the assembled robot and a short behavior sequence (detect → approach → push → avoid boundary). Promote meaningful mechanical upgrades over GPIO or active-low implementation details.

### CupExS Drag Racer

**Opportunity:** this project has a stronger experimental story than its short generic summary suggests. There are acceleration/coast-down CSVs, a theoretical model, fit results, and an existing chart. The chart is currently presented without a dedicated explanatory results section.

**Suggested card summary:** “A hands-on physics kit for investigating how gear ratio changes a small car's acceleration, speed, and stopping behavior.”

**Recommended Testing and results section:** compare the 1:1 and 1:1.57 experiments; explain that the report fits position-versus-time traces; present the chart with legible axes, a concise conclusion, and a small methods/limitations note. Define the gear-ratio convention before interpreting it.

The local report lists powered-acceleration position RMSE of about **2.9 mm** and **5.3 mm** for the two runs. These are **model fit residuals**, not timing-gate accuracy, distance-measurement accuracy, or a successful ten-metre race result. The report's terminal speeds are fitted/model quantities, not measured top speeds. Use these numbers only with that context and after the project owner confirms the report is the intended public analysis.

**Confirm/add:** actual ten-metre timings, repeat count, measurement method, uncertainty, gear-ratio selection outcome, kit use at the event, and whether dyno-derived results were used in this fit. Keep car controller, timing gates, and companion dyno as three distinct systems. The current description explicitly says browser Start does not synchronize launch with the timer; preserve that limitation.

**Revise the chart caption:** prefer “Position measurements and fitted acceleration/coast-down curves for two gear ratios” over an unqualified claim that the model was validated. The fit report states identifiability limitations: straight-line tests do not independently determine front and rear rolling coefficients.

### Door Security System

**Suggested card summary:** “A lab door monitor that detects beam interruptions and movement, sounds an alarm, and can send email alerts.”

**Improve the explanation:** organize around the visitor-understandable sequence: arm → monitor → confirm an event → latch alarm → inspect/reset. Use a real installation photograph or labeled sensor diagram if supplied. Put 350 ms and 250 ms thresholds in technical details, not in the opening story.

**Confirm/add:** whether it is installed and used daily, beam placement/range, tested false-trigger behavior, alarm reset/recovery, behavior during power/network loss, and whether optional email alerts are configured. Separate firmware support from actual deployment and observed reliability.

**Avoid:** guarantees of security, detection accuracy, or continuous operation. Do not publish local network credentials or configuration while describing the system. Keep the cat dispatch as characterful news rather than the only evidence of real operation.

### GYM Scale

**Suggested card summary:** “A Bluetooth-connected weighing platform with a companion app for recording measurements and food logs locally.”

**Improve the explanation:** show the physical scale beside the actual app screen; describe measure → transmit → save. Explain the meaning of the name or add a plain subtitle so visitors do not assume it is a body-weight scale.

**Confirm/add:** actual load-cell model and capacity, calibration method, measured repeatability/accuracy, drift, demonstrated app platforms, and the stage covered by “Completed.” Current firmware contains a 10 kg capacity configuration; this is not sufficient evidence of the physical sensor's rated capacity. The 200 ms notification interval is a transport limit, not a verified measurement-latency or sensor sample-rate claim. A 16-byte packet belongs in source documentation unless it matters to the reader's goal.

The app documentation supports a Flutter BLE workflow and contains setup/build instructions. Source support for a platform does not establish a tested release on that platform. Preserve the site's existing prototype qualification; do not infer certification or health-related accuracy.

## 9. Wording and editorial rules

Use ordinary words for destinations and controls. Keep “Dispatches” as the site's characterful news name if desired, but use it consistently instead of alternating between signals, transmissions, flight log, and field notes for the same destination.

| Current wording | Suggested wording |
|---|---|
| A few (eccentric) projects | Projects |
| Latest Lab Dispatches. | Latest dispatches |
| The complete flight log | All dispatches |
| All signals | All updates |
| 10 TRANSMISSIONS | 10 updates |
| No experiments on this frequency. | No projects match these filters. |
| BACK TO THE PROJECT INDEX | Back to projects |
| Rehearsed in software | Simulation |
| SOURCE MARGINALIA / From the documentation | Remove; no automatic replacement |
| PEER / 01 | Remove |
| Sherekilebi Team. | Our team |

Suggested news introduction: “Build updates, experiments, and everyday life in the workshop.” The current “R&D breakthroughs” implies a level of achievement not established by every post.

Suggested soldering description: “Assemble prototype circuits, solder wiring, and install brass threaded inserts in 3D-printed parts.” This removes “Build Robust,” “less then,” “3d,” and an unsupported one-day promise.

Suggested hand-tools description: “Calipers, drivers, pliers, and drills for measuring, assembling, and adjusting prototypes.”

For the October Lara update, a more useful summary would explain what the new parts change. Draft only after confirmation: “The next set of LARA parts is on the printer as work begins on v2.” Preserve a casual voice in posts; not every dispatch needs formal research prose.

Use consistent dates such as “Aug 2026–present” and “Jun 2026.” Prefer structured date fields for future records, with one formatter, but avoid a schema migration solely for punctuation. Display real update dates; do not automatically label every project “updated today.”

Use “aims to,” “explores,” and “is being developed” for goals; “implements” for source-confirmed behavior; “demonstrated” or “measured” only with a specific test. Avoid “eliminates,” “precise,” “robust,” and “validated” unless the evidence supports the scope of the claim.

## 10. Minimal content model and provenance

Keep the data model small. Candidate additions to `Project`:

```ts
cardSummary?: string; // Short, plain-language catalogue sentence.
currentState?: string; // Curated Markdown, grounded in a dated milestone.
revision?: string;
lastUpdated?: string; // Real editorial review date, not build time.
results?: {
  title: string;
  method: string;
  finding: string;
  limitations?: string;
}[];
nextSteps?: string[];
```

Treat these as a proposed schema, not a requirement to add every field at once. Keep `summary` for the detail lead and use `cardSummary ?? summary` while migrating. Render optional sections only when meaningful content exists. Validate dates, nonempty supplied results, and references; do not require unsupported achievements to make the build pass.

Maintain an authoring-only facts ledger for each project: claim, current revision, evidence path/date, verification status, and unresolved question. Suggested statuses: owner-confirmed, source-confirmed, measured, historical, needs-confirmation. Do not render this ledger or raw source excerpts on the public page.

For disagreements, prioritize the owner's explicit correction about the current project, then clearly dated current evidence. A matching term in an archived README is not sufficient to identify the current stack. Preserve historical facts separately when useful.

Related updates can be derived from `newsPosts` using `relatedProject`, sorted newest-first. Link to the existing `/news#<slug>` anchors. Show at most two or three per project and omit the section when empty.

## 11. Interaction, accessibility, and asset loading

- **Carousel:** recommended default is manual rotation. If autoplay stays, provide a visible Pause/Play control whose paused state persists until the user resumes. A temporary three-second pause or a reduced-motion preference alone does not give every visitor control over ongoing automatic updates. W3C explains this requirement in [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Preserve arrow keys, touch scrolling, project links, and reduced-motion behavior.
- **Animated simulation:** inspect whether the animated WebP loops; if it does, use a controllable video or an explicit play/stop mechanism with a static poster. CSS reduced motion does not automatically stop a GIF/WebP's intrinsic animation.
- **Targets:** aim for 44 × 44 px primary touch controls. This is a design target; WCAG 2.2 AA's minimum is 24 × 24 CSS px with specified exceptions, not a blanket 44 px requirement. See [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- **Text/focus:** retain visible focus, skip link, semantic headings, useful image alternatives, and non-color-only status labels. Check 200% text enlargement and 320 px layout. Make title changes, filter states, and fallback messages comprehensible without relying on animation.
- **3D:** preserve static media for failed WebGL and low-power use. Consider an “Explore in 3D” button that starts loading on demand. Do not replace the working artifact viewer with a decorative mockup.
- **Performance:** the reviewed production build totals about 15.95 MB of distributed assets; this is not the initial page transfer size. Lara's GLB alone is about 5.72 MB, its animated WebP about 1.96 MB, and the shared viewer JS about 683 KB minified before transfer compression. Measure actual requests and rendering before promising speed improvements. Lazy-load below-fold animation and make expensive 3D optional if it delays reading.
- **Documentation:** update the README's old 3.6 MB output estimate when maintaining its performance guidance; the current model assets have changed the distribution substantially.

## 12. Implementation plan for Codex

### Pass 1 — factual and editorial foundation

1. Preserve the corrections already made and existing local user edits. Work within `website/`; do not modify hardware repositories as part of website editing.
2. Add concise card summaries for all six projects using the drafts above, checking facts before expanding them.
3. Build the authoring facts ledger and mark unresolved claims. Correct confirmed contradictions; do not halt unrelated layout/copy work while waiting for project measurements.
4. Normalize navigation/news terms, dates, equipment grammar, and team-bio capitalization.
5. Draft CupExS results with method and limits, and connect Lara's existing milestones. Leave unconfirmed metrics and roles unpublished.

Primary files: `src/data/lab.json`, `src/data/types.ts`, `src/data/index.ts`, `src/data/news.ts`, `content/news/*.json`, `scripts/validate-content.mjs`.

### Pass 2 — hierarchy and layout

1. Rework the hero around the lab purpose; move the extended name explanation into Our story.
2. Simplify project cards and filters; derive all displayed counts.
3. Introduce the type/spacing scale and remove shrinking overrides for essential text.
4. Move project actions near the summary; simplify the sidebar and pending-source state.
5. Add conditional current-state/results/next-steps sections, with images placed near the claims they illustrate.
6. Reduce news header duplication and make the first actual update easier to reach. Keep current pinning and chronology semantics.

Primary files: `src/App.tsx`, `src/pages/ProjectPage.tsx`, `src/pages/NewsPage.tsx`, `src/components/DispatchCard.tsx`, `src/components/ProjectSummary.tsx`, `src/styles.css`, `src/dark-theme.css`.

### Pass 3 — motion and delivery

1. Implement the chosen carousel behavior and revise existing tests that currently require rolling on hover and automatic resumption.
2. Verify optional model loading, poster fallback, reduced motion, and controllable simulation media.
3. Consolidate theme roles so `dark-theme.css` does not need broad selector lists to override every element. Preserve the approved dark appearance.
4. Update project/media documentation to match actual behavior and asset sizes.

Primary files: `src/components/TapeSlider.tsx`, `src/components/ProjectCarousel.tsx`, `src/components/ProjectMedia.tsx`, `src/components/ProjectModelViewer.tsx`, `tests/site.spec.ts`, `tests/project-models.spec.ts`, `README.md`, `MODEL_WORKFLOW.md`.

### Acceptance criteria

- A first-time visitor can identify the lab's location, work, and project action from the opening view.
- All six cards have concise comparable summaries; no essential label is deliberately reduced below 12 px.
- Every project distinguishes purpose, current state, and intended next work without inventing outcomes.
- Lara consistently names Isaac Sim; old media is not falsely relabeled; unresolved method/revision/support claims are tracked for confirmation.
- The documentation section and raw excerpts remain absent from public pages and the client data bundle.
- The main project source action is reachable near the summary on phones; unavailable source links are honest, quiet text.
- CupExS results distinguish fit residuals, model predictions, and directly measured results.
- Carousel motion can be stopped persistently, or is manual by default; reduced-motion and touch scrolling still work.
- Existing project URLs, news anchors, source URLs, model controls, and verified content remain functional.
- No horizontal overflow at 320, 390, 768, 1024, and 1440 px; text remains usable at 200% enlargement. Inspect desktop and phone together in one bounded pass, fix findings together, and confirm once.

### Validation commands and scope

Run from `website/`:

```sh
npm run build
npx playwright test tests/site.spec.ts
npx playwright test tests/project-models.spec.ts
git diff --check
```

After changes spanning several TSX components, follow the installed React best-practices review skill. Use existing tests and adapt them to the intended behavior; do not retain tests that enshrine an intentionally removed feature. Add focused regression assertions for new conditional result sections and explicit pause behavior only when those features are implemented.

For this review's small content/template change, the production build and focused project-route, media-fallback/reduced-motion, and accessibility tests are the relevant checks; the entire redesign and future acceptance criteria are not claimed complete.

**Executed verification:** `npm run build` passed TypeScript, content validation, bundling, and the static-output audit (79 files, approximately 15.95 MB). Three focused tests passed in 13.2 seconds: project direct routes/source-link attributes, missing-media fallback/reduced motion, and automated accessibility checks on the home/feed/expanded Markdown/project views. Source-link assertions check destinations, not the remote repositories' current availability. `git diff --check` passed. Build warnings remain for React Router's `use client` directives and the large CAD-viewer chunk. No browser console warnings/errors were captured in the inspected tab. The manual review is not a full screen-reader, zoom, or performance audit.

Verification screenshot: `test-results/design-review/lara-isaac-sim.jpg` (local, ignored test artifact). It shows the corrected simulator specification in the project page. Automated critique slug/trend persistence was unavailable; this guide preserves the review instead. No project-level Impeccable ignore list was present. The two attempted agent assessments did not finish; the parent completed its qualitative assessment before attempting the unavailable detector.

## 13. Ready-to-use Codex task

> Refine the existing Sherekilebi Labs site using `DESIGN_IMPROVEMENT_GUIDE.md`. Preserve the dark palette, Helvetica identity, supplied artwork, current routes, working CAD viewers, and existing user edits. Start with project factual clarity, readable type, and mobile access to project actions. Keep Lara's simulator as Isaac Sim and keep raw documentation excerpts removed. Use the proposed card summaries and project structure, but verify factual additions and leave unknown performance, support, contributor, and revision claims unpublished. Explain the lab's work before its name's origin. Add Testing and results only where supported evidence exists, beginning with CupExS; distinguish fitted quantities from measurements. Use manual carousel rotation by default unless a persistent pause/play alternative is selected. Implement in the three bounded passes above, run relevant build/browser checks, and report completed changes separately from facts still awaiting confirmation. Do not publish or deploy as part of this task.

## 14. Decisions for a later implementation pass

The recommended defaults above make this guide executable without a new discovery phase. Two optional choices can refine it:

1. Hero emphasis: **lab-purpose headline with quote in Our story** (recommended), or **retain the quote as a smaller supporting line beside the lab-purpose headline**.
2. Carousel: **manual rotation** (recommended), or **slower autoplay with a persistent Pause/Play control**.

Project-specific factual questions are recorded in section 8. Those answers are required only before publishing the corresponding new claims, not before making the layout and readability improvements.

## 15. Implementation completed — 29 October 2026

The recommendations have now been implemented in the local site, with these owner-selected decisions and clarifications:

- Lead with the lab’s work and retain the film quote as a smaller supporting element in the hero.
- Use manual featured-project navigation with arrows, keyboard controls, and swipes.
- LARA v1 is assembled and tested joint by joint. No coordinated sequence or task has been simulated or tested on the physical arm.
- LARA v2’s CAD and printed parts are complete. The first tool-changer design is complete, with identified issues being revised for v2.
- The stochastic-analysis plan is research: collect extensive real motion data, investigate tracking-error patterns, and evaluate target compensation. It is not yet a validated predictive controller.

Completed changes include the shared type/spacing scale; centralized dark-theme roles; concise project cards; category-only filtering; derived project/member counts; clearer news labels; project source actions in the header; conditional current-state/results/next-steps sections; project update links; CupExS methods and limitations; controllable simulation animation; and optional loading of CAD viewers through Explore in 3D. Equipment and team copy have been normalized without advancing academic years or inventing contributor roles.

`PROJECT_FACTS.md` records the authoring evidence and remaining factual follow-ups. The original review remains above as an historical snapshot; its 17/28 score is not a score of the improved site. Do not treat its old pending LARA questions as unanswered where the owner clarification above resolves them.

Verification completed after implementation:

- `npm run build`: passed TypeScript, content, production bundling, static-route, and output checks; 79 reviewed distribution files, approximately 15.93 MB. Optional assets are included in that total, not the initial transfer.
- `npx playwright test`: all 19 tests passed, including CAD interaction/failure, manual carousel stability, source actions, results visibility, news anchors, responsive widths from 320 to 1440 px, media proportions, explicit animation playback, no initial model/animation requests, automated accessibility, and 200% text enlargement.
- React review: derived data is computed without synchronization effects; heavy CAD code stays behind the existing dynamic import and explicit activation; new media controls are keyboard-operable; project media state resets with route identity; no new dependencies or global listeners were added.
- One combined desktop/phone visual pass covered the hero, catalogue, LARA header, and news. No additional visual changes were needed. Browser console inspection showed no warnings/errors in the inspected session.
- The Impeccable engine remains unavailable; no automated design-detector pass is claimed.

The older LARA render assets are retained as reference imagery without assigning a renderer. Their exact provenance, institutional-support wording, unreported hardware metrics, and other projects’ physical test outcomes remain authoring follow-ups. No unconfirmed numeric performance or competition results have been added.

## 16. Owner-requested follow-up — 29 October 2026

These decisions supersede the earlier manual-carousel and opt-in-3D preferences:

- Featured projects advance every 3 seconds. Hovering anywhere inside the carousel pauses automatic advancement; arrows remain usable. Leaving the border starts a fresh interval. Keyboard focus and an explicit Pause/Resume control also allow readers to stop rotation. Reduced-motion visitors receive manual instant transitions.
- Project CAD models render automatically. The bright Explore in 3D sign identifies and focuses the already-active model.
- The cropped poster/static-image regression came from the fixed-height media grid's intrinsic track sizing. Restored contained flex framing with explicit image minimum sizing, preserving the entire image during loading/fallback and on the Door Security and GYM Scale pages.
- Removed the LARA simulation stills from content and the production asset list. The animated joint sweep remains with Pause/Play and reduced-motion support.
- CupExS branding is top-left on the homepage card and top-right over the event photo. Removed Testing and results and its analysis figure. Current state now records the owner-confirmed total of 5 functional kits.
- Reviewed the selected Sumo 2026 project in `~/program files/PlatformIO/Projects/Sumo 2026`, compiled an exported copy, and published the allowlisted files to the owner-authorized public repository [Tekkai-2.0](https://github.com/Sherekilebi-labs/Tekkai-2.0), commit `4fa08debfc18766a6b31a79b9e20a7fe3df6309f`. The page links to this current source and keeps the 2024 link historical. Both README and page explain that ultrasonic target pursuit precedes edge checking.

Verification: production build and `content:check` passed; all 20 browser tests passed, including timed hover/resume, automatic CAD, renderer fallback, media fit, corner branding, current repository links, responsive layouts, text enlargement, and automated accessibility. PlatformIO's esp32dev build passed. Remote main matches the reviewed Tekkai commit. Build/compile success does not establish additional hardware performance.

## 17. Copy and animation preference — 29 October 2026

The joint-sweep image now runs automatically with no playback controls. This supersedes the earlier joint-sweep Pause/Play recommendation. Project copy uses direct descriptions of goals, progress, and behavior; contrastive “X is not Y” clauses have been removed or rewritten. Current-state information and the firmware's target/edge decision order remain explicit.
