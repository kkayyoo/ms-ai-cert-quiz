import { WrongAnswerEntry } from '../types';

export function exportWrongAnswersToMarkdown(wrongAnswers: WrongAnswerEntry[]): void {
  if (wrongAnswers.length === 0) return;

  const lines: string[] = [
    '# Wrong Answer Review',
    '',
    `_Exported: ${new Date().toLocaleString()}_`,
    '',
  ];

  const byExam: Record<string, WrongAnswerEntry[]> = {};
  wrongAnswers.forEach((wa) => {
    const key = wa.examId;
    if (!byExam[key]) byExam[key] = [];
    byExam[key].push(wa);
  });

  for (const examId of Object.keys(byExam)) {
    lines.push(`## ${examId.toUpperCase()}`, '');
    byExam[examId].forEach((wa, i) => {
      lines.push(
        `### ${i + 1}. ${wa.question.text}`,
        '',
        `**Domain:** ${wa.question.domain}`,
        '',
        '**Options:**',
        ...wa.question.options.map(
          (o) =>
            `- ${wa.question.correctIds.includes(o.id) ? '✅' : wa.userAnswer.includes(o.id) ? '❌' : '  '} ${o.text}`
        ),
        '',
        `**Your answers:** ${wa.userAnswer.join(', ')}`,
        `**Correct answers:** ${wa.question.correctIds.join(', ')}`,
        '',
        `**Explanation:** ${wa.question.explanation}`,
        '',
        '---',
        ''
      );
    });
  }

  const markdown = lines.join('\n');
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wrong-answers-${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
