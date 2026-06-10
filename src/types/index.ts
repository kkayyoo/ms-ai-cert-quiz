export type ExamId = 'ai900' | 'ai102'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Option {
  id: string
  text: string
}

export interface Question {
  id: string
  examId: ExamId
  domain: string
  difficulty: Difficulty
  type: 'single' | 'multi'
  text: string
  options: Option[]
  correctIds: string[]
  explanation: string
  explanationZh: string
  docsUrl?: string
}

export interface QuizSession {
  id: string
  examId: ExamId
  questions: Question[]
  answers: Record<string, string[]>
  startedAt: number
  completedAt?: number
}

export interface WrongAnswerEntry {
  id: string
  examId: ExamId
  question: Question
  userAnswer: string[]
  savedAt: number
}

export interface ExamResult {
  sessionId: string
  examId: ExamId
  totalQuestions: number
  correctCount: number
  score: number
  domainScores: Record<string, { correct: number; total: number }>
  completedAt: number
}
