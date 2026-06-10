import { useState, useCallback, useEffect } from 'react';
import { WrongAnswer } from '../types';
import { getWrongAnswers, removeWrongAnswer } from '../utils/storage';
import { exportWrongAnswersAsMarkdown, downloadMarkdown } from '../utils/exportUtils';

export function useWrongAnswers(exam?: string) {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  const refresh = useCallback(() => {
    setWrongAnswers(getWrongAnswers(exam));
  }, [exam]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = useCallback((questionId: string) => {
    removeWrongAnswer(questionId);
    refresh();
  }, [refresh]);

  const exportMD = useCallback(() => {
    const md = exportWrongAnswersAsMarkdown(wrongAnswers, exam);
    const filename = exam ? `wrong-answers-${exam}.md` : 'wrong-answers.md';
    downloadMarkdown(md, filename);
  }, [wrongAnswers, exam]);

  return { wrongAnswers, remove, exportMD, refresh };
}
