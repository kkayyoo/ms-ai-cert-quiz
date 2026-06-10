import { Question } from '../types';
import { validateQuestion } from './validation';

const DATA_BASE_URL = import.meta.env.BASE_URL + 'data/';

async function loadExamQuestions(exam: 'AI-900' | 'AI-102'): Promise<Question[]> {
  const url = `${DATA_BASE_URL}${exam.toLowerCase()}/questions.json`;
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
    loadExamQuestions('AI-900'),
    loadExamQuestions('AI-102'),
  ]);
  return [...ai900, ...ai102];
}

export async function loadQuestionsByExam(exam: 'AI-900' | 'AI-102'): Promise<Question[]> {
  return loadExamQuestions(exam);
}

export function getQuestionsByDomain(questions: Question[], domain: string): Question[] {
  return questions.filter((q) => q.domain === domain);
}

export function getUniqueExams(questions: Question[]): string[] {
  return [...new Set(questions.map((q) => q.exam))];
}

export function getUniqueDomains(questions: Question[]): string[] {
  return [...new Set(questions.map((q) => q.domain))];
}
