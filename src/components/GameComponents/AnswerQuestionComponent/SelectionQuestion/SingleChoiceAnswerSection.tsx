import classNames from 'classnames'
import { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import { TAnswer, TQuestion } from '../../../../types/types'
import styles from './SingleChoiceAnswerSection.module.css'

type SingpleChoiceAnswerSectionProps = {
  className?: string
  handleSubmitAnswer: (answerId: number) => void
  option?: TQuestion
  selectedAnswers?: Set<number>
  showAnswer: boolean
  isHost: boolean
}
const colorArray: Array<string> = ['#00A384', '#e86262', '#ef6415', '#0082BE']
const colorIncorrectArray: Array<string> = [
  '#00A3844D',
  '#e862624D',
  '#ef64154D',
  '#0082BE4D',
]

const alphabet = ['A', 'B', 'C', 'D', 'E', 'G']
const SingleChoiceAnswerSection: FC<SingpleChoiceAnswerSectionProps> = ({
  className,
  handleSubmitAnswer,
  option,
  selectedAnswers,
  showAnswer,
  isHost,
}) => {
  const cssSelectionClassForAnswer = (answer: TAnswer): string => {
    // css cho câu trả lời đã chọn
    if (selectedAnswers && answer.id && selectedAnswers.has(answer.id)) {
      if (!showAnswer) return styles.selectedBox
      return answer.isCorrect
        ? styles.selectAndCorrect
        : styles.selectAndIncorrect
    }
    // css cho câu trả lời không chọn
    if (showAnswer && !answer.isCorrect) return styles.incorrect
    return ''
  }

  // 2 case:
  const getBackgroundColorForAnswer = (
    answer: TAnswer,
    index: number
  ): string => {
    // chưa show đáp án
    if (!showAnswer) return colorArray[index]
    // chỉ tô màu câu đúng
    return showAnswer && answer.isCorrect
      ? colorArray[index]
      : colorIncorrectArray[index]
  }

  return (
    <div className={classNames(className, '')}>
      {/* 4 câu trả lời */}
      <Row className={`pt-20px ${styles.row}`}>
        {option?.questionAnswers?.map((item, index) => {
          return (
            <Col
              md="6"
              xs="12"
              className={classNames(styles.selectionItem)}
              key={index}
              onClick={() => {
                if (!isHost && item.id) handleSubmitAnswer(item.id)
              }}
            >
              <div
                style={{
                  background: getBackgroundColorForAnswer(
                    item,
                    index % colorArray.length
                  ),
                }}
                className={classNames(
                  'd-flex align-items-center h-100 w-100 ',
                  styles.selectionBox,
                  cssSelectionClassForAnswer(item)
                  // getBackgroundColorForAnswer(item, index % colorArray.length)
                )}
              >
                <div
                  className={classNames(
                    'fw-bold fs-4',
                    styles.alphaBetContainer
                  )}
                >
                  <div className={styles.alphaBetText}>{alphabet[index]}</div>
                </div>
                <div
                  className={`text-white flex-grow-1 fw-semiBold ${
                    item.answer.length < 100
                      ? styles.selectionTextHuge
                      : styles.selectionTextSmall
                  }`}
                >
                  {item.answer}
                </div>

                {showAnswer && item.isCorrect ? (
                  <div>
                    <i className="text-white fw-bold bi bi-check-lg fs-1"></i>
                  </div>
                ) : null}
              </div>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default SingleChoiceAnswerSection
