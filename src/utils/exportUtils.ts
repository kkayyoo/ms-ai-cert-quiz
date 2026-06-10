import { WrongAnswer } from '../types';

export function exportWrongAnswersAsMarkdown(answers: WrongAnswer[], exam?: string): string {
  const filtered = exam ? answers.filter((q) => q.exam === exam) : answers;

  if (filtered.length === 0) {
    return '# Wrong Answer Collection\n\nNo wrong answers recorded.\n';
  }

  const grouped = new Map<string, WrongAnswer[]>();
  for (const q of filtered) {
    const key = q.exam;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(q);
  }

  const lines = ['# Wrong Answer Collection', ''];
  grouped.forEach((qs, examName) => {
    lines.push(`## ${examName}`, '');
    for (const q of qs) {
      lines.push(`### Question ID: ${q.id}`);
      lines.push(`**Question:** ${q.question}`, '');
      const optText = q.options.map((o) => `- **${o.id}**: ${o.text}`).join('\n');
      lines.push('**Options:**');
      lines.push(optText, '');
      lines.push(`**Your Answer:** _(see review count: ${q.reviewCount})_`, '');
      lines.push(`**Correct Answer:** ${q.correctAnswers.join(', ')}`, '');
      lines.push(`**Explanation:** ${q.explanation}`, '');
      lines.push(`**中文解析:** ${q.explanationCN}`, '');
      lines.push(`**Official Docs:** [link](${q.officialDocUrl})`, '');
      lines.push(`_Added: ${q.addedAt} | Domain: ${q.domain} | Difficulty: ${q.difficulty}_`, '');
      lines.push('---', '');
    }
  });

  return lines.join('\n');
}

export function downloadMarkdown(content: string, filename = 'wrong-answers.md'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
