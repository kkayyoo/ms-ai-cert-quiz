import { Question, UserAnswer, ExamResult } from '../types';

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shuffleQuestions(questions: Question[]): Question[] {
  return shuffleArray(questions);
}

export function shuffleOptions(question: Question): Question {
  return { ...question, options: shuffleArray(question.options) };
}

export function generateExam(
  questions: Question[],
  exam: string,
  count: number,
  domain?: string
): Question[] {
  let pool = exam === 'mixed' ? questions : questions.filter((q) => q.examId === exam);
  if (domain) {
    pool = pool.filter((q) => q.domain === domain);
  }
  const shuffled = shuffleQuestions(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(shuffleOptions);
}

export function calculateScore(
  answers: UserAnswer[],
  questions: Question[],
  sessionId = '',
  examId: Question['examId'] = 'ai900',
  duration = 0
): ExamResult {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const domainScores: Record<string, { correct: number; total: number }> = {};

  let correctCount = 0;
  for (const answer of answers) {
    const q = qMap.get(answer.questionId);
    if (!q) continue;
    if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 };
    domainScores[q.domain].total += 1;
    if (answer.isCorrect) {
      correctCount += 1;
      domainScores[q.domain].correct += 1;
    }
  }

  const total = answers.length;
  const score = Math.round((correctCount / Math.max(total, 1)) * 1000);

  return {
    sessionId,
    examId,
    totalQuestions: total,
    correctCount,
    score,
    passed: isPass(score),
    domainScores,
    wrongAnswers: [],
    completedAt: Date.now(),
    duration,
  };
}

export function isPass(score: number): boolean {
  return score >= 700;
}

export function checkAnswer(question: Question, selectedAnswers: string[]): boolean {
  const correct = [...question.correctIds].sort();
  const selected = [...selectedAnswers].sort();
  return JSON.stringify(correct) === JSON.stringify(selected);
}
