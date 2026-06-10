import { Question } from '../types';
import { validateQuestion } from './validation';

const DATA_BASE_URL = import.meta.env.BASE_URL + 'data/';

// Map our ExamId format to file path format
const EXAM_PATH_MAP: Record<string, string> = {
  'ai900': 'ai-900',
  'ai102': 'ai-102',
  'AI-900': 'ai-900',
  'AI-102': 'ai-102',
};

async function loadExamQuestions(exam: string): Promise<Question[]> {
  const pathKey = EXAM_PATH_MAP[exam] ?? exam.toLowerCase();
  const url = `${DATA_BASE_URL}${pathKey}/questions.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to load ${exam} questions: ${response.status}`);
      return [];
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      console.warn(`${exam} questions.json is not an array`);
      return [];
    }
    return data.filter((q) => {
      const valid = validateQuestion(q);
      if (!valid) {
        console.warn('Invalid question skipped:', q);
      }
      return valid;
    }) as Question[];
  } catch (err) {
    console.warn(`Error loading ${exam} questions:`, err);
    return [];
  }
}

export async function loadAllQuestions(): Promise<Question[]> {
  const [ai900, ai102] = await Promise.all([
    loadExamQuestions('ai900'),
    loadExamQuestions('ai102'),
  ]);
  return [...ai900, ...ai102];
}

export async function loadQuestionsByExam(exam: string): Promise<Question[]> {
  return loadExamQuestions(exam);
}

export function getQuestionsByDomain(questions: Question[], domain: string): Question[] {
  return questions.filter((q) => q.domain === domain);
}

export function getUniqueExams(questions: Question[]): string[] {
  return [...new Set(questions.map((q) => q.examId))];
}

export function getUniqueDomains(questions: Question[]): string[] {
  return [...new Set(questions.map((q) => q.domain))];
}
