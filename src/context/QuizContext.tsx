import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Question, QuizSession, ExamResult, WrongAnswerEntry, ExamId } from '../types';
import { loadQuestionsByExam } from '../utils/dataLoader';
import { MOCK_QUESTIONS } from '../data/mockData';
import { EXAM_CONFIG } from '../config/examConfig';
import { saveWrongAnswer, saveSession } from '../utils/storage';

interface QuizState {
  questionsByExam: Record<string, Question[]>;
  loadingExam: string | null;
  loadError: string | null;
  session: QuizSession | null;
  lastResult: ExamResult | null;
}

type QuizAction =
  | { type: 'LOAD_START'; examId: string }
  | { type: 'LOAD_SUCCESS'; examId: string; questions: Question[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'START_SESSION'; session: QuizSession }
  | { type: 'SUBMIT_ANSWER'; questionId: string; selectedIds: string[] }
  | { type: 'NEXT_QUESTION' }
  | { type: 'END_SESSION'; result: ExamResult };

const initialState: QuizState = {
  questionsByExam: {},
  loadingExam: null,
  loadError: null,
  session: null,
  lastResult: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loadingExam: action.examId, loadError: null };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loadingExam: null,
        questionsByExam: { ...state.questionsByExam, [action.examId]: action.questions },
      };
    case 'LOAD_ERROR':
      return { ...state, loadingExam: null, loadError: action.error };
    case 'START_SESSION':
      return { ...state, session: action.session, lastResult: null };
    case 'SUBMIT_ANSWER':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          answers: { ...state.session.answers, [action.questionId]: action.selectedIds },
        },
      };
    case 'NEXT_QUESTION':
      return state; // navigation handled by page component
    case 'END_SESSION':
      return { ...state, session: null, lastResult: action.result };
    default:
      return state;
  }
}

interface QuizContextValue {
  state: QuizState;
  loadExamQuestions: (examId: ExamId) => Promise<Question[]>;
  startExam: (examId: ExamId, isMock?: boolean) => Promise<void>;
  submitAnswer: (questionId: string, selectedIds: string[]) => void;
  nextQuestion: () => void;
  endExam: () => ExamResult | null;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const loadExamQuestions = useCallback(async (examId: ExamId): Promise<Question[]> => {
    if (state.questionsByExam[examId]?.length) return state.questionsByExam[examId];
    dispatch({ type: 'LOAD_START', examId });
    try {
      let questions = await loadQuestionsByExam(examId);
      if (!questions.length) {
        questions = MOCK_QUESTIONS[examId] ?? [];
      }
      dispatch({ type: 'LOAD_SUCCESS', examId, questions });
      return questions;
    } catch {
      const fallback = MOCK_QUESTIONS[examId] ?? [];
      dispatch({ type: 'LOAD_SUCCESS', examId, questions: fallback });
      return fallback;
    }
  }, [state.questionsByExam]);

  const startExam = useCallback(async (examId: ExamId, isMock = false) => {
    const questions = await loadExamQuestions(examId);
    const sessionId = `session-${Date.now()}`;
    const session: QuizSession = {
      id: sessionId,
      examId,
      questions,
      answers: {},
      startedAt: Date.now(),
      isMock,
    };
    dispatch({ type: 'START_SESSION', session });
  }, [loadExamQuestions]);

  const submitAnswer = useCallback((questionId: string, selectedIds: string[]) => {
    dispatch({ type: 'SUBMIT_ANSWER', questionId, selectedIds });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const endExam = useCallback((): ExamResult | null => {
    const { session } = state;
    if (!session) return null;

    const { questions, answers, examId, startedAt, id: sessionId } = session;
    const config = EXAM_CONFIG[examId];
    const duration = Math.round((Date.now() - startedAt) / 1000);

    let correctCount = 0;
    const wrongAnswers: WrongAnswerEntry[] = [];
    const domainScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      const selected = answers[q.id] ?? [];
      const isCorrect =
        selected.length === q.correctIds.length &&
        selected.every((id) => q.correctIds.includes(id));

      if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 };
      domainScores[q.domain].total++;

      if (isCorrect) {
        correctCount++;
        domainScores[q.domain].correct++;
      } else {
        const wa: WrongAnswerEntry = {
          id: `${q.id}-${Date.now()}`,
          examId,
          question: q,
          userAnswer: selected,
          savedAt: Date.now(),
        };
        wrongAnswers.push(wa);
        saveWrongAnswer(wa);
      }
    });

    const rawScore = questions.length > 0 ? correctCount / questions.length : 0;
    const score = Math.round(rawScore * 1000);

    const result: ExamResult = {
      sessionId,
      examId,
      score,
      passed: score >= config.passingScore,
      totalQuestions: questions.length,
      correctCount,
      wrongAnswers,
      domainScores,
      completedAt: Date.now(),
      duration,
    };

    saveSession({
      id: sessionId,
      exam: examId === 'ai900' ? 'AI-900' : 'AI-102',
      startedAt: new Date(startedAt).toISOString(),
      completedAt: new Date().toISOString(),
      questions,
      answers: Object.entries(answers).map(([questionId, selectedAnswers]) => ({
        questionId,
        selectedAnswers,
        isCorrect: selectedAnswers.every((id) => {
          const q = questions.find((q) => q.id === questionId);
          return q ? q.correctIds.includes(id) : false;
        }),
        timeSpentMs: 0,
      })),
      score: result.score,
      passed: result.passed,
      totalQuestions: questions.length,
    });
    dispatch({ type: 'END_SESSION', result });
    return result;
  }, [state]);

  return (
    <QuizContext.Provider value={{ state, loadExamQuestions, startExam, submitAnswer, nextQuestion, endExam }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider');
  return ctx;
}
