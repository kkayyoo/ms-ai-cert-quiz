# AGENTS.md — ms-ai-cert-quiz

## Project Goal
Build a comprehensive Microsoft AI-900 and AI-102 certification practice quiz platform.
Deployed on GitHub Pages at: https://kkayyoo.github.io/ms-ai-cert-quiz

## Architecture
```
ms-ai-cert-quiz/
├── data/
│   ├── ai-900/          # AI-900 question bank JSON files
│   │   ├── questions.json
│   │   └── syllabus.json
│   ├── ai-102/          # AI-102 question bank JSON files
│   │   ├── questions.json
│   │   └── syllabus.json
│   └── schema.md        # Data schema documentation
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── public/
├── tests/               # Unit tests
├── docs/                # Knowledge base markdown files
└── dist/                # Build output (GitHub Pages)
```

## Question JSON Schema
```json
{
  "id": "ai900-001",
  "exam": "AI-900",
  "domain": "Describe Artificial Intelligence workloads and considerations",
  "domainWeight": 0.15,
  "type": "single" | "multiple",
  "question": "Question text in English",
  "options": [
    { "id": "A", "text": "Option text" },
    { "id": "B", "text": "Option text" },
    { "id": "C", "text": "Option text" },
    { "id": "D", "text": "Option text" }
  ],
  "correctAnswers": ["A"],
  "explanation": "English explanation with official doc reference",
  "explanationCN": "中文解析，结合知识点",
  "officialDocUrl": "https://learn.microsoft.com/...",
  "difficulty": "easy" | "medium" | "hard",
  "tags": ["AI fundamentals", "responsible AI"]
}
```

## Git Workflow
- Branch: main
- Commit after EVERY completed task
- Commit message format: "feat/fix/data/test: description"
- Push to origin after every commit
- Remote: https://github.com/kkayyoo/ms-ai-cert-quiz.git

## Test Commands (Backpressure)
```bash
# Type check
cd ~/ms-ai-cert-quiz && npx tsc --noEmit 2>&1 | head -20

# Validate question JSON
cd ~/ms-ai-cert-quiz && node -e "
const fs = require('fs');
['data/ai-900/questions.json','data/ai-102/questions.json'].forEach(f => {
  if(fs.existsSync(f)) {
    const q = JSON.parse(fs.readFileSync(f));
    console.log(f + ': ' + q.length + ' questions OK');
  }
});
"

# Run tests
cd ~/ms-ai-cert-quiz && npm test -- --passWithNoTests 2>&1 | tail -10

# Build check
cd ~/ms-ai-cert-quiz && npm run build 2>&1 | tail -10
```

## Pass Score Thresholds
- AI-900: 700/1000 (70%)
- AI-102: 700/1000 (70%)

## Sub-Agent Responsibilities
1. **data-ai102**: Scrape & validate AI-102 question bank
2. **data-ai900**: Scrape & validate AI-900 question bank
3. **database**: Data schema, processing & persistence layer
4. **frontend**: React 18 + TypeScript UI
5. **integration**: API/data connection between frontend and data layer
6. **testing**: Unit tests, deployment fixes, QA
