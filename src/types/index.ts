export type ExamId = 'AI-900' | 'AI-102';

export interface Question {
  id: string;
  examId: ExamId;
  domain: string;
  text: string;
  type: 'single' | 'multi';
  options: Option[];
  correctAnswers: string[]; // option ids
  explanation: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface ExamConfig {
  name: string;
  passingScore: number;
  totalQuestions: number;
  duration: number; // minutes
  dataPath: string;
  syllabusPath: string;
}

export interface QuizSession {
  examId: ExamId;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string[]>; // questionId -> selected option ids
  startTime: number;
  isMock: boolean;
}

export interface ExamResult {
  examId: ExamId;
  score: number; // 0-1000
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
  wrongAnswers: WrongAnswer[];
  domainBreakdown: DomainBreakdown[];
  duration: number; // seconds
  date: string;
}

export interface WrongAnswer {
  id: string;
  question: Question;
  userAnswers: string[];
  date: string;
}

export interface DomainBreakdown {
  domain: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface SessionHistory {
  id: string;
  result: ExamResult;
}
