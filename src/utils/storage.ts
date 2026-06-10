import { Question, ExamSession, WrongAnswer } from '../types';

const KEYS = {
  WRONG_ANSWERS: 'quiz_wrong_answers',
  SESSIONS: 'quiz_sessions',
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Wrong Answers

export function saveWrongAnswer(question: Question): void {
  const all = readJSON<WrongAnswer[]>(KEYS.WRONG_ANSWERS, []);
  const existing = all.findIndex((q) => q.id === question.id);
  if (existing >= 0) {
    all[existing].reviewCount += 1;
  } else {
    all.push({ ...question, addedAt: new Date().toISOString(), reviewCount: 0 });
  }
  writeJSON(KEYS.WRONG_ANSWERS, all);
}

export function getWrongAnswers(exam?: string): WrongAnswer[] {
  const all = readJSON<WrongAnswer[]>(KEYS.WRONG_ANSWERS, []);
  return exam ? all.filter((q) => q.exam === exam) : all;
}

export function removeWrongAnswer(questionId: string): void {
  const all = readJSON<WrongAnswer[]>(KEYS.WRONG_ANSWERS, []);
  writeJSON(KEYS.WRONG_ANSWERS, all.filter((q) => q.id !== questionId));
}

export function exportWrongAnswersToMD(exam?: string): string {
  const answers = getWrongAnswers(exam);
  if (answers.length === 0) return '# Wrong Answer Collection\n\nNo wrong answers recorded.\n';

  const lines = ['# Wrong Answer Collection', ''];
  for (const q of answers) {
    lines.push(`## ${q.exam} - ${q.domain}`);
    lines.push(`### Question ID: ${q.id}`);
    lines.push(`**Question:** ${q.question}`, '');
    lines.push(`**Correct Answer:** ${q.correctAnswers.join(', ')}`, '');
    lines.push(`**Explanation:** ${q.explanation}`, '');
    lines.push(`**中文解析:** ${q.explanationCN}`, '');
    lines.push(`**Official Docs:** [link](${q.officialDocUrl})`, '');
    lines.push(`_Added: ${q.addedAt} | Review count: ${q.reviewCount}_`, '');
    lines.push('---', '');
  }
  return lines.join('\n');
}

// Sessions

export function saveSession(session: ExamSession): void {
  const all = readJSON<ExamSession[]>(KEYS.SESSIONS, []);
  const idx = all.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    all[idx] = session;
  } else {
    all.push(session);
  }
  writeJSON(KEYS.SESSIONS, all);
}

export function getHistory(): ExamSession[] {
  return readJSON<ExamSession[]>(KEYS.SESSIONS, []);
}

export function clearHistory(): void {
  localStorage.removeItem(KEYS.SESSIONS);
}
