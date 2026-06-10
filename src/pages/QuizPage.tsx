import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { ExamId, Question } from '../types'
import { getQuestions, saveWrongAnswer } from '../utils/quizData'
import { useQuiz } from '../context/QuizContext'
import { savePracticeProgress, getPracticeProgress, clearPracticeProgress } from '../utils/storage'
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
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Load questions and restore progress
  useEffect(() => {
    setLoading(true)
    loadExamQuestions(id).then((loaded) => {
      if (loaded.length > 0) {
        setQuestions(loaded)
        // Restore saved progress
        const saved = getPracticeProgress(id)
        if (saved && saved.currentIdx > 0 && saved.currentIdx < loaded.length) {
          setCurrentIdx(saved.currentIdx)
          setResults(saved.results)
        }
      }
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
      // Finished — clear saved progress
      clearPracticeProgress(id)
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
    const nextIdx = currentIdx + 1
    setCurrentIdx(nextIdx)
    setSelected([])
    setSubmitted(false)
    // Auto-save progress after each question
    savePracticeProgress({
      examId: id,
      currentIdx: nextIdx,
      results: [...results],
      savedAt: Date.now(),
    })
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

  function handleExitClick() {
    setShowExitConfirm(true)
  }

  function handleExitConfirm() {
    // Save current progress before leaving
    savePracticeProgress({
      examId: id,
      currentIdx,
      results,
      savedAt: Date.now(),
    })
    navigate('/')
  }

  function handleExitCancel() {
    setShowExitConfirm(false)
  }

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
            <h3 style={{ marginBottom: '12px', color: '#323130' }}>Exit Practice?</h3>
            <p style={{ color: '#605E5C', marginBottom: '24px', lineHeight: 1.5 }}>
              Your progress will be saved. Next time you start practice for this exam, you'll resume from <strong>Question {currentIdx + 1}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={handleExitCancel}>
                Keep Practicing
              </button>
              <button
                className="btn-primary"
                style={{ background: '#D13438' }}
                onClick={handleExitConfirm}
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}

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
          <button
            onClick={handleExitClick}
            style={{
              marginLeft: 'auto', background: 'none', border: '1px solid #ccc',
              borderRadius: '4px', padding: '4px 12px', cursor: 'pointer',
              color: '#605E5C', fontSize: '13px',
            }}
          >
            ✕ Exit
          </button>
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
