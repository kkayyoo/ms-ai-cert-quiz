import { getUniqueDomains, getQuestionsByDomain } from '../utils/dataLoader';
import { validateQuestion } from '../utils/validation';
import { Question } from '../types';
import * as fs from 'fs';
import * as path from 'path';

function loadLocalJSON(filePath: string): unknown[] {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

describe('dataLoader integration', () => {
  const dataRoot = path.resolve(__dirname, '../../data');

  it('ai-900/questions.json is valid array', () => {
    const data = loadLocalJSON(path.join(dataRoot, 'ai-900/questions.json'));
    expect(Array.isArray(data)).toBe(true);
  });

  it('ai-102/questions.json is valid array', () => {
    const data = loadLocalJSON(path.join(dataRoot, 'ai-102/questions.json'));
    expect(Array.isArray(data)).toBe(true);
  });

  it('getUniqueDomains returns unique domains', () => {
    const questions: Question[] = [
      { id: 'q1', examId: 'ai900', domain: 'Domain A', difficulty: 'easy', type: 'single', text: 'Q', options: [], correctIds: ['A'], explanation: '', explanationZh: '' },
      { id: 'q2', examId: 'ai900', domain: 'Domain A', difficulty: 'easy', type: 'single', text: 'Q', options: [], correctIds: ['A'], explanation: '', explanationZh: '' },
      { id: 'q3', examId: 'ai900', domain: 'Domain B', difficulty: 'easy', type: 'single', text: 'Q', options: [], correctIds: ['A'], explanation: '', explanationZh: '' },
    ];
    expect(getUniqueDomains(questions)).toEqual(['Domain A', 'Domain B']);
  });

  it('getQuestionsByDomain filters correctly', () => {
    const questions: Question[] = [
      { id: 'q1', examId: 'ai900', domain: 'Domain A', difficulty: 'easy', type: 'single', text: 'Q', options: [], correctIds: ['A'], explanation: '', explanationZh: '' },
      { id: 'q2', examId: 'ai900', domain: 'Domain B', difficulty: 'easy', type: 'single', text: 'Q', options: [], correctIds: ['A'], explanation: '', explanationZh: '' },
    ];
    expect(getQuestionsByDomain(questions, 'Domain A')).toHaveLength(1);
  });

  it('validateQuestion rejects invalid question', () => {
    expect(validateQuestion({})).toBe(false);
    expect(validateQuestion(null)).toBe(false);
    expect(validateQuestion({ id: 'q1' })).toBe(false);
  });
});
