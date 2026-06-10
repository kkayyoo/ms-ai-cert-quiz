You are in Ralph BUILDING loop for the ms-ai-cert-quiz project.

## YOUR ROLE: QA Engineer & DevOps
Responsible for unit tests, GitHub Pages deployment, and fixing any build/deployment issues.

## Working Directory
/home/azureuser/ms-ai-cert-quiz

## CRITICAL RULES
1. Run actual tests - don't just write tests, run them and fix failures
2. Fix build errors as they appear
3. Ensure GitHub Pages deployment works
4. Commit and push after EVERY fix/test addition
5. Document all bugs found and fixed in IMPLEMENTATION_PLAN.md

## GitHub Pages Deployment Config
- Repo: https://github.com/kkayyoo/ms-ai-cert-quiz
- Token: Set via git remote URL (already configured)
- Branch: main (deploy from /dist folder via gh-pages action OR from root)
- URL: https://kkayyoo.github.io/ms-ai-cert-quiz

## Task List (7 rounds, commit+push each round)

Round 1:
- Check if npm project is initialized (look for package.json)
- If not: run `npm init -y` and install all deps
- Run `npx tsc --noEmit` and fix any TypeScript errors found
- Create tests/ directory and jest.config.ts
- Write first test: tests/examEngine.test.ts
  - Test score calculation
  - Test pass/fail threshold (700/1000)
  - Test question shuffle doesn't lose questions

Round 2:
- Run `npm run build` or `npx vite build`
- Fix any build errors
- Write tests/storage.test.ts:
  - Test localStorage save/load
  - Test export to Markdown format
  - Test wrong answer add/remove/list

Round 3:
- Create .github/workflows/deploy.yml for GitHub Actions:
  ```yaml
  name: Deploy to GitHub Pages
  on:
    push:
      branches: [main]
  permissions:
    contents: write
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '20'
        - run: npm ci
        - run: npm run build
        - uses: peaceiris/actions-gh-pages@v3
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: ./dist
  ```
- Push to trigger deployment
- Verify GitHub Actions tab shows the workflow

Round 4:
- Write tests/dataLoader.test.ts:
  - Test loading questions from valid JSON
  - Test handling empty/missing JSON
  - Test question count
- Run all tests: `npm test`
- Fix any failures

Round 5:
- Validate question data files (when they exist):
  ```bash
  node -e "
  const fs = require('fs');
  const files = ['data/ai-900/questions.json', 'data/ai-102/questions.json'];
  files.forEach(f => {
    if (!fs.existsSync(f)) { console.log('MISSING:', f); return; }
    const q = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if (!Array.isArray(q)) { console.log('INVALID: not array'); return; }
    let errors = 0;
    q.forEach((item, i) => {
      if (!item.id) { console.log('Missing id at index', i); errors++; }
      if (!item.question) { console.log('Missing question at', item.id); errors++; }
      if (!item.correctAnswers || !item.correctAnswers.length) { console.log('Missing answers at', item.id); errors++; }
      if (!item.officialDocUrl) { console.log('Missing docUrl at', item.id); errors++; }
    });
    console.log(f + ': ' + q.length + ' questions, ' + errors + ' errors');
  });
  "
  ```
- Report validation results, fix any schema issues in data files

Round 6:
- Run full TypeScript check: `npx tsc --noEmit`
- Run full test suite: `npm test -- --coverage`
- Fix all errors and warnings
- Check that the built dist/ folder has correct asset paths for GitHub Pages

Round 7:
- Final end-to-end deployment test:
  1. `npm run build` - must succeed
  2. Check dist/index.html exists
  3. Push to main - triggers GitHub Actions deploy
  4. Verify deployment URL is accessible (or at least the workflow triggers)
- Create DEPLOYMENT.md documenting:
  - How to run locally
  - How deployment works
  - How to add more questions
- Update IMPLEMENTATION_PLAN.md with final status

## Test Scripts to add to package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx"
  }
}
```

## Completion Signal
After all 7 rounds are done, append to IMPLEMENTATION_PLAN.md:
```
## QA/DevOps Agent
STATUS: COMPLETE
Last commit: <hash>
Build: PASSING
Tests: X passing, Y failing
Deployment: GitHub Pages configured
```

Then output: STATUS: COMPLETE
