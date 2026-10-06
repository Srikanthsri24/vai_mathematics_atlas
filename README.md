# VisionicX Mathematics Atlas

An interactive mathematics laboratory built with React, TypeScript, Vite and Three.js.

## Explore

- 419 labs: 33 original labs, 39 formula workshops and 347 focused formula experiments.
- 347 formulas with search, difficulty filters, graphs, tables and spatial models.
- 1,775 real-world situation tasks, including five task types for each formula.
- 1,200 challenges: 100 for each Class 1–12, with class/topic filters.
- Playground with 27 tools, 16 projects, 16 missions, six construction actions, function plotting and project/SVG export.
- Interactive 3D home screen and a learning analytics dashboard.

Class placement is conceptual guidance. Focused experiments use numeric graph/table/spatial representations. Challenge completion and playground projects are stored locally in the visitor's browser.

## Local development

Use Node.js 24 and pnpm 10.11.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
```

## Build and deployment

GitHub Pages uses **GitHub Actions** as its source in Settings → Pages. The workflow in `.github/workflows/deploy.yml` runs on pushes to `main` and can also be started manually from the Actions tab. It installs locked dependencies, runs the 16 automated checks, builds the app, uploads `dist`, and deploys it to the `github-pages` environment.

The Vite base path is `/vai_mathematics_atlas/` for this repository's GitHub Pages URL. All app navigation uses hash routes, so directly opening a lab does not require server routing rules.

No deployment token needs to be stored in repository secrets: deployment uses GitHub's workflow token and OIDC permissions.
