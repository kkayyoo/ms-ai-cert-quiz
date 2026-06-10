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
  const [saved, setSaved] = useState(false)

  const correct = question.correctIds.every(id => userAnswer.includes(id)) &&
    userAnswer.every(id => question.correctIds.includes(id))

  function handleSaveWrong() {
    if (onSaveWrong) {
      onSaveWrong()
      setSaved(true)
    }
  }

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

      {(question.docsUrl || question.officialDocUrl) && (
        <a
          href={question.docsUrl ?? question.officialDocUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.docsLink}
        >
          📖 Official Documentation ↗
        </a>
      )}

      <div className={styles.actions}>
        {onSaveWrong && !correct && (
          <button
            className={saved ? styles.savedBtn : 'btn-secondary'}
            onClick={handleSaveWrong}
            disabled={saved}
            style={saved ? {
              backgroundColor: '#107C10',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'default',
              fontWeight: 600,
            } : {}}
          >
            {saved ? '✅ Saved to Wrong Answer Book' : '🔖 Save to Wrong Answer Book'}
          </button>
        )}
        <button className="btn-primary" onClick={onNext}>
          {isLast ? 'See Results' : 'Next Question →'}
        </button>
      </div>
    </div>
  )
}
