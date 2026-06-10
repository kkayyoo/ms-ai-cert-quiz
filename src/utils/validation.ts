import { Question } from '../types';

export function validateQuestion(q: unknown): q is Question {
  if (typeof q !== 'object' || q === null) return false;
  const obj = q as Record<string, unknown>;

  if (typeof obj.id !== 'string' || !obj.id) return false;
  if (!['ai900', 'ai102'].includes(obj.examId as string) &&
      !['AI-900', 'AI-102'].includes(obj.exam as string)) return false;
  if (typeof obj.domain !== 'string' || !obj.domain) return false;
  if (!['easy', 'medium', 'hard'].includes(obj.difficulty as string)) return false;
  if (!['single', 'multi', 'multiple'].includes(obj.type as string)) return false;

  const text = obj.text ?? obj.question;
  if (typeof text !== 'string' || !text) return false;

  if (!Array.isArray(obj.options) || obj.options.length < 2) return false;
  for (const opt of obj.options as unknown[]) {
    if (typeof opt !== 'object' || opt === null) return false;
    const o = opt as Record<string, unknown>;
    if (typeof o.id !== 'string' || typeof o.text !== 'string') return false;
  }

  const correctIds = obj.correctIds ?? obj.correctAnswers;
  if (!Array.isArray(correctIds) || correctIds.length === 0) return false;

  return true;
}
