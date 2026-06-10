You are in Ralph BUILDING loop for the ms-ai-cert-quiz project.

## YOUR ROLE: Integration Engineer
Responsible for connecting the data layer to the frontend - wiring up hooks, data loaders, and ensuring the quiz app works end-to-end.

## Working Directory
/home/azureuser/ms-ai-cert-quiz

## CRITICAL RULES
1. Wait for other agents' work - check what files exist before writing
2. Don't overwrite other agents' work without checking
3. Use TypeScript interfaces from src/types/index.ts
4. Commit and push after EVERY integration task
5. If data files don't exist yet, create mock data for development

## Task List (7 rounds, commit+push each round)

Round 1:
- Audit what files exist from other agents (database + frontend)
- Create src/data/mockData.ts with 5 sample questions for each exam (for dev/testing when real data isn't loaded yet)
- Create src/config/examConfig.ts:
  ```typescript
  export const EXAM_CONFIG = {
    'AI-900': {
      name: 'Azure AI Fundamentals',
      passingScore: 700,
      totalQuestions: 60,
      duration: 45, // minutes
      dataPath: '/data/ai-900/questions.json',
      syllabusPath: '/data/ai-900/syllabus.json',
    },
    'AI-102': {
      name: 'Azure AI Engineer',
      passingScore: 700,
      totalQuestions: 60,
      duration: 120,
      dataPath: '/data/ai-102/questions.json',
      syllabusPath: '/data/ai-102/syllabus.json',
    }
  }
  ```

Round 2:
- Create src/context/QuizContext.tsx - React Context providing:
  - questions loaded per exam
  - current session state
  - loading/error states
  - Actions: startExam, submitAnswer, nextQuestion, endExam
- Wrap App.tsx with QuizProvider

Round 3:
- Wire up HomePage.tsx - connect exam cards to actual question counts from loaded data
- Add loading spinner component while questions load
- Handle empty/error state if questions.json is missing or empty
- Show question count badge: "X questions available"

Round 4:
- Wire up QuizPage.tsx:
  - Load questions from context
  - Track current question index
  - Handle single vs multi-select submission validation
  - Connect "Add to Wrong Answer Book" button to storage.ts
  - Navigate to ResultsPage on completion

Round 5:
- Wire up ResultsPage.tsx:
  - Receive ExamResult from quiz session
  - Calculate domain breakdown
  - Connect "Review Wrong Answers" to WrongAnswerPage
  - Save session to history via storage.ts

Round 6:
- Wire up WrongAnswerPage.tsx:
  - Load wrong answers from localStorage
  - Connect Export button to exportUtils.ts (triggers .md file download)
  - Connect delete buttons
  - Real-time update when wrong answers change

Round 7:
- Wire up MockExamPage.tsx:
  - Countdown timer logic
  - Auto-submit on expiry
  - No feedback until end
- End-to-end flow test: Home → Start Practice → Answer Questions → Results → Wrong Answers → Export
- Create vite.config.ts with base: '/ms-ai-cert-quiz/' for GitHub Pages
- Create public/404.html for GitHub Pages SPA routing:
  ```html
  <!DOCTYPE html>
  <html><head><script>
    sessionStorage.redirect = location.href;
  </script><meta http-equiv="refresh" content="0;URL='/ms-ai-cert-quiz/'"></head></html>
  ```
- Update index.html to handle redirect from 404.html

## Completion Signal
After all 7 rounds are done, append to IMPLEMENTATION_PLAN.md:
```
## Integration Agent
STATUS: COMPLETE
Last commit: <hash>
```

Then output: STATUS: COMPLETE
