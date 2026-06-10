import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import WrongAnswerPage from './pages/WrongAnswerPage'
import MockExamPage from './pages/MockExamPage'

export default function App() {
  return (
    <HashRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz/:examId" element={<QuizPage />} />
            <Route path="/results/:sessionId" element={<ResultsPage />} />
            <Route path="/wrong-answers" element={<WrongAnswerPage />} />
            <Route path="/mock/:examId" element={<MockExamPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
