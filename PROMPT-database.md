You are in Ralph BUILDING loop for the ms-ai-cert-quiz project.

## YOUR ROLE: Database & Data Processing Layer
Responsible for designing and implementing the data layer, loading/parsing question banks, and persistence utilities.

## Working Directory
/home/azureuser/ms-ai-cert-quiz

## CRITICAL RULES
1. Keep it simple - no backend server, no database server needed (static + localStorage)
2. Data is served as static JSON files from the data/ directory
3. All persistence is client-side via localStorage
4. Commit and push after EVERY completed task

## Tech Stack
- TypeScript
- No external database (JSON files as data source)
- localStorage for user progress, wrong answers, session data
- JSON schema validation at build time

## Task List (7 rounds, commit+push each round)

Round 1: 
- Initialize npm project with package.json
- Install dependencies: react@18, react-dom@18, typescript, vite, @types/react, @types/react-dom, @vitejs/plugin-react
- Create tsconfig.json, vite.config.ts
- Create src/types/index.ts with full TypeScript interfaces for Question, ExamSession, WrongAnswer, UserProgress

Round 2:
- Create src/utils/dataLoader.ts - loads and merges question banks from data/ JSON files
- Create src/utils/validation.ts - validates question schema at load time
- Handle missing data gracefully (show loading state if questions not ready)

Round 3:
- Create src/utils/storage.ts - localStorage wrapper for:
  - saveWrongAnswer(question: Question): void
  - getWrongAnswers(exam?: string): Question[]
  - removeWrongAnswer(questionId: string): void
  - exportWrongAnswersToMD(): string (returns Markdown string for download)
  - saveSession(session: ExamSession): void
  - getHistory(): ExamSession[]
  - clearHistory(): void

Round 4:
- Create src/utils/examEngine.ts - core quiz logic:
  - generateExam(exam: string, count: number, domain?: string): Question[]
  - shuffleQuestions(questions: Question[]): Question[]
  - shuffleOptions(question: Question): Question
  - calculateScore(answers: UserAnswer[], questions: Question[]): ExamResult
  - isPass(score: number): boolean (threshold: 700/1000)

Round 5:
- Create src/utils/exportUtils.ts - export wrong answers as Markdown:
  ```
  # Wrong Answer Collection
  ## AI-900 / AI-102
  ### Question ID: xxx
  **Question:** ...
  **Your Answer:** ...
  **Correct Answer:** ...
  **Explanation:** ...
  **中文解析:** ...
  **Official Docs:** [link]
  ```
- Wire up download functionality

Round 6:
- Create src/hooks/useQuiz.ts - React hook encapsulating quiz state machine
- Create src/hooks/useWrongAnswers.ts - wrong answer collection hook
- Create src/hooks/useProgress.ts - progress tracking hook
- Write basic Jest unit tests for examEngine and storage utils

Round 7:
- Create placeholder data files if data agents haven't completed yet:
  - data/ai-900/questions.json (empty array [])
  - data/ai-102/questions.json (empty array [])
- Add data/schema.md with full schema documentation
- Final integration test - ensure dataLoader works with both real and empty data
- Update IMPLEMENTATION_PLAN.md

## TypeScript Interfaces (create in src/types/index.ts)
```typescript
export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  exam: 'AI-900' | 'AI-102';
  domain: string;
  domainWeight: number;
  type: 'single' | 'multiple';
  question: string;
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: string;
  explanationCN: string;
  officialDocUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface UserAnswer {
  questionId: string;
  selectedAnswers: string[];
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface ExamSession {
  id: string;
  exam: 'AI-900' | 'AI-102' | 'mixed';
  startedAt: string;
  completedAt: string;
  questions: Question[];
  answers: UserAnswer[];
  score: number;
  passed: boolean;
  totalQuestions: number;
}

export interface WrongAnswer extends Question {
  addedAt: string;
  reviewCount: number;
}

export interface ExamResult {
  score: number;          // 0-1000 scale
  percentage: number;     // 0-100
  passed: boolean;
  correctCount: number;
  totalCount: number;
  byDomain: DomainResult[];
}

export interface DomainResult {
  domain: string;
  correct: number;
  total: number;
  percentage: number;
}
```

## Completion Signal
After all 7 rounds are done, append to IMPLEMENTATION_PLAN.md:
```
## Database/Data Layer Agent
STATUS: COMPLETE
Last commit: <hash>
```

Then output: STATUS: COMPLETE
