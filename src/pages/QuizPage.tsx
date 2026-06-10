import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { ExamId, Question } from '../types'
import { getQuestions, saveWrongAnswer } from '../utils/quizData'
import { useQuiz } from '../context/QuizContext'
import QuestionCard from '../components/Quiz/QuestionCard'
import FeedbackPanel from '../components/Quiz/FeedbackPanel'
import LoadingSpinner from '../components/LoadingSpinner'
import styles from './QuizPage.module.css'

export default function QuizPage() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const { state, loadExamQuestions } = useQuiz()
  const id = (examId ?? 'ai900') as ExamId

  const [questions, setQuestions] = useState<Question[]>(() => getQuestions(id))
  const [loading, setLoading] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<{ correct: boolean; userAnswer: string[]; questionId: string }[]>([])

  useEffect(() => {
    setLoading(true)
    loadExamQuestions(id).then((loaded) => {
      if (loaded.length > 0) setQuestions(loaded)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return <LoadingSpinner text={`Loading ${id.toUpperCase().replace('AI', 'AI-')} questions...`} />
  }

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

  const progress = (currentIdx / questions.length) * 100

  function handleSubmit() {
    if (selected.length === 0) return
    setSubmitted(true)
    const correct = question.correctIds.every(cid => selected.includes(cid)) &&
      selected.every(sid => question.correctIds.includes(sid))
    setResults(prev => [...prev, { correct, userAnswer: selected, questionId: question.id }])
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      const finalResults = [...results]
      const correctCount = finalResults.filter(r => r.correct).length
      const score = Math.round((correctCount / questions.length) * 1000)
      sessionStorage.setItem('quizResult', JSON.stringify({
        score,
        correctCount,
        total: questions.length,
        examId: id,
      }))
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
