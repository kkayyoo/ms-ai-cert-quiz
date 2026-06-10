import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.css'

interface ExamCard {
  id: string
  name: string
  code: string
  description: string
  questionCount: number
  duration: number
  color: string
}

const EXAMS: ExamCard[] = [
  {
    id: 'ai900',
    name: 'Azure AI Fundamentals',
    code: 'AI-900',
    description: 'Validate your knowledge of common AI and machine learning workloads and how to implement them on Azure.',
    questionCount: 60,
    duration: 45,
    color: '#0078D4',
  },
  {
    id: 'ai102',
    name: 'Designing and Implementing a Microsoft Azure AI Solution',
    code: 'AI-102',
    description: 'Demonstrate your ability to design, implement, and integrate AI solutions using Azure AI services.',
    questionCount: 60,
    duration: 120,
    color: '#005A9E',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Microsoft AI Certification Practice</h1>
          <p className={styles.heroSubtitle}>
            Practice questions for AI-900 and AI-102 exams. Pass score: 700/1000.
          </p>
        </div>
      </section>

      <div className="container">
        <div className={styles.cards}>
          {EXAMS.map(exam => (
            <div key={exam.id} className={styles.card}>
              <div className={styles.cardHeader} style={{ borderTopColor: exam.color }}>
                <span className={styles.badge} style={{ background: exam.color }}>{exam.code}</span>
                <h2 className={styles.cardTitle}>{exam.name}</h2>
              </div>
              <p className={styles.cardDesc}>{exam.description}</p>
              <div className={styles.cardMeta}>
                <span>📝 {exam.questionCount} questions</span>
                <span>⏱ {exam.duration} min</span>
                <span>🎯 Pass: 700/1000</span>
              </div>
              <div className={styles.cardActions}>
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/quiz/${exam.id}`)}
                >
                  Start Practice
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/mock/${exam.id}`)}
                >
                  Mock Exam
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
