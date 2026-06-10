import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { ExamId, Question } from '../types'
import { getQuestions } from '../utils/quizData'
import QuestionCard from '../components/Quiz/QuestionCard'
import styles from './MockExamPage.module.css'

const EXAM_CONFIG: Record<ExamId, { duration: number; label: string }> = {
  ai900: { duration: 45 * 60, label: 'AI-900' },
  ai102: { duration: 120 * 60, label: 'AI-102' },
}

export default function MockExamPage() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const id = (examId ?? 'ai900') as ExamId
  const config = EXAM_CONFIG[id]
  const questions = getQuestions(id)

  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.duration)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
    setSubmitted(true)
    let correct = 0
    questions.forEach((q: Question, i: number) => {
      const ans = answers[i] ?? []
      if (q.correctIds.every(id => ans.includes(id)) && ans.every(id => q.correctIds.includes(id))) correct++
    })
    const score = Math.round((correct / questions.length) * 1000)
    sessionStorage.setItem('quizResult', JSON.stringify({ score, correctCount: correct, total: questions.length, examId: id }))
    navigate(`/results/mock-${Date.now()}`)
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
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
            </ul>
            <button className="btn-primary" onClick={() => setStarted(true)} style={{ fontSize: 16, padding: '12px 32px' }}>
              Start Mock Exam
            </button>
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
      <div className="container">
        <div className={styles.topBar}>
          <span className={styles.examLabel}>{config.label} Mock Exam</span>
          <span className={`${styles.timer} ${isWarning ? styles.timerWarning : ''}`}>
            ⏱ {formatTime(timeLeft)}
          </span>
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
