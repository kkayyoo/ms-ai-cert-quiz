import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Question, QuizSession, ExamResult, WrongAnswer, ExamId } from '../types';
import { loadQuestionsByExam } from '../utils/dataLoader';
import { MOCK_QUESTIONS } from '../data/mockData';
import { EXAM_CONFIG } from '../config/examConfig';
import { saveWrongAnswer, saveSession } from '../utils/storage';

interface QuizState {
  questionsByExam: Record<string, Question[]>;
  loadingExam: string | null;
  loadError: string | null;
  session: QuizSession | null;
}

type QuizAction =
  | { type: 'LOAD_START'; examId: string }
  | { type: 'LOAD_SUCCESS'; examId: string; questions: Question[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'START_SESSION'; session: QuizSession }
  | { type: 'SUBMIT_ANSWER'; questionId: string; selectedIds: string[] }
  | { type: 'NEXT_QUESTION' }
  | { type: 'END_SESSION' };

const initialState: QuizState = {
  questionsByExam: {},
  loadingExam: null,
  loadError: null,
  session: null,
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
      return { ...state, session: action.session };
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
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, currentIndex: state.session.currentIndex + 1 },
      };
    case 'END_SESSION':
      return { ...state, session: null };
    default:
      return state;
  }
}

interface QuizContextValue {
  state: QuizState;
  loadExamQuestions: (examId: ExamId) => Promise<void>;
  startExam: (examId: ExamId, isMock?: boolean) => Promise<void>;
  submitAnswer: (questionId: string, selectedIds: string[]) => void;
  nextQuestion: () => void;
  endExam: () => ExamResult | null;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const loadExamQuestions = useCallback(async (examId: ExamId) => {
    if (state.questionsByExam[examId]) return; // already loaded
    dispatch({ type: 'LOAD_START', examId });
    try {
      let questions = await loadQuestionsByExam(examId);
      if (!questions.length) {
        // fallback to mock data
        questions = MOCK_QUESTIONS[examId] ?? [];
      }
      dispatch({ type: 'LOAD_SUCCESS', examId, questions });
    } catch (err) {
      const fallback = MOCK_QUESTIONS[examId] ?? [];
      dispatch({ type: 'LOAD_SUCCESS', examId, questions: fallback });
    }
  }, [state.questionsByExam]);

  const startExam = useCallback(async (examId: ExamId, isMock = false) => {
    await loadExamQuestions(examId);
    // Questions may now be in state after loadExamQuestions, but we need the updated ref
    // Re-read from local variable approach
    let questions: Question[] = [];
    try {
      questions = await loadQuestionsByExam(examId);
      if (!questions.length) questions = MOCK_QUESTIONS[examId] ?? [];
    } catch {
      questions = MOCK_QUESTIONS[examId] ?? [];
    }

    const session: QuizSession = {
      examId,
      questions,
      currentIndex: 0,
      answers: {},
      startTime: Date.now(),
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

    const { questions, answers, examId, startTime } = session;
    const config = EXAM_CONFIG[examId];
    const duration = Math.round((Date.now() - startTime) / 1000);

    let correctCount = 0;
    const wrongAnswers: WrongAnswer[] = [];
    const domainMap: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      const selected = answers[q.id] ?? [];
      const isCorrect =
        selected.length === q.correctAnswers.length &&
        selected.every((id) => q.correctAnswers.includes(id));

      if (!domainMap[q.domain]) domainMap[q.domain] = { correct: 0, total: 0 };
      domainMap[q.domain].total++;

      if (isCorrect) {
        correctCount++;
        domainMap[q.domain].correct++;
      } else {
        const wa: WrongAnswer = {
          id: `${q.id}-${Date.now()}`,
          question: q,
          userAnswers: selected,
          date: new Date().toISOString(),
        };
        wrongAnswers.push(wa);
        saveWrongAnswer(wa);
      }
    });

    const rawScore = questions.length > 0 ? correctCount / questions.length : 0;
    const score = Math.round(rawScore * 1000);

    const domainBreakdown = Object.entries(domainMap).map(([domain, stats]) => ({
      domain,
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }));

    const result: ExamResult = {
      examId,
      score,
      passed: score >= config.passingScore,
      totalQuestions: questions.length,
      correctCount,
      wrongAnswers,
      domainBreakdown,
      duration,
      date: new Date().toISOString(),
    };

    const sessionId = `session-${Date.now()}`;
    saveSession({ id: sessionId, result });
    dispatch({ type: 'END_SESSION' });
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
