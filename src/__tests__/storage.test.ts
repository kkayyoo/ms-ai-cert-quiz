import {
  saveWrongAnswer,
  getWrongAnswers,
  removeWrongAnswer,
  saveSession,
  getHistory,
  clearHistory,
} from '../utils/storage';
import { WrongAnswerEntry, SessionHistory, Question } from '../types';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

const makeQuestion = (): Question => ({
  id: 'q1',
  examId: 'ai900',
  domain: 'AI Overview',
  difficulty: 'easy',
  type: 'single',
  text: 'Test?',
  options: [{ id: 'A', text: 'A' }],
  correctIds: ['A'],
  explanation: 'Explanation',
  explanationZh: '解释',
  docsUrl: 'https://docs.microsoft.com',
});

const makeWrongAnswer = (): WrongAnswerEntry => ({
  id: 'q1',
  examId: 'ai900',
  question: makeQuestion(),
  userAnswer: ['B'],
  savedAt: Date.now(),
});

describe('storage', () => {
  beforeEach(() => mockLocalStorage.clear());

  describe('wrong answers', () => {
    it('saves and retrieves a wrong answer', () => {
      saveWrongAnswer(makeWrongAnswer());
      const answers = getWrongAnswers();
      expect(answers).toHaveLength(1);
      expect(answers[0].id).toBe('q1');
    });

    it('replaces on duplicate save', () => {
      saveWrongAnswer(makeWrongAnswer());
      saveWrongAnswer(makeWrongAnswer());
      const answers = getWrongAnswers();
      expect(answers).toHaveLength(1);
    });

    it('removes a wrong answer', () => {
      saveWrongAnswer(makeWrongAnswer());
      removeWrongAnswer('q1');
      expect(getWrongAnswers()).toHaveLength(0);
    });
  });

  describe('sessions', () => {
    const session: SessionHistory = {
      id: 's1',
      result: {
        sessionId: 's1',
        examId: 'ai900',
        totalQuestions: 1,
        correctCount: 1,
        score: 750,
        passed: true,
        domainScores: {},
        wrongAnswers: [],
        completedAt: Date.now(),
        duration: 1000,
      },
    };

    it('saves and retrieves sessions', () => {
      saveSession(session);
      const history = getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe('s1');
    });

    it('clears history', () => {
      saveSession(session);
      clearHistory();
      expect(getHistory()).toHaveLength(0);
    });
  });
});
