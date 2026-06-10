import { WrongAnswerEntry } from '../types';

export function exportWrongAnswersAsMarkdown(wrongAnswers: WrongAnswerEntry[], exam?: string): string {
  const items = exam ? wrongAnswers.filter((w) => w.examId === exam) : wrongAnswers
  if (items.length === 0) return '# Wrong Answer Review\n\nNo wrong answers recorded.\n'

  const lines: string[] = [
    '# Wrong Answer Review',
    '',
    `_Exported: ${new Date().toLocaleString()}_`,
    '',
  ]

  items.forEach((wa, i) => {
    const q = wa.question
    lines.push(
      `## ${i + 1}. ${q.text ?? q.question ?? ''}`,
      '',
      `**Domain:** ${q.domain}`,
      '',
      '**Options:**',
      ...q.options.map(
        (o) =>
          `- ${q.correctIds.includes(o.id) ? '✅' : wa.userAnswer.includes(o.id) ? '❌' : '  '} ${o.text}`
      ),
      '',
      `**Correct answers:** ${q.correctIds.join(', ')}`,
      '',
      `**Explanation:** ${q.explanation}`,
      '',
      '---',
      ''
    )
  })

  return lines.join('\n')
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Legacy export that writes directly to file. */
export function exportWrongAnswersToMarkdown(wrongAnswers: WrongAnswerEntry[]): void {
  const md = exportWrongAnswersAsMarkdown(wrongAnswers)
  downloadMarkdown(md, `wrong-answers-${new Date().toISOString().split('T')[0]}.md`)
}
