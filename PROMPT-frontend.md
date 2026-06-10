You are in Ralph BUILDING loop for the ms-ai-cert-quiz project.

## YOUR ROLE: Frontend Developer
Responsible for building the React 18 + TypeScript quiz UI.
Reference design: Microsoft Practice Assessment at https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/practice/assessment

## Working Directory
/home/azureuser/ms-ai-cert-quiz

## CRITICAL RULES
1. TypeScript strict mode - no `any` types
2. React 18 with functional components and hooks only
3. Mobile-responsive design
4. Commit and push after EVERY completed component/page
5. The UI language is primarily English; Chinese appears only in explanation panels

## Design Reference
Look at the Microsoft Practice Assessment (see image in project root if available):
- Clean, professional interface
- Question at top, options as clickable cards
- Submit button → immediate feedback
- Green highlight for correct, red for wrong
- Explanation panel slides in after answer
- Progress bar at top
- Domain/category label on each question

## Color Palette (Microsoft-inspired)
- Primary: #0078D4 (Microsoft Blue)
- Success: #107C10 (Green)
- Error: #D13438 (Red)  
- Warning: #FF8C00 (Orange)
- Background: #F3F2F1
- Card: #FFFFFF
- Text: #323130

## Task List (7 rounds, commit+push each round)

Round 1:
- Create index.html in project root
- Create src/App.tsx with router setup (use hash routing for GitHub Pages compatibility)
- Create src/main.tsx entry point
- Create src/styles/global.css with CSS variables and base styles
- Create src/components/Layout/Header.tsx - top nav with exam selector and logo
- Create src/components/Layout/Footer.tsx

Round 2:
- Create src/pages/HomePage.tsx:
  - Hero section with exam cards (AI-900 and AI-102)
  - Each card shows: exam name, description, question count, pass score (700/1000)
  - "Start Practice" and "Mock Exam" buttons
  - Quick stats if any session history exists

Round 3:
- Create src/components/Quiz/QuestionCard.tsx:
  - Displays question text
  - Single-select: radio-button style option cards
  - Multi-select: checkbox style option cards
  - Shows "Select X answers" hint for multi-select
  - Disabled state after submission
  - Correct/incorrect highlighting after submission
  - Smooth CSS transition animations

Round 4:
- Create src/components/Quiz/FeedbackPanel.tsx:
  - Shows after answer submission
  - Displays: ✅ Correct! or ❌ Incorrect
  - Correct answer(s) highlighted
  - English explanation
  - Chinese explanation (collapsible, labeled "中文解析")
  - Link to official docs
  - "Add to Wrong Answer Book" button (bookmark icon)
  - "Next Question" button

Round 5:
- Create src/pages/QuizPage.tsx:
  - Progress bar (Question X of Y)
  - Domain badge
  - Difficulty badge (easy/medium/hard)
  - QuestionCard component
  - Submit button
  - FeedbackPanel (appears after submit)
  - Domain filter sidebar (optional, collapsible on mobile)

Round 6:
- Create src/pages/ResultsPage.tsx:
  - Score display (e.g., "750/1000" in big text)
  - Pass/Fail badge (green PASS or red FAIL)
  - Percentage ring chart (CSS-only, no chart library)
  - Performance by domain table
  - "Review Wrong Answers" button
  - "Try Again" button
  - "Return Home" button

- Create src/pages/WrongAnswerPage.tsx:
  - List of saved wrong answers
  - Filter by exam
  - Each item shows question preview, exam badge
  - Expand to see full question + correct answer + explanation
  - Delete button per item
  - "Export to Markdown" button (triggers download)
  - Empty state illustration

Round 7:
- Create src/pages/MockExamPage.tsx:
  - Timed exam simulation
  - AI-900: 45 min, 60 questions
  - AI-102: 120 min, 60 questions
  - Countdown timer (top right)
  - Auto-submit on time expiry
  - No feedback during exam (only after submit)
  - Final score with pass/fail

- Wire all pages together in App.tsx with proper routing
- Ensure all components compile with `npx tsc --noEmit`

## Component File Structure
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── Quiz/
│       ├── QuestionCard.tsx
│       └── FeedbackPanel.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── QuizPage.tsx
│   ├── MockExamPage.tsx
│   ├── ResultsPage.tsx
│   └── WrongAnswerPage.tsx
└── styles/
    └── global.css
```

## Completion Signal
After all 7 rounds are done, append to IMPLEMENTATION_PLAN.md:
```
## Frontend Agent
STATUS: COMPLETE
Last commit: <hash>
```

Then output: STATUS: COMPLETE
