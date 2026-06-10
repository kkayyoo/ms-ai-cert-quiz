import { useNavigate } from 'react-router-dom'
import styles from './ResultsPage.module.css'

interface QuizResult {
  score: number
  correctCount: number
  total: number
  examId: string
}

export default function ResultsPage() {
  const navigate = useNavigate()
  let result: QuizResult | null = null
  try {
    const raw = sessionStorage.getItem('quizResult')
    if (raw) result = JSON.parse(raw) as QuizResult
  } catch { /* empty */ }

  if (!result) {
    return (
      <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p>No results found.</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
          Back to Home
        </button>
      </div>
    )
  }

  const { score, correctCount, total, examId } = result
  const pct = Math.round((correctCount / total) * 100)
  const pass = score >= 700

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.scoreBig}>{score}<span className={styles.scoreMax}>/1000</span></div>
          <div className={`${styles.badge} ${pass ? styles.pass : styles.fail}`}>
            {pass ? '✅ PASS' : '❌ FAIL'}
          </div>
          <p className={styles.detail}>{correctCount} / {total} correct ({pct}%)</p>

          {/* Ring chart */}
          <div className={styles.ring}>
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-border)" strokeWidth="12" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={pass ? 'var(--color-success)' : 'var(--color-error)'}
                strokeWidth="12"
                strokeDasharray={`${pct * 3.14} 314`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--color-text)">{pct}%</text>
            </svg>
          </div>

          <div className={styles.actions}>
            <button className="btn-secondary" onClick={() => navigate('/wrong-answers')}>
              📖 Review Wrong Answers
            </button>
            <button className="btn-secondary" onClick={() => navigate(`/quiz/${examId}`)}>
              🔄 Try Again
            </button>
            <button className="btn-primary" onClick={() => navigate('/')}>
              🏠 Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
