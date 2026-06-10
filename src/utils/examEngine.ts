import { Question, UserAnswer, ExamResult, DomainResult } from '../types';

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
  let pool = exam === 'mixed' ? questions : questions.filter((q) => q.exam === exam);
  if (domain) {
    pool = pool.filter((q) => q.domain === domain);
  }
  const shuffled = shuffleQuestions(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(shuffleOptions);
}

export function calculateScore(answers: UserAnswer[], questions: Question[]): ExamResult {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const domainMap = new Map<string, { correct: number; total: number }>();

  let correctCount = 0;
  for (const answer of answers) {
    const q = qMap.get(answer.questionId);
    if (!q) continue;

    if (!domainMap.has(q.domain)) {
      domainMap.set(q.domain, { correct: 0, total: 0 });
    }
    const d = domainMap.get(q.domain)!;
    d.total += 1;
    if (answer.isCorrect) {
      correctCount += 1;
      d.correct += 1;
    }
  }

  const total = answers.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const score = Math.round((correctCount / Math.max(total, 1)) * 1000);

  const byDomain: DomainResult[] = [];
  domainMap.forEach((val, domain) => {
    byDomain.push({
      domain,
      correct: val.correct,
      total: val.total,
      percentage: Math.round((val.correct / val.total) * 100),
    });
  });

  return { score, percentage, passed: isPass(score), correctCount, totalCount: total, byDomain };
}

export function isPass(score: number): boolean {
  return score >= 700;
}

export function checkAnswer(question: Question, selectedAnswers: string[]): boolean {
  const correct = [...question.correctAnswers].sort();
  const selected = [...selectedAnswers].sort();
  return JSON.stringify(correct) === JSON.stringify(selected);
}
