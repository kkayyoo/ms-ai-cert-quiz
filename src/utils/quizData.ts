import type { Question, ExamId, WrongAnswerEntry } from '../types'

// Sample questions - in production these come from the database/JSON files
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'ai900-001',
    examId: 'ai900',
    domain: 'Describe Artificial Intelligence workloads and considerations',
    difficulty: 'easy',
    type: 'single',
    text: 'Which type of AI workload involves analyzing images to identify objects within them?',
    options: [
      { id: 'a', text: 'Natural language processing' },
      { id: 'b', text: 'Computer vision' },
      { id: 'c', text: 'Conversational AI' },
      { id: 'd', text: 'Anomaly detection' },
    ],
    correctIds: ['b'],
    explanation: 'Computer vision is the AI workload that involves analyzing images and video to identify and classify objects, people, and scenes.',
    explanationZh: '计算机视觉是分析图像和视频以识别和分类对象、人物和场景的AI工作负载类型。',
    docsUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/',
  },
  {
    id: 'ai900-002',
    examId: 'ai900',
    domain: 'Describe fundamental principles of machine learning on Azure',
    difficulty: 'medium',
    type: 'multi',
    text: 'Which TWO of the following are types of machine learning?',
    options: [
      { id: 'a', text: 'Supervised learning' },
      { id: 'b', text: 'Conditional learning' },
      { id: 'c', text: 'Unsupervised learning' },
      { id: 'd', text: 'Determined learning' },
    ],
    correctIds: ['a', 'c'],
    explanation: 'The main types of machine learning are supervised learning (using labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning.',
    explanationZh: '机器学习的主要类型包括：监督学习（使用标记数据）、无监督学习（在未标记数据中发现模式）和强化学习。',
  },
  {
    id: 'ai900-003',
    examId: 'ai900',
    domain: 'Describe features of computer vision workloads on Azure',
    difficulty: 'medium',
    type: 'single',
    text: 'What Azure service would you use to extract text from images and documents?',
    options: [
      { id: 'a', text: 'Azure Face API' },
      { id: 'b', text: 'Azure Document Intelligence' },
      { id: 'c', text: 'Azure Video Indexer' },
      { id: 'd', text: 'Azure Custom Vision' },
    ],
    correctIds: ['b'],
    explanation: 'Azure Document Intelligence (formerly Form Recognizer) extracts text, key-value pairs, tables, and structures from documents and images using OCR.',
    explanationZh: 'Azure 文档智能（前身为 Form Recognizer）使用 OCR 从文档和图像中提取文本、键值对、表格和结构。',
    docsUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/',
  },
]

export function getQuestions(examId: ExamId): Question[] {
  return SAMPLE_QUESTIONS.filter(q => q.examId === examId)
}

export function getWrongAnswers(): WrongAnswerEntry[] {
  try {
    return JSON.parse(localStorage.getItem('wrongAnswers') || '[]') as WrongAnswerEntry[]
  } catch {
    return []
  }
}

export function saveWrongAnswer(entry: WrongAnswerEntry): void {
  const existing = getWrongAnswers()
  const filtered = existing.filter(e => e.question.id !== entry.question.id)
  localStorage.setItem('wrongAnswers', JSON.stringify([...filtered, entry]))
}

export function removeWrongAnswer(id: string): void {
  const existing = getWrongAnswers()
  localStorage.setItem('wrongAnswers', JSON.stringify(existing.filter(e => e.id !== id)))
}
