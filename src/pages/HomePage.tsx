import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { EXAM_CONFIG } from '../config/examConfig';
import { ExamId } from '../types';
import { getPracticeProgress } from '../utils/storage';

// ── Official Exam Syllabi (as of 2025) ────────────────────────────────────────
const SYLLABI: Record<string, {
  updated: string;
  url: string;
  domains: { name: string; weight: string; topics: string[] }[];
}> = {
  ai900: {
    updated: 'May 2, 2025',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-900',
    domains: [
      {
        name: 'Describe Artificial Intelligence workloads and considerations',
        weight: '15–20%',
        topics: [
          'Identify features of common AI workloads',
          'Identify guiding principles for responsible AI',
          'Identify considerations for responsible AI such as fairness, reliability & safety, privacy & security, inclusiveness, transparency, accountability',
        ],
      },
      {
        name: 'Describe fundamental principles of machine learning on Azure',
        weight: '20–25%',
        topics: [
          'Identify common machine learning techniques (regression, classification, clustering)',
          'Describe core machine learning concepts (training, evaluation, inferencing)',
          'Describe Azure Machine Learning capabilities (AutoML, designer, experiments)',
          'Describe features of computer vision models, NLP models, and generative models',
        ],
      },
      {
        name: 'Describe features of computer vision workloads on Azure',
        weight: '15–20%',
        topics: [
          'Identify common types of computer vision solution (image classification, object detection, OCR, facial detection)',
          'Identify Azure tools and services for computer vision tasks (Azure AI Vision, Custom Vision, Face API)',
        ],
      },
      {
        name: 'Describe features of Natural Language Processing (NLP) workloads on Azure',
        weight: '15–20%',
        topics: [
          'Identify features of common NLP workload scenarios (key phrase extraction, sentiment analysis, language translation)',
          'Identify Azure tools and services for NLP workloads (Azure AI Language, Translator, Speech)',
        ],
      },
      {
        name: 'Describe features of generative AI workloads on Azure',
        weight: '15–20%',
        topics: [
          'Identify features of generative AI solutions (LLMs, copilots, image generation)',
          'Identify capabilities of Azure OpenAI Service',
          'Describe responsible generative AI principles',
        ],
      },
    ],
  },
  ai102: {
    updated: 'December 23, 2025',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-102',
    domains: [
      {
        name: 'Plan and manage an Azure AI solution',
        weight: '15–20%',
        topics: [
          'Select the appropriate Azure AI service',
          'Plan, create, and deploy an Azure AI service',
          'Manage, monitor, and secure Azure AI services (authentication, network security, logging)',
          'Manage costs and performance of Azure AI services',
        ],
      },
      {
        name: 'Implement decision support solutions',
        weight: '10–15%',
        topics: [
          'Create anomaly detection solutions with Azure AI Anomaly Detector',
          'Create content moderation solutions with Azure AI Content Safety',
          'Implement knowledge mining with Azure AI Search (indexers, skillsets, semantic ranking)',
        ],
      },
      {
        name: 'Implement computer vision solutions',
        weight: '15–20%',
        topics: [
          'Analyze images with Azure AI Vision (image analysis, object detection, OCR)',
          'Implement custom image models with Custom Vision',
          'Process video with Azure Video Indexer',
          'Extract text from documents with Azure AI Document Intelligence (Form Recognizer)',
        ],
      },
      {
        name: 'Implement natural language processing solutions',
        weight: '30–35%',
        topics: [
          'Analyze text with Azure AI Language (sentiment, key phrases, entity recognition)',
          'Build conversational language understanding (CLU) models',
          'Create custom text classification and NER solutions',
          'Implement knowledge base Q&A with Custom Question Answering',
          'Implement speech solutions (Azure AI Speech: STT, TTS, translation)',
          'Translate language with Azure AI Translator',
          'Build conversational AI solutions with Azure Bot Service',
        ],
      },
      {
        name: 'Implement knowledge mining and document intelligence solutions',
        weight: '10–15%',
        topics: [
          'Implement Azure AI Search solutions (index design, skillsets, semantic search)',
          'Extract data from forms and documents with Azure AI Document Intelligence',
          'Implement custom skills in Azure AI Search pipelines',
        ],
      },
      {
        name: 'Implement generative AI solutions',
        weight: '10–15%',
        topics: [
          'Use Azure OpenAI Service (completions, chat completions, embeddings, DALL-E)',
          'Implement prompt engineering and grounding techniques',
          'Build RAG solutions with Azure AI Search and Azure OpenAI',
          'Apply responsible AI principles for generative AI',
        ],
      },
    ],
  },
};

const EXAMS: { id: ExamId; color: string }[] = [
  { id: 'ai900', color: '#0078D4' },
  { id: 'ai102', color: '#005A9E' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { state, loadExamQuestions } = useQuiz();
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({});
  const [practiceProgress, setPracticeProgress] = useState<Record<string, { idx: number; total: number } | null>>({});
  const [syllabusModal, setSyllabusModal] = useState<string | null>(null); // examId or null

  useEffect(() => {
    EXAMS.forEach(async ({ id }) => {
      const questions = await loadExamQuestions(id);
      setQuestionCounts((prev) => ({ ...prev, [id]: questions.length }));
      // Check for saved progress
      const saved = getPracticeProgress(id);
      if (saved && saved.currentIdx > 0) {
        setPracticeProgress((prev) => ({ ...prev, [id]: { idx: saved.currentIdx, total: questions.length } }));
      }
    });
  }, []);

  const syllabus = syllabusModal ? SYLLABI[syllabusModal] : null;
  const syllabusExamLabel = syllabusModal?.toUpperCase().replace('AI', 'AI-');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Syllabus Modal */}
      {syllabusModal && syllabus && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            zIndex: 1000, overflowY: 'auto', padding: '2rem 1rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSyllabusModal(null); }}
        >
          <div style={{
            background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '680px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.25)', overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              background: EXAMS.find(e => e.id === syllabusModal)?.color ?? '#0078D4',
              color: '#fff', padding: '1.25rem 1.5rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {syllabusExamLabel} Official Exam Syllabus
                </div>
                <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: '2px' }}>
                  Skills measured as of {syllabus.updated}
                </div>
              </div>
              <button
                onClick={() => setSyllabusModal(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
                  borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px',
                  cursor: 'pointer', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', maxHeight: '65vh', overflowY: 'auto' }}>
              {syllabus.domains.map((domain, i) => (
                <div key={i} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', flex: 1, paddingRight: '1rem' }}>
                      {domain.name}
                    </div>
                    <span style={{
                      background: '#EFF6FF', color: '#0078D4', borderRadius: '999px',
                      padding: '2px 10px', fontSize: '0.8rem', fontWeight: 600,
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {domain.weight}
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {domain.topics.map((topic, j) => (
                      <li key={j} style={{ color: '#475569', fontSize: '0.87rem', marginBottom: '3px', lineHeight: 1.5 }}>
                        {topic}
                      </li>
                    ))}
                  </ul>
                  {i < syllabus.domains.length - 1 && (
                    <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', marginTop: '1rem' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <a
                href={syllabus.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0078D4', fontSize: '0.87rem', textDecoration: 'none' }}
              >
                📄 View full study guide on Microsoft Learn ↗
              </a>
              <button
                className="btn-primary"
                onClick={() => setSyllabusModal(null)}
                style={{ padding: '6px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
          Microsoft AI Certification Practice
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Practice questions for AI-900 and AI-102 exams. Pass score: 700/1000.
        </p>
      </section>

      {/* Exam Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {EXAMS.map(({ id, color }) => {
          const config = EXAM_CONFIG[id];
          const count = questionCounts[id];
          const isLoading = state.loadingExam === id;
          const progress = practiceProgress[id];
          const hasProgress = !!progress;
          const progressPct = progress ? Math.round((progress.idx / progress.total) * 100) : 0;

          return (
            <div key={id} style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              borderTop: `4px solid ${color}`,
            }}>
              <div style={{ padding: '1.5rem' }}>
                {/* Exam badge + syllabus button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    background: color, color: '#fff',
                    borderRadius: '4px', padding: '2px 10px',
                    fontSize: '0.85rem', fontWeight: 600,
                  }}>
                    {id.toUpperCase().replace('AI', 'AI-')}
                  </span>
                  <button
                    onClick={() => setSyllabusModal(id)}
                    style={{
                      background: 'none', border: `1px solid ${color}`,
                      color: color, borderRadius: '4px', padding: '2px 10px',
                      fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500,
                    }}
                  >
                    📋 Exam Syllabus
                  </button>
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: '0 0 0.5rem' }}>
                  {config.name}
                </h2>

                <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <span>📝 {isLoading ? '...' : count !== undefined ? `${count} questions` : `${config.totalQuestions} questions`}</span>
                  <span>⏱ {config.duration} min</span>
                  <span>🎯 Pass: {config.passingScore}/1000</span>
                </div>

                {/* Practice progress bar */}
                {hasProgress && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', marginBottom: '4px' }}>
                      <span>📌 Practice progress</span>
                      <span>{progress.idx} / {progress.total} questions ({progressPct}%)</span>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progressPct}%`, height: '100%',
                        background: color, borderRadius: '999px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    style={{
                      flex: 1, background: color, color: '#fff',
                      border: 'none', borderRadius: '6px',
                      padding: '0.6rem 1rem', fontWeight: 600,
                      cursor: 'pointer', fontSize: '0.95rem',
                    }}
                    onClick={() => navigate(`/quiz/${id}`)}
                  >
                    {hasProgress ? '▶ Continue Practice' : 'Start Practice'}
                  </button>
                  <button
                    style={{
                      flex: 1, background: '#fff', color: color,
                      border: `2px solid ${color}`, borderRadius: '6px',
                      padding: '0.6rem 1rem', fontWeight: 600,
                      cursor: 'pointer', fontSize: '0.95rem',
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
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: '8px', padding: '0.75rem 1.5rem',
            cursor: 'pointer', color: '#475569', fontWeight: 500,
          }}
          onClick={() => navigate('/wrong-answers')}
        >
          📚 Review Wrong Answer Book
        </button>
      </div>
    </div>
  );
}
