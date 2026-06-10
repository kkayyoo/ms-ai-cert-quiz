import { Question } from '../types';

const REQUIRED_STRING_FIELDS: (keyof Question)[] = [
  'id', 'exam', 'domain', 'type', 'question', 'explanation', 'explanationCN', 'officialDocUrl', 'difficulty',
];

export function validateQuestion(q: unknown): q is Question {
  if (typeof q !== 'object' || q === null) return false;
  const obj = q as Record<string, unknown>;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof obj[field] !== 'string' || (obj[field] as string).trim() === '') {
      return false;
    }
  }

  if (!['AI-900', 'AI-102'].includes(obj.exam as string)) return false;
  if (!['single', 'multiple'].includes(obj.type as string)) return false;
  if (!['easy', 'medium', 'hard'].includes(obj.difficulty as string)) return false;

  if (typeof obj.domainWeight !== 'number') return false;

  if (!Array.isArray(obj.options) || obj.options.length < 2) return false;
  for (const opt of obj.options as unknown[]) {
    if (typeof opt !== 'object' || opt === null) return false;
    const o = opt as Record<string, unknown>;
    if (typeof o.id !== 'string' || typeof o.text !== 'string') return false;
  }

  if (!Array.isArray(obj.correctAnswers) || obj.correctAnswers.length === 0) return false;
  if (!Array.isArray(obj.tags)) return false;

  return true;
}
