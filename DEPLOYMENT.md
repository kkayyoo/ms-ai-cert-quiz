# Deployment Guide

## Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173/ms-ai-cert-quiz/

# Run tests
npm test

# Type check
npx tsc --noEmit

# Production build
npm run build
# → output in dist/

# Preview production build locally
npm run preview
```

## GitHub Pages Deployment

The site is deployed automatically via GitHub Actions on every push to `main`.

**Live URL:** https://kkayyoo.github.io/ms-ai-cert-quiz

### How it works

1. Push to `main` triggers `.github/workflows/deploy.yml`
2. GitHub Actions:
   - Installs Node 20 dependencies (`npm ci`)
   - Runs test suite (`npm test`) — fails fast if tests break
   - Builds for production (`npm run build` → `tsc && vite build`)
   - Deploys `./dist` to the `gh-pages` branch via `peaceiris/actions-gh-pages@v3`
3. GitHub Pages serves from the `gh-pages` branch
4. Vite is configured with `base: '/ms-ai-cert-quiz/'` so all asset paths are correct

### First-time GitHub Pages setup

In the repo **Settings → Pages**, set:
- Source: **Deploy from a branch**
- Branch: `gh-pages` / `/ (root)`

The `GITHUB_TOKEN` in Actions has `contents: write` permission, which is sufficient for the deploy step.

## Adding More Questions

Questions live in `data/<exam>/questions.json`. Each question must have:

```json
{
  "id": "unique-string-id",
  "question": "Question text",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correctAnswers": ["A"],
  "explanation": "Why this is correct",
  "officialDocUrl": "https://learn.microsoft.com/..."
}
```

See `data/schema.md` for the full schema.

After adding questions, run:

```bash
npm test        # verify nothing broke
npm run build   # verify build succeeds
git add -A && git commit -m "data: add questions for <exam>"
git push        # triggers auto-deploy
```
