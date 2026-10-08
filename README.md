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
Six frontend-only sidebar screens: Exam Preparation Hub, Arithmetic Mastery, Quantitative Aptitude, Reasoning Studio, Data Interpretation, and Speed & Practice. The original VisionicX catalogue contains 65 lessons (21 arithmetic, 21 quantitative, 19 reasoning, 4 data) with five worked approaches and five distinct parameterized question variants per lesson: 325 variants, not 325 independent question formats. Each lesson explains meaning, construction, assumptions, mistakes and practical use. Methods include calculations, representations and checks; five methods are not claimed to be five unrelated derivations.

Practice supports track/topic/level filters, 5/10/20-question sets, optional 5/10/20-minute timers, configurable wrong-answer penalties, question navigation, review markers, solution review and untimed retry of misses/skips. Attempts live only in the current tab and reset on navigation/reload. Timers use absolute deadlines to handle background-tab throttling. Practice results report attempted accuracy and actual scores, without readiness predictions or ranks. Direct lesson links use `#exam-quant?lesson=work`; thirteen relevant Formula Library entries link to the new lessons.

The coverage is a common aptitude foundation, not a complete or officially mapped syllabus for every competitive examination. Content is original practice, not past examination questions. Topic scope was checked against the SSC syllabus portal and the official IBPS CSA XV notification (quantitative aptitude and reasoning sections), while exam-specific patterns and non-mathematical subjects remain outside this release.

Validation: 42 Node tests, TypeScript checking, production build, and desktop/mobile browser checks for search, linked lessons, answer hiding, timer countdown, scoring and retry.
