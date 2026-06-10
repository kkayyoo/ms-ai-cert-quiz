import { useState } from 'react'
import type { Question } from '../../types'
import styles from './FeedbackPanel.module.css'

interface Props {
  question: Question
  userAnswer: string[]
  onNext: () => void
  onSaveWrong?: () => void
  isLast?: boolean
}

export default function FeedbackPanel({ question, userAnswer, onNext, onSaveWrong, isLast }: Props) {
  const [zhOpen, setZhOpen] = useState(false)
  const correct = question.correctIds.every(id => userAnswer.includes(id)) &&
    userAnswer.every(id => question.correctIds.includes(id))

  return (
    <div className={`${styles.panel} ${correct ? styles.panelCorrect : styles.panelWrong}`}>
      <div className={styles.verdict}>
        {correct ? (
          <span className={styles.verdictCorrect}>✅ Correct!</span>
        ) : (
          <span className={styles.verdictWrong}>❌ Incorrect</span>
        )}
      </div>

      <div className={styles.explanation}>
        <p>{question.explanation}</p>
      </div>

      {question.explanationZh && (
        <div className={styles.zhSection}>
          <button
            className={styles.zhToggle}
            onClick={() => setZhOpen(o => !o)}
          >
            中文解析 {zhOpen ? '▲' : '▼'}
          </button>
          {zhOpen && <p className={styles.zhText}>{question.explanationZh}</p>}
        </div>
      )}

      {question.docsUrl && (
        <a
          href={question.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.docsLink}
        >
          📖 Official Documentation ↗
        </a>
      )}

      <div className={styles.actions}>
        {onSaveWrong && !correct && (
          <button className="btn-secondary" onClick={onSaveWrong}>
            🔖 Save to Wrong Answer Book
          </button>
        )}
        <button className="btn-primary" onClick={onNext}>
          {isLast ? 'See Results' : 'Next Question →'}
        </button>
      </div>
    </div>
  )
}
