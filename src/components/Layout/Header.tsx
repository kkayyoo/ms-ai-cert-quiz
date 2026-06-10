import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>MS AI Cert Quiz</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/wrong-answers" className={styles.navLink}>Wrong Answer Book</Link>
          <button
            className={`btn-primary ${styles.mockBtn}`}
            onClick={() => navigate('/mock/ai900')}
          >
            Mock Exam
          </button>
        </nav>
      </div>
    </header>
  )
}
