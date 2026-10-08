# VISIONICX MATHS ATLAS

A frontend-only interactive mathematics application built with React, TypeScript, Vite and Three.js. It runs entirely in the browser and deploys to GitHub Pages through GitHub Actions. No API service, accounts, database or server credentials are required.

## Learning experience

- A redesigned Class 1–12 explorer with learning milestones, topic filters and linked lessons.
- One eight-step lesson path: understand, explore, predict, derive, read the formula, solve examples, apply and challenge. Linked model parameters persist between steps.
- 475 labs: 33 original labs, 39 multi-formula workshops and 403 focused formula experiments.
- 403 searchable formulas with conditions, symbol explanations, origin/reasoning guides, actual arithmetic traces, worked examples and five application tasks each.
- 2,055 situation tasks and 1,200 class/topic-filtered challenges (100 per class).
- A detailed Limits lesson with two-sided reasoning, an epsilon–delta justification for x², four worked cases and a real-life flow-rate challenge.
- Six playground workspaces: geometry, matrices, probability, constrained optimization, algebra and pattern design. Geometry retains 27 tools, 16 projects and 16 missions; adds arbitrary transforms, radial patterns and circle intersections.
- Graph Studio: six Cartesian functions, parameter controls, tangent/normal/secant comparisons, derivative and integral overlays, parametric and polar curves, least-squares data fitting, coordinate tables and SVG/CSV export.
- Interactive 3D home scene, curriculum navigation, foundation models and catalogue analytics.

The learning desk, teacher workspace and content-review screens have been removed. Practice completion and editable playground data use optional browser-local storage; there is no remote synchronization.

## Mathematical scope

Formula guides distinguish justified family derivations from definitions and model-construction explanations. The operation trace verifies numerical examples; it is not a general theorem proof. The Circle Area chapter retains its separate complete visual derivation. Curriculum inventory flags remain a separate record of school-mapping coverage, rather than a claim that every board syllabus is complete.

Browser symbolic differentiation supports sums, products, quotients, numeric constant powers, sin, cos, tan, exp, log and sqrt, including the chain rule. Unsupported expressions receive a clear message and can use numerical overlays. Original domains still apply. Numerical root searches and quadrature are estimates, not certified symbolic solvers. Class placement is guidance and can differ by school.

## Development and deployment

Use Node.js 24 and pnpm 10.11.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
```

The workflow in `.github/workflows/deploy.yml` tests and builds the frontend, then publishes `dist` on pushes to `main`. Configure Settings → Pages → Source as GitHub Actions. Deployment uses GitHub's workflow token and OIDC. The Vite base path is `/vai_mathematics_atlas/`; hash navigation works without server routing rules.

See [implementation notes](docs/MASTER-UPGRADE-AUDIT.md) for scope and verification.


### Creative learning upgrade
The formula library now follows the same eight-step sequence as the standard lab journey. Its experiment inputs share state with the graph/calculator and persist between steps. Five approaches per formula cover calculation, explanation and checking; core examples have additional authored shortcuts. These approaches are not a claim of five distinct algebraic solutions or complete proofs for every formula.

The playground starts with a workspace chooser, includes seven workspaces and an eight-template SVG design studio (rosette, mosaic, spiral, wave art, mandala, poster, blueprint and emblem). Templates expose relevant controls, four palettes, six motifs where applicable and SVG export. Geometry starts with eight essential tools; collections and search reveal all 27 tools. Domain pages include an overview, concept path, guided start and searchable labs with class/difficulty filters.


### Guided construction and graph workspaces
Geometry has a 276-project library with text search, topic/difficulty filters and paginated cards. This inventory includes 260 parameterized activities across 20 shape families, plus 16 original scenes. Generated tasks have four steps, a construction explanation, a real-life prompt and a measured validator. Hidden objects are excluded from goal checks. Project checks validate the measured result, not a student's written proof or the exact construction method.

The canvas adds precise unit-based insertion, a focus view, alignment, custom colors, fit-to-objects and pan controls. New drawings return to Select by default. In the focused workspace, V/R/C select tools, Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z redoes, Ctrl/Cmd+D duplicates, Escape deselects and Delete removes an unlocked selected object. Shortcuts do not act while typing into fields.

Graph Studio begins with six intent-based workflows. Cartesian analysis supports curve visibility/color controls, independent fitted vertical scale, expandable controls/results and bracketed bisection with iteration/residual reporting. The numerical solver is a learning aid, not a symbolic proof or a guarantee of finding every root. Parametric, polar and data-fit workflows remain available. Design studio now explains concrete export uses: school posters, presentation artwork, decorations, emblems and composition previews.


### Competitive Exam Lab
Six frontend-only sidebar screens cover a common competitive aptitude curriculum: 120 explained concepts (35 arithmetic, 38 quantitative, 33 reasoning, 14 data interpretation), 960 worked examples (eight per concept) and 2,400 parameterized practice variants (20 per concept). Each worked example has five approaches, explanations of the relationship and its construction, assumptions, mistakes and practical use. Variants change givens within a model; they are not 2,400 independent question formats. Five approaches include reasoning, calculation and checks rather than five unrelated derivations.

Practice defaults to a random ten-question set. Learners can select multiple topics, track and level; presets include 5 questions/5 minutes, 15/30 minutes and 30/30 minutes. Counts from 5 to 50 and timers from 5 to 60 minutes are configurable. Learners must explicitly choose whether to use negative marking before starting; wrong-answer deductions support 0.25, 0.33, 0.5 or 1 mark. Correct answers earn one mark, skips zero. Sets contain no repeated question IDs and are capped to the filtered pool.

Results show net score, attempted accuracy, marks deducted, total elapsed time, average question time, track breakdown and per-question timing. Timing includes reading, revisits and background time; absolute deadlines cap late callbacks. Review can be filtered and sorted by longest time. Learners can restart the same test, generate another set, change settings or retry misses/skips untimed. Download creates a self-contained HTML report; Print / Save PDF uses the browser print dialog. Attempts are frontend-only and reset when leaving this screen or reloading. No scores predict exam rank or readiness.

The coverage spans common arithmetic, quantitative aptitude, reasoning and data interpretation, not an officially complete syllabus for every examination. Content is original practice, not past examination questions. Direct lesson links use `#exam-quant?lesson=work`; related formula pages link to concept lessons. Dark mode now uses consistent page, input, navigation and report colors.

Validation: 48 Node tests pass, TypeScript checking and production build pass, with desktop/mobile browser checks for random and focused tests, negative scoring, timing, report filtering, restart, untimed retry and a downloaded HTML report.
