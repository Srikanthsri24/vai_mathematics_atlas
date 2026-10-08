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
