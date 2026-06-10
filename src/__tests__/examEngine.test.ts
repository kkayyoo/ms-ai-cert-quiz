import {
  shuffleArray,
  shuffleOptions,
  generateExam,
  calculateScore,
  isPass,
  checkAnswer,
} from '../utils/examEngine';
import { Question, UserAnswer } from '../types';

const makeQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: 'q1',
  examId: 'ai900',
  domain: 'AI Overview',
  difficulty: 'easy',
  type: 'single',
  text: 'What is AI?',
  options: [
    { id: 'A', text: 'Option A' },
    { id: 'B', text: 'Option B' },
    { id: 'C', text: 'Option C' },
  ],
  correctIds: ['A'],
  explanation: 'AI stands for Artificial Intelligence.',
  explanationZh: 'AI 代表人工智能。',
  docsUrl: 'https://docs.microsoft.com',
  ...overrides,
});

describe('examEngine', () => {
  describe('shuffleArray', () => {
    it('returns array of same length', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(shuffleArray(arr)).toHaveLength(5);
    });

    it('contains same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(shuffleArray(arr).sort()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('shuffleOptions', () => {
    it('returns question with same option count', () => {
      const q = makeQuestion();
      const shuffled = shuffleOptions(q);
      expect(shuffled.options).toHaveLength(q.options.length);
    });

    it('does not mutate original question', () => {
      const q = makeQuestion();
      const original = [...q.options];
      shuffleOptions(q);
      expect(q.options).toEqual(original);
    });
  });

  describe('generateExam', () => {
    const questions = [
      makeQuestion({ id: 'q1', examId: 'ai900' }),
      makeQuestion({ id: 'q2', examId: 'ai900' }),
      makeQuestion({ id: 'q3', examId: 'ai102' }),
      makeQuestion({ id: 'q4', examId: 'ai102' }),
    ];

    it('filters by exam', () => {
      const result = generateExam(questions, 'ai900', 10);
      expect(result.every((q) => q.examId === 'ai900')).toBe(true);
    });

    it('respects count limit', () => {
      const result = generateExam(questions, 'ai900', 1);
      expect(result).toHaveLength(1);
    });

    it('returns all questions for mixed exam', () => {
      const result = generateExam(questions, 'mixed', 10);
      expect(result).toHaveLength(4);
    });
  });

  describe('isPass', () => {
    it('passes at 700', () => expect(isPass(700)).toBe(true));
    it('fails at 699', () => expect(isPass(699)).toBe(false));
    it('passes at 1000', () => expect(isPass(1000)).toBe(true));
  });

  describe('checkAnswer', () => {
    it('returns true for correct single answer', () => {
      const q = makeQuestion({ correctIds: ['A'] });
      expect(checkAnswer(q, ['A'])).toBe(true);
    });

    it('returns false for wrong answer', () => {
      const q = makeQuestion({ correctIds: ['A'] });
      expect(checkAnswer(q, ['B'])).toBe(false);
    });

    it('handles multiple correct answers', () => {
      const q = makeQuestion({ type: 'multi', correctIds: ['A', 'B'] });
      expect(checkAnswer(q, ['B', 'A'])).toBe(true);
      expect(checkAnswer(q, ['A'])).toBe(false);
    });
  });

  describe('calculateScore', () => {
    it('calculates 100% score correctly', () => {
      const q = makeQuestion({ id: 'q1' });
      const answers: UserAnswer[] = [
        { questionId: 'q1', selectedAnswers: ['A'], isCorrect: true, timeSpentMs: 1000 },
      ];
      const result = calculateScore(answers, [q]);
      expect(result.score).toBe(1000);
      expect(result.passed).toBe(true);
      expect(result.correctCount).toBe(1);
    });

    it('calculates 0% score correctly', () => {
      const q = makeQuestion({ id: 'q1' });
      const answers: UserAnswer[] = [
        { questionId: 'q1', selectedAnswers: ['B'], isCorrect: false, timeSpentMs: 1000 },
      ];
      const result = calculateScore(answers, [q]);
      expect(result.score).toBe(0);
      expect(result.passed).toBe(false);
    });
  });
});
