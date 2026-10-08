# Frontend learning upgrade — October 2026

This release supersedes the earlier backend plan. The user requested a frontend-only application and removal of the learning desk, teacher workspace and content review. All tracked backend files and their CI job have been removed. Graph calculus now runs in the browser; no API URL or account configuration is exposed.

## Implemented

Class explorer redesign; single guided navigation; detailed Limits explanation, proof and applications; formula symbol guides, justified family derivations and model-construction explanations; arithmetic-operation traces; worked examples and real-life challenges; 56 additional relationships with explicit domain checks and five context tasks each; six playground workspaces and precision construction tools; parametric/polar/data-fit graph modes, secant comparison, local symbolic differentiation and CSV export.

Catalogue totals are 403 formulas, 475 labs and 2,055 situation tasks. The 1,200 challenge bank and its class/topic filters are preserved. Counts are generated from catalogue arrays in the analytics screen.

## Content and numerical boundaries

A family derivation explains the relationships named in that family; model-construction guides explain the expression and assumptions without claiming a theorem proof. Numerical demonstrations do not replace proofs. The separate Circle Area chapter remains the complete thirteen-section representative chapter. School-board mappings and competitive programme extensions retain their explicit coverage inventory; this release does not assert complete curriculum validation.

Symbolic calculus uses a bounded arithmetic tree and selected analytic rules, without eval or network requests. A numeric constant exponent is required by the power rule. Logarithm, square-root, quotient and original expression domains must still be respected. Graph critical points, roots and signed integrals remain numerically detected and may miss special cases or singularities. Data fitting describes correlation under the supplied observations, not causation.

## Validation

32 automated checks cover every formula's default/alternative inputs, five situation types, four focused-lab examples and activity targets, explanations and calculation-trace results, class challenge counts, restricted parsers, symbolic product/quotient/chain rules, least squares, exact responses, distribution mass, constrained maxima, circle intersections, geometry and prior discovery resources. TypeScript and production build checks are required. Browser checks exercise the single lesson path, formula guide, class selection, graph modes, playground tools and responsive layouts before publication.


## Creative frontend revision
- Formula library: eight guided stages, linked experiment/calculator inputs, numeric prediction feedback, five contextual worked tasks and five calculation/explanation/check approaches. Authored alternate methods for twelve core relationships; general model-specific strategies for the remainder. Mental strategies, conceptual reasoning, visual connections, competition investigation and exam checklists are included without claiming five independent proofs for every formula.
- Playground: chooser-first navigation, seven workspaces, eight design templates, palette/background/motif controls and SVG export. Essential geometry tools are shown first, with searchable collections revealing the full toolset; sixteen starting projects live in an expandable drawer.
- Domain overview and inner domain pages: visual cards, concept roadmaps, guided starts, class/difficulty/search filtering and paginated lab exploration.
- Verification: 34 mathematical checks; frontend type checking and production build; browser verification of live-linked prediction feedback, design customization/export invocation, domain filters and mobile bounds. Browser download-event reporting was unavailable, so file transfer completion was not confirmed through that event API.


## Canvas and guided project revision
- 276 projects: 20 geometric families × 13 parameterized activities + 16 original scenes. Text/topic/difficulty discovery, paginated cards, detailed guides and measured goal feedback. Inventory is explicitly described as activity variants, not hundreds of unrelated concepts.
- Precise insertion, focus mode, automatic return to Select, color editing, alignment, fitting, pan controls and typing-aware keyboard shortcuts. Circle/arc fitting uses conservative radius bounds; ellipse bounds enclose the rotated construction box. Text fitting estimates its rendered width.
- Graph workflow chooser, independent vertical fitting, curve visibility/colors, progressive analysis panels and a bisection solver with finite-value/residual safeguards. Numerical approximations and domain restrictions remain visible.
- 37 mathematical checks pass, including achievability and incomplete-starter rejection for all 260 generated project goals. Browser verification covers filtered projects, exact insertion, goal feedback and the root solver.


## Competitive exam foundation release
- Added six sidebar routes and home/analytics entry points. 65 original explained concepts, five approaches and five parameterized cases each (325 cases). Foundation/Intermediate/Advanced filters reflect the content; this is not full syllabus certification.
- Number/rate/growth/geometry/counting lessons and pattern/spatial/deductive reasoning teach rules, assumptions, five concrete worked approaches, practical context and common traps. All approaches use the same displayed case; some are verification techniques.
- Practice separates answers from worked explanations until submission. Lesson practice hides both computed output and solved visual. Probability options remain within [0,1].
- Optional deadlines, clear +1/penalty/skipped scoring, marked questions, complete solution review, retry of missed/skipped cases; no backend or account data. Leaving/reloading resets attempts.
- 42 tests passed, including checked golden answers for all 65 starters, integrity of all 325 cases, independent rate/counting/growth identities, filtering, uniqueness and scoring. Browser checks verified timed navigation, mixed-answer scoring (0.75 for 1 correct/1 wrong/3 skipped at −0.25), mobile no horizontal page overflow, and a four-question retry after one correct/four skips.
- Scope references (internal documentation only): https://ssc.gov.in/for-candidates/syllabus and https://www.ibps.in/wp-content/uploads/DetailedNotification_CRP_CSA_XV_Final_for_Website_12.9.2025.pdf . Product lessons remain VisionicX-branded.
