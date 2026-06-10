import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { EXAM_CONFIG } from '../config/examConfig';
import { ExamId } from '../types';

const EXAMS: { id: ExamId; color: string }[] = [
  { id: 'ai900', color: '#0078D4' },
  { id: 'ai102', color: '#005A9E' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { state, loadExamQuestions } = useQuiz();
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Pre-load question counts
    EXAMS.forEach(async ({ id }) => {
      const questions = await loadExamQuestions(id);
      setQuestionCounts((prev) => ({ ...prev, [id]: questions.length }));
    });
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
          Microsoft AI Certification Practice
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Practice questions for AI-900 and AI-102 exams. Pass score: 700/1000.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {EXAMS.map(({ id, color }) => {
          const config = EXAM_CONFIG[id];
          const count = questionCounts[id];
          const isLoading = state.loadingExam === id;

          return (
            <div key={id} style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              borderTop: `4px solid ${color}`,
            }}>
              <div style={{ padding: '1.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  background: color,
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '2px 10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                }}>
                  {id.toUpperCase().replace('AI', 'AI-')}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: '0 0 0.5rem' }}>
                  {config.name}
                </h2>
                <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <span>
                    📝 {isLoading ? '...' : count !== undefined ? `${count} questions available` : `${config.totalQuestions} questions`}
                  </span>
                  <span>⏱ {config.duration} min</span>
                  <span>🎯 Pass: {config.passingScore}/1000</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    style={{
                      flex: 1,
                      background: color,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.6rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                    }}
                    onClick={() => navigate(`/quiz/${id}`)}
                  >
                    Start Practice
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: '#fff',
                      color: color,
                      border: `2px solid ${color}`,
                      borderRadius: '6px',
                      padding: '0.6rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                    }}
                    onClick={() => navigate(`/mock/${id}`)}
                  >
                    Mock Exam
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            color: '#475569',
            fontWeight: 500,
          }}
          onClick={() => navigate('/wrong-answers')}
        >
          📚 Review Wrong Answer Book
        </button>
      </div>
    </div>
  );
}
