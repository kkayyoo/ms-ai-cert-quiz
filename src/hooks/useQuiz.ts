import { useState, useCallback, useRef } from 'react';
import { Question, UserAnswer, ExamSession, ExamResult } from '../types';
import { checkAnswer, calculateScore, isPass } from '../utils/examEngine';
import { saveSession, saveWrongAnswer } from '../utils/storage';

type QuizState = 'idle' | 'active' | 'completed';

interface UseQuizReturn {
  state: QuizState;
  questions: Question[];
  currentIndex: number;
  answers: UserAnswer[];
  result: ExamResult | null;
  startQuiz: (questions: Question[], exam: ExamSession['exam']) => void;
  submitAnswer: (questionId: string, selectedAnswers: string[]) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  currentQuestion: Question | null;
}

export function useQuiz(): UseQuizReturn {
  const [state, setState] = useState<QuizState>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [result, setResult] = useState<ExamResult | null>(null);
  const examRef = useRef<ExamSession['exam']>('AI-900');
  const startTimeRef = useRef<number>(0);
  const questionStartRef = useRef<number>(0);

  const startQuiz = useCallback((qs: Question[], exam: ExamSession['exam']) => {
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
    examRef.current = exam;
    startTimeRef.current = Date.now();
    questionStartRef.current = Date.now();
    setState('active');
  }, []);

  const submitAnswer = useCallback((questionId: string, selectedAnswers: string[]) => {
    const q = questions.find((q) => q.id === questionId);
    if (!q) return;
    const timeSpentMs = Date.now() - questionStartRef.current;
    const isCorrect = checkAnswer(q, selectedAnswers);
    const answer: UserAnswer = { questionId, selectedAnswers, isCorrect, timeSpentMs };
    if (!isCorrect) saveWrongAnswer(q);
    setAnswers((prev) => [...prev, answer]);
  }, [questions]);

  const nextQuestion = useCallback(() => {
    questionStartRef.current = Date.now();
    setCurrentIndex((i) => i + 1);
  }, []);

  const finishQuiz = useCallback(() => {
    const allAnswers = answers;
    const examResult = calculateScore(allAnswers, questions);
    setResult(examResult);
    const session: ExamSession = {
      id: `session_${Date.now()}`,
      exam: examRef.current,
      startedAt: new Date(startTimeRef.current).toISOString(),
      completedAt: new Date().toISOString(),
      questions,
      answers: allAnswers,
      score: examResult.score,
      passed: isPass(examResult.score),
      totalQuestions: questions.length,
    };
    saveSession(session);
    setState('completed');
  }, [answers, questions]);

  return {
    state,
    questions,
    currentIndex,
    answers,
    result,
    startQuiz,
    submitAnswer,
    nextQuestion,
    finishQuiz,
    currentQuestion: questions[currentIndex] ?? null,
  };
}
