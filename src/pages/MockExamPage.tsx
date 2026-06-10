import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { ExamId, Question } from '../types'
import { getQuestions } from '../utils/quizData'
import { useQuiz } from '../context/QuizContext'
import QuestionCard from '../components/Quiz/QuestionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import styles from './MockExamPage.module.css'

const EXAM_CONFIG: Record<ExamId, { duration: number; label: string }> = {
  ai900: { duration: 45 * 60, label: 'AI-900' },
  ai102: { duration: 120 * 60, label: 'AI-102' },
}

export default function MockExamPage() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const { loadExamQuestions } = useQuiz()
  const id = (examId ?? 'ai900') as ExamId
  const config = EXAM_CONFIG[id]

  const [questions, setQuestions] = useState<Question[]>(() => getQuestions(id))
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.duration)
  const [submitted, setSubmitted] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load real questions
  useEffect(() => {
    setLoading(true)
    loadExamQuestions(id).then((loaded) => {
      if (loaded.length > 0) setQuestions(loaded)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!started || submitted) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          handleFinish()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [started, submitted])

  function handleFinish() {
    if (timerRef.current) clearInterval(timerRef.current)
    setSubmitted(true)
    let correct = 0
    questions.forEach((q: Question, i: number) => {
      const ans = answers[i] ?? []
      if (q.correctIds.every(cid => ans.includes(cid)) && ans.every(sid => q.correctIds.includes(sid))) correct++
    })
    const score = Math.round((correct / questions.length) * 1000)
    sessionStorage.setItem('quizResult', JSON.stringify({ score, correctCount: correct, total: questions.length, examId: id }))
    navigate(`/results/mock-${Date.now()}`)
  }

  function handleExitConfirm() {
    // Mock exam: exit → go home, no progress saved (fresh start next time)
    if (timerRef.current) clearInterval(timerRef.current)
    navigate('/')
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (loading) {
    return <LoadingSpinner text={`Loading ${config.label} questions...`} />
  }

  if (!started) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.startCard}>
            <h1 className={styles.startTitle}>{config.label} Mock Exam</h1>
            <ul className={styles.startInfo}>
              <li>📝 {questions.length} questions</li>
              <li>⏱ {config.duration / 60} minutes</li>
              <li>🎯 Pass score: 700/1000</li>
              <li>💡 No feedback shown during the exam</li>
              <li>⚠️ Exiting mid-exam will discard your progress</li>
            </ul>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={() => navigate('/')}>
                ← Back to Home
              </button>
              <button className="btn-primary" onClick={() => setStarted(true)} style={{ fontSize: 16, padding: '12px 32px' }}>
                Start Mock Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentIdx]
  const progress = ((currentIdx + 1) / questions.length) * 100
  const isWarning = timeLeft < 300

  return (
    <div className={styles.page}>
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: '8px', padding: '32px',
            maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ marginBottom: '12px', color: '#323130' }}>Exit Mock Exam?</h3>
            <p style={{ color: '#D13438', fontWeight: 600, marginBottom: '8px' }}>⚠️ Your progress will NOT be saved.</p>
            <p style={{ color: '#605E5C', marginBottom: '24px', lineHeight: 1.5 }}>
              Next time you start a mock exam, it will begin from Question 1 with a fresh timer and score.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowExitConfirm(false)}>
                Continue Exam
              </button>
              <button
                className="btn-primary"
                style={{ background: '#D13438' }}
                onClick={handleExitConfirm}
              >
                Exit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className={styles.topBar}>
          <span className={styles.examLabel}>{config.label} Mock Exam</span>
          <span className={`${styles.timer} ${isWarning ? styles.timerWarning : ''}`}>
            ⏱ {formatTime(timeLeft)}
          </span>
          <button
            onClick={() => setShowExitConfirm(true)}
            style={{
              marginLeft: 'auto', background: 'none', border: '1px solid #ccc',
              borderRadius: '4px', padding: '4px 12px', cursor: 'pointer',
              color: '#605E5C', fontSize: '13px',
            }}
          >
            ✕ Exit
          </button>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.questionCount}>Question {currentIdx + 1} of {questions.length}</p>

        <QuestionCard
          question={question}
          selected={answers[currentIdx] ?? []}
          submitted={false}
          onChange={sel => setAnswers(prev => ({ ...prev, [currentIdx]: sel }))}
        />

        <div className={styles.navRow}>
          <button
            className="btn-secondary"
            onClick={() => setCurrentIdx(i => i - 1)}
            disabled={currentIdx === 0}
          >
            ← Previous
          </button>
          {currentIdx < questions.length - 1 ? (
            <button className="btn-primary" onClick={() => setCurrentIdx(i => i + 1)}>
              Next →
            </button>
          ) : (
            <button className="btn-primary" onClick={handleFinish}>
              Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
