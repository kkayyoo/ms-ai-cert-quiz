import { useState, useCallback, useEffect } from 'react';
import { ExamSession, UserProgress } from '../types';
import { getHistory } from '../utils/storage';

export function useProgress(): UserProgress & { refresh: () => void } {
  const [history, setHistory] = useState<ExamSession[]>([]);

  const refresh = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totalExams = history.length;
  const totalQuestions = history.reduce((sum, s) => sum + s.totalQuestions, 0);
  const correctAnswers = history.reduce(
    (sum, s) => sum + s.answers.filter((a) => a.isCorrect).length,
    0
  );
  const lastStudied =
    history.length > 0
      ? history.reduce((latest, s) => (s.completedAt > latest ? s.completedAt : latest), '')
      : '';

  return {
    totalExams,
    totalQuestions,
    correctAnswers,
    wrongAnswerCount: totalQuestions - correctAnswers,
    lastStudied,
    examHistory: history,
    refresh,
  };
}
