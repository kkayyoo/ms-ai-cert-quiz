import { WrongAnswerEntry, SessionHistory } from '../types';
import { STORAGE_KEYS } from '../config/examConfig';

// Wrong Answers
export function getWrongAnswers(): WrongAnswerEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWrongAnswer(wa: WrongAnswerEntry): void {
  const existing = getWrongAnswers();
  const filtered = existing.filter((w) => w.id !== wa.id);
  filtered.unshift(wa);
  localStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(filtered));
}

export function deleteWrongAnswer(id: string): void {
  const existing = getWrongAnswers().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(existing));
}

export function clearWrongAnswers(): void {
  localStorage.removeItem(STORAGE_KEYS.WRONG_ANSWERS);
}

// Session History
export function getSessionHistory(): SessionHistory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: SessionHistory): void {
  const existing = getSessionHistory();
  existing.unshift(session);
  localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(existing.slice(0, 50)));
}

export function getSession(id: string): SessionHistory | undefined {
  return getSessionHistory().find((s) => s.id === id);
}

// Aliases for compatibility
export function getWrongAnswersFiltered(examId?: string): WrongAnswerEntry[] {
  const all = getWrongAnswers();
  return examId ? all.filter((w) => w.examId === examId) : all;
}

export function removeWrongAnswer(id: string): void {
  deleteWrongAnswer(id);
}

export function getHistory(): SessionHistory[] {
  return getSessionHistory();
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION_HISTORY);
}

export function exportWrongAnswersToMD(examId?: string): string {
  const answers = getWrongAnswersFiltered(examId);
  if (answers.length === 0) return '# Wrong Answer Collection\n\nNo wrong answers recorded.\n';
  const lines = ['# Wrong Answer Collection', ''];
  for (const wa of answers) {
    const q = wa.question;
    lines.push(`## ${wa.examId.toUpperCase()}`);
    lines.push(`### Question ID: ${q.id}`);
    lines.push(`**Question:** ${q.text}`, '');
    lines.push(`**Correct Answer:** ${q.correctIds.join(', ')}`, '');
    lines.push(`**Your Answer:** ${wa.userAnswer.join(', ')}`, '');
    lines.push(`**Explanation:** ${q.explanation}`, '');
    lines.push(`**中文解析:** ${q.explanationZh}`, '');
    if (q.docsUrl) lines.push(`**Official Docs:** [link](${q.docsUrl})`, '');
    lines.push(`_Saved: ${new Date(wa.savedAt).toISOString()}_`, '');
    lines.push('---', '');
  }
  return lines.join('\n');
}

// ── Practice Progress (resume from last position) ────────────────────────────
const PRACTICE_PROGRESS_KEY = 'ms_quiz_practice_progress';

export interface PracticeProgress {
  examId: string;
  currentIdx: number;
  results: { correct: boolean; userAnswer: string[]; questionId: string }[];
  savedAt: number;
}

export function savePracticeProgress(progress: PracticeProgress): void {
  const all = getPracticeProgressAll();
  all[progress.examId] = progress;
  localStorage.setItem(PRACTICE_PROGRESS_KEY, JSON.stringify(all));
}

export function getPracticeProgress(examId: string): PracticeProgress | null {
  const all = getPracticeProgressAll();
  return all[examId] ?? null;
}

export function clearPracticeProgress(examId: string): void {
  const all = getPracticeProgressAll();
  delete all[examId];
  localStorage.setItem(PRACTICE_PROGRESS_KEY, JSON.stringify(all));
}

function getPracticeProgressAll(): Record<string, PracticeProgress> {
  try {
    const raw = localStorage.getItem(PRACTICE_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
