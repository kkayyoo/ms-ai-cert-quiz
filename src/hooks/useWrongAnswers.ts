import { useState, useCallback, useEffect } from 'react';
import { WrongAnswerEntry } from '../types';
import { getWrongAnswers, deleteWrongAnswer } from '../utils/storage';
import { exportWrongAnswersToMarkdown } from '../utils/exportUtils';

export function useWrongAnswers(examFilter?: string) {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerEntry[]>([]);

  const refresh = useCallback(() => {
    const all = getWrongAnswers();
    setWrongAnswers(examFilter ? all.filter((w) => w.examId === examFilter) : all);
  }, [examFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string) => {
    deleteWrongAnswer(id);
    refresh();
  }, [refresh]);

  const exportMD = useCallback(() => {
    exportWrongAnswersToMarkdown(wrongAnswers);
  }, [wrongAnswers]);

  return { wrongAnswers, remove, exportMD, refresh };
}
