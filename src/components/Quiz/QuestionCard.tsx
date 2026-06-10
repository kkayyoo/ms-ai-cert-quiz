import type { Question, Option } from '../types'
import styles from './QuestionCard.module.css'

interface Props {
  question: Question
  selected: string[]
  submitted: boolean
  onChange: (ids: string[]) => void
}

function optionClass(opt: Option, props: Props): string {
  const { selected, submitted, question } = props
  const isSelected = selected.includes(opt.id)
  const isCorrect = question.correctIds.includes(opt.id)

  if (!submitted) {
    return `${styles.option} ${isSelected ? styles.optionSelected : ''}`
  }
  if (isCorrect) return `${styles.option} ${styles.optionCorrect}`
  if (isSelected && !isCorrect) return `${styles.option} ${styles.optionWrong}`
  return styles.option
}

export default function QuestionCard(props: Props) {
  const { question, selected, submitted, onChange } = props
  const isMulti = question.type === 'multi'

  function toggle(id: string) {
    if (submitted) return
    if (isMulti) {
      onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
    } else {
      onChange([id])
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.questionText}>{question.text}</div>
      {isMulti && (
        <p className={styles.hint}>Select {question.correctIds.length} answers</p>
      )}
      <div className={styles.options}>
        {question.options.map(opt => (
          <button
            key={opt.id}
            className={optionClass(opt, props)}
            onClick={() => toggle(opt.id)}
            disabled={submitted}
            aria-pressed={selected.includes(opt.id)}
          >
            <span className={styles.optionIndicator}>
              {isMulti ? (
                <span className={`${styles.checkbox} ${selected.includes(opt.id) ? styles.checked : ''}`} />
              ) : (
                <span className={`${styles.radio} ${selected.includes(opt.id) ? styles.radioChecked : ''}`} />
              )}
            </span>
            <span className={styles.optionText}>{opt.text}</span>
            {submitted && question.correctIds.includes(opt.id) && (
              <span className={styles.correctMark}>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
