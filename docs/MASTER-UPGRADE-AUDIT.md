# VisionicX Maths Atlas — discovery platform audit

## Existing implementation preserved

419 interactive labs: 33 original engines, 39 workshop labs and 347 formula-specific labs. There are 678 concept presets (420 distinct labels), 347 formula records, 1,775 application situations, 1,200 challenges (100 per class), and the existing playground. React/Vite/TypeScript, KaTeX, SVG, React Three Fiber, shared parameter state, graph/table/spatial views, classroom fullscreen and GitHub Actions remain in use.

These counts describe existing experiences, not complete syllabus chapters. A formula-specific graph is not automatically a geometric proof. Many existing explanations and historical records still require mathematical/editorial review.

## Upgrade implemented

- Typed curriculum hierarchy, six strands, Foundations 1–3 and Classes 1–12 inventory; board/year/version selection carries its mapping status. Core model inventory and school syllabus gaps are separate views.
- Ordered eight-stage navigation across existing topics. Circle Area has a complete representative chapter: construction, six justified derivation lines, finite-versus-limit explanation, independent regular-polygon bounds, conditions, historical evidence, three valid methods, editable applications and exact practice.
- Fourteen-level competitive programme, two levels per class in Classes 3–9, five chapters per level; extensions explicitly await review.
- Sixteen studios point to shared engines and records. Foundation manipulations and Graph Studio add reusable workspaces.
- Graph Studio supports six editable functions, coefficients, Cartesian zoom/pan, linked tables, tangent/normal lines, derivative overlays, signed integration, detected intercepts/intersections and SVG export. Numerical estimates have visible limitations; symbolic calculations use the optional backend.
- Local observations, notebook, saved experiments, understanding/speed tracking and revision recommendations. Mastery cannot be unlocked by repeatedly answering the same question or by speed scores.
- Teacher lesson plans, editable objectives/activities/assessment, classroom demonstration links, printable worksheet and backend assignment/report integration.
- Content draft editor, structural validation, version history and export. Backend publication requires reviewer permissions, records immutable revisions and supports rollback. Frontend teaching bundles are still deployed through reviewed Git commits; publishing API data does not silently rewrite a static bundle.
- Django/DRF service, PostgreSQL configuration, migrations, account isolation, server-side exact answer grading, teacher enrolment/report boundaries, learning notes, immutable reviewed content revisions and constrained AST-to-SymPy parsing.

## Explicit coverage limits

Only the Circle Area representative discovery chapter is marked complete. Other models retain useful core content but do not claim all thirteen sections, three methods or reviewed history. Inventory rows are scope records, not fabricated lessons. The supplied category list is not a verified 2026–27 board mapping; source review remains necessary. Coverage views expose every missing category.

The public frontend is deployed to GitHub Pages. The backend is AWS-compatible code and container configuration, not a provisioned AWS service. No AWS account, region, domain, RDS instance or credentials were supplied. Local tests use SQLite; deployment CI also tests against PostgreSQL 16.

## Architecture and expansion process

`src/discovery/schema.ts` defines content contracts. `curriculum.ts` maps existing concepts and keeps inventory gaps separate. `formulaRecords.ts` contains reviewed Formula Birth content. `DiscoveryJourney.tsx` preserves original engines; `CircleJourney.tsx` is the representative complete chapter. Exact school responses use rational polynomials in π, separately from numerical graph estimates. `backend/learning/symbolic.py` accepts a constrained mathematical AST without Python eval, sympify or parse_expr on input strings.

For each next chapter: add micro-concepts and prerequisites; author story and manipulatives; verify each proof step and its conditions; document historical evidence; supply genuinely distinct valid methods; test application units and boundary values; author assessment misconceptions; validate all thirteen sections; review the record; only then mark coverage reviewed. Avoid using template length or lab counts as a completeness proxy.

## Validation

Frontend checks cover all existing formula lab activities and conditions, situations, per-class challenge counts, geometry, graph estimates, exact responses, coverage contracts, programme cardinality and independent circle-area bounds. Backend checks cover exact symbolic arithmetic and rejected code/oversized expressions, answer grading, idempotent sync, mastery gates, student isolation, teacher report boundaries, review permissions, publication and rollback. Browser QA checks actual interactions and responsive layouts.
