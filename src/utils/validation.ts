import { Question } from '../types';

export function validateQuestion(q: unknown): q is Question {
  if (typeof q !== 'object' || q === null) return false;
  const obj = q as Record<string, unknown>;

  const requiredStrings = ['id', 'examId', 'domain', 'type', 'text', 'explanation'];
  for (const field of requiredStrings) {
    if (typeof obj[field] !== 'string' || (obj[field] as string).trim() === '') {
      return false;
    }
  }

  if (!['ai900', 'ai102'].includes(obj.examId as string)) return false;
  if (!['single', 'multi'].includes(obj.type as string)) return false;

  if (!Array.isArray(obj.options) || obj.options.length < 2) return false;
  for (const opt of obj.options as unknown[]) {
    if (typeof opt !== 'object' || opt === null) return false;
    const o = opt as Record<string, unknown>;
    if (typeof o.id !== 'string' || typeof o.text !== 'string') return false;
  }

  if (!Array.isArray(obj.correctIds) || obj.correctIds.length === 0) return false;

  return true;
}
