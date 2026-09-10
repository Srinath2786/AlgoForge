# AlgoForge Frontend — Premium UI Upgrade

This build is a frontend-only upgrade. Existing API contracts and backend integration were preserved.

## Included
- Premium dashboard hierarchy
- Daily coding goal with completion state derived from today's existing heatmap submission count
- GitHub-inspired week-based contribution heatmap
- Streak calculation from existing dashboard activity
- Difficulty progress visualization
- Improved submission activity list
- Improved language activity visualization
- Responsive dashboard layout
- Refined desktop sidebar and mobile shell
- Shared skeleton and error-state components
- Accessibility-focused keyboard states and reduced-motion support

## Backend compatibility
No backend files, endpoints, database models, or API contracts were changed.

## Validation
TypeScript project build (`tsc -b`) passes in the provided environment.
The Vite bundle step could not run in this environment because the uploaded `node_modules` archive is missing Rollup's Linux optional native package. Run `npm install` locally before `npm run build` if needed.

## Local setup
```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
```
