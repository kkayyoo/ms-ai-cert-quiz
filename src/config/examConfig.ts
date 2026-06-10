import { ExamId } from '../types';

export interface ExamConfig {
  name: string;
  passingScore: number;
  totalQuestions: number;
  duration: number; // minutes
  dataPath: string;
  syllabusPath: string;
}

export const EXAM_CONFIG: Record<ExamId, ExamConfig> = {
  'ai900': {
    name: 'Azure AI Fundamentals',
    passingScore: 700,
    totalQuestions: 60,
    duration: 45,
    dataPath: '/data/ai-900/questions.json',
    syllabusPath: '/data/ai-900/syllabus.json',
  },
  'ai102': {
    name: 'Azure AI Engineer',
    passingScore: 700,
    totalQuestions: 60,
    duration: 120,
    dataPath: '/data/ai-102/questions.json',
    syllabusPath: '/data/ai-102/syllabus.json',
  },
};

export const BASE_URL = '/ms-ai-cert-quiz';

export const STORAGE_KEYS = {
  WRONG_ANSWERS: 'ms_quiz_wrong_answers',
  SESSION_HISTORY: 'ms_quiz_session_history',
};
