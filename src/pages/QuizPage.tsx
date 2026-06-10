import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { ExamId } from '../types'
import { getQuestions, saveWrongAnswer } from '../utils/quizData'
import QuestionCard from '../components/Quiz/QuestionCard'
import FeedbackPanel from '../components/Quiz/FeedbackPanel'
import styles from './QuizPage.module.css'

export default function QuizPage() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const questions = getQuestions((examId ?? 'ai900') as ExamId)

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<{ correct: boolean; userAnswer: string[] }[]>([])

  const question = questions[currentIdx]
  if (!question) {
    return (
      <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p>No questions available for this exam.</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
          Back to Home
        </button>
      </div>
    )
  }

  const progress = ((currentIdx) / questions.length) * 100

  function handleSubmit() {
    if (selected.length === 0) return
    setSubmitted(true)
    const correct = question.correctIds.every(id => selected.includes(id)) &&
      selected.every(id => question.correctIds.includes(id))
    setResults(prev => [...prev, { correct, userAnswer: selected }])
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      const correctCount = results.filter(r => r.correct).length + (submitted ? (results.length > 0 ? 0 : 0) : 0)
      // Pass results via sessionStorage
      const finalResults = [...results]
      const score = Math.round((finalResults.filter(r => r.correct).length / questions.length) * 1000)
      sessionStorage.setItem('quizResult', JSON.stringify({ score, correctCount: finalResults.filter(r => r.correct).length, total: questions.length, examId }))
      navigate(`/results/session-${Date.now()}`)
      return
    }
    setCurrentIdx(i => i + 1)
    setSelected([])
    setSubmitted(false)
  }

  function handleSaveWrong() {
    saveWrongAnswer({
      id: `wrong-${question.id}-${Date.now()}`,
      examId: question.examId,
      question,
      userAnswer: selected,
      savedAt: Date.now(),
    })
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.meta}>
          <span className={styles.questionCount}>Question {currentIdx + 1} of {questions.length}</span>
          <span className={styles.domain}>{question.domain}</span>
          <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
            {question.difficulty}
          </span>
        </div>

        <QuestionCard
          question={question}
          selected={selected}
          submitted={submitted}
          onChange={setSelected}
        />

        {!submitted && (
          <div className={styles.submitRow}>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={selected.length === 0}
            >
              Submit Answer
            </button>
          </div>
        )}

        {submitted && (
          <FeedbackPanel
            question={question}
            userAnswer={selected}
            onNext={handleNext}
            onSaveWrong={handleSaveWrong}
            isLast={currentIdx + 1 >= questions.length}
          />
        )}
      </div>
    </div>
  )
}
