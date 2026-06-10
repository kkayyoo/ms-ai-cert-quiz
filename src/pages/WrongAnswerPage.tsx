import { useState } from 'react'
import { getWrongAnswers, removeWrongAnswer } from '../utils/quizData'
import type { WrongAnswerEntry, ExamId } from '../types'
import styles from './WrongAnswerPage.module.css'

export default function WrongAnswerPage() {
  const [entries, setEntries] = useState<WrongAnswerEntry[]>(() => getWrongAnswers())
  const [filter, setFilter] = useState<ExamId | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = filter === 'all' ? entries : entries.filter(e => e.examId === filter)

  function handleDelete(id: string) {
    removeWrongAnswer(id)
    setEntries(getWrongAnswers())
  }

  function handleExport() {
    const md = filtered.map(e => {
      const correct = e.question.options.filter(o => e.question.correctIds.includes(o.id)).map(o => o.text).join(', ')
      return `## ${e.question.text}\n\n**Correct:** ${correct}\n\n**Explanation:** ${e.question.explanation}\n\n---\n`
    }).join('\n')
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wrong-answers.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Wrong Answer Book</h1>
          <div className={styles.controls}>
            <select
              className={styles.filter}
              value={filter}
              onChange={e => setFilter(e.target.value as ExamId | 'all')}
            >
              <option value="all">All Exams</option>
              <option value="ai900">AI-900</option>
              <option value="ai102">AI-102</option>
            </select>
            {filtered.length > 0 && (
              <button className="btn-secondary" onClick={handleExport}>
                📥 Export to Markdown
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📚</div>
            <p>No wrong answers saved yet.</p>
            <p className={styles.emptyHint}>When you answer a question incorrectly, save it here for review.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map(entry => (
              <div key={entry.id} className={styles.item}>
                <div className={styles.itemHeader} onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
                  <span className={styles.examBadge}>{entry.examId.toUpperCase()}</span>
                  <span className={styles.questionPreview}>{entry.question.text}</span>
                  <span className={styles.expand}>{expanded === entry.id ? '▲' : '▼'}</span>
                </div>
                {expanded === entry.id && (
                  <div className={styles.itemBody}>
                    <p className={styles.label}>Correct Answer:</p>
                    <ul className={styles.correctList}>
                      {entry.question.options
                        .filter(o => entry.question.correctIds.includes(o.id))
                        .map(o => <li key={o.id}>{o.text}</li>)}
                    </ul>
                    <p className={styles.label}>Explanation:</p>
                    <p className={styles.explText}>{entry.question.explanation}</p>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(entry.id)}>
                      🗑 Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
