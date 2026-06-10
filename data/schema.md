# Data Schema Documentation

## Question JSON Schema

Each question in `data/ai-900/questions.json` or `data/ai-102/questions.json` follows this schema:

```json
{
  "id": "string (unique, e.g. ai900-001)",
  "examId": "ai900 | ai102",
  "domain": "string (exam domain name)",
  "difficulty": "easy | medium | hard",
  "type": "single | multi",
  "text": "string (question text)",
  "options": [
    { "id": "A", "text": "Option text" },
    { "id": "B", "text": "Option text" }
  ],
  "correctIds": ["A"],
  "explanation": "string (English explanation)",
  "explanationZh": "string (Chinese explanation)",
  "docsUrl": "string (optional, official docs URL)"
}
```

## File Structure

```
data/
  ai-900/
    questions.json    # Array of Question objects
    syllabus.json     # Exam syllabus / domain weights
  ai-102/
    questions.json    # Array of Question objects
    syllabus.json     # Exam syllabus / domain weights
  schema.md           # This file
```

## Validation Rules

- `id`: unique across all question files
- `examId`: must be `ai900` or `ai102`
- `options`: minimum 2 options, maximum 6
- `correctIds`: must reference valid option ids; minimum 1
- For `type: single`: exactly 1 correctId
- For `type: multi`: 2+ correctIds

## LocalStorage Keys

- `quiz_wrong_answers`: `WrongAnswerEntry[]`
- `quiz_session_history`: `SessionHistory[]`

## Score Calculation

- Score range: 0–1000
- Passing threshold: **700/1000**
- Formula: `Math.round((correctCount / totalQuestions) * 1000)`
