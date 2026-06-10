import { Question } from '../types';

// Use vite's import.meta.env when available (browser), fall back for Node/test env
const DATA_BASE_URL: string = '/ms-ai-cert-quiz/';

async function loadExamQuestions(examId: 'ai900' | 'ai102'): Promise<Question[]> {
  const url = `${DATA_BASE_URL}data/${examId}/questions.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to load ${examId} questions: ${response.status}`);
      return [];
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      console.warn(`${examId} questions.json is not an array`);
      return [];
    }
    // Normalize exam field for backward compat
    return data.map((q: Record<string, unknown>) => ({
      ...q,
      examId: q.examId ?? (q.exam === 'AI-900' ? 'ai900' : q.exam === 'AI-102' ? 'ai102' : examId),
      text: q.text ?? q.question ?? '',
      correctIds: q.correctIds ?? q.correctAnswers ?? [],
      explanationZh: q.explanationZh ?? q.explanationCN ?? '',
    })) as Question[];
  } catch (err) {
    console.warn(`Error loading ${examId} questions:`, err);
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

export async function loadQuestionsByExam(examId: 'ai900' | 'ai102'): Promise<Question[]> {
  return loadExamQuestions(examId);
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
