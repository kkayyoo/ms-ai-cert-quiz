// ── Core enums ────────────────────────────────────────────────────────────────
export type ExamId = 'ai900' | 'ai102'
export type Difficulty = 'easy' | 'medium' | 'hard'

// ── Option / Question ─────────────────────────────────────────────────────────
export interface Option {
  id: string
  text: string
}

/** Canonical Question shape (frontend). */
export interface Question {
  id: string
  examId: ExamId
  /** Alias used by some legacy utils (dataLoader uses 'AI-900' | 'AI-102'). */
  exam?: string
  domain: string
  domainWeight?: number
  difficulty: Difficulty
  /** 'single' | 'multi' used by UI; 'multiple' used by legacy engine. */
  type: 'single' | 'multi' | 'multiple'
  /** Question text (frontend field). */
  text: string
  /** Legacy alias for question text. */
  question?: string
  options: Option[]
  /** Correct option IDs (frontend). */
  correctIds: string[]
  /** Legacy alias. */
  correctAnswers?: string[]
  explanation: string
  explanationZh?: string
  /** Legacy alias. */
  explanationCN?: string
  docsUrl?: string
  /** Legacy alias. */
  officialDocUrl?: string
  tags?: string[]
}

// ── User Answer / Session ─────────────────────────────────────────────────────
export interface UserAnswer {
  questionId: string
  selectedAnswers: string[]
  isCorrect: boolean
  timeSpentMs: number
}

export interface QuizSession {
  id: string
  examId: ExamId
  questions: Question[]
  answers: Record<string, string[]>
  startedAt: number
  completedAt?: number
  isMock?: boolean
}

/** Legacy session shape used by useQuiz / storage. */
export interface ExamSession {
  id: string
  exam: 'AI-900' | 'AI-102'
  startedAt: string
  completedAt: string
  questions: Question[]
  answers: UserAnswer[]
  score: number
  passed: boolean
  totalQuestions: number
}

export type SessionHistory = ExamSession

// ── Results ───────────────────────────────────────────────────────────────────
export interface DomainResult {
  domain: string
  correct: number
  total: number
  percentage: number
}

export interface ExamResult {
  score: number
  percentage?: number
  passed: boolean
  correctCount: number
  totalCount?: number
  totalQuestions?: number
  byDomain?: DomainResult[]
  domainScores?: Record<string, { correct: number; total: number }>
  sessionId?: string
  examId?: ExamId
  completedAt?: number
  wrongAnswers?: WrongAnswerEntry[]
  duration?: number
}

// ── Wrong answers ─────────────────────────────────────────────────────────────
export interface WrongAnswerEntry {
  id: string
  examId: ExamId
  question: Question
  userAnswer: string[]
  savedAt: number
}

/** Legacy alias. */
export type WrongAnswer = WrongAnswerEntry

// ── Progress ──────────────────────────────────────────────────────────────────
export interface UserProgress {
  totalExams: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswerCount: number
  lastStudied: string
  examHistory: ExamSession[]
}
