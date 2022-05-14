import React, { FC, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import styles from './MultipleChoiceAnswerSection.module.css'
import classNames from 'classnames'
import { TAnswer, TQuestion } from '../../../../types/types'

type MultipleChoiceAnswerSectionProps = {
  className?: string
  handleSubmitAnswer: (answerId: number) => void
  option?: TQuestion
  selectedAnswers?: Set<number>
  showAnswer: boolean
  isHost: boolean
}
const colorArray: Array<string> = ['#009883', '#424171', '#B89A61', '#A9C77E']
const incorectColorArray: Array<string> = ['#009883', '#424171', '#B89A61', '#A9C77E']
const MultipleChoiceAnswerSection: FC<MultipleChoiceAnswerSectionProps> = ({
  className,
  handleSubmitAnswer,
  option,
  selectedAnswers,
  showAnswer,
  isHost
}) => {
  const cssSelectionClassForAnswer = (answer: TAnswer): string => {
    // css cho câu trả lời đã chọn
    if (selectedAnswers && answer.id && selectedAnswers.has(answer.id)) {
      if (!showAnswer) return styles.selectedBox
      return answer.isCorrect ? styles.selectAndCorrect : styles.selectAndIncorrect
    }
    // css cho câu trả lời không chọn
    if (showAnswer && !answer.isCorrect) return styles.incorrect
    return ''
  }

  // 2 case: 
  const getBackgroundColorForAnswer = (answer: TAnswer, index: number): string => {        
    // chưa show đáp án
    if (!showAnswer) return colorArray[index]
    // chỉ tô màu câu đúng
    return (showAnswer && answer.isCorrect) ? colorArray[index] : "#7f7f7f"
  }

  return (
    <div className={classNames(className, 'rounded-20px bg-white pt-20px')}>
      {/* 4 câu trả lời */}
      <Row className={`pt-20px ${styles.row}`}>
        {option?.questionAnswers?.map((item, index) => {
          return (
            <Col
              md="6"
              xs="12"
              className={classNames(styles.selectionItem)}
              key={index}
              onClick={() => {if(!isHost && item.id) handleSubmitAnswer(item.id)}}
            >
              <div           
                style={{
                  background: getBackgroundColorForAnswer(item, index % colorArray.length),
                }}
                className={classNames(
                  'd-flex align-items-center h-100 w-100',
                  styles.selectionBox,
                  cssSelectionClassForAnswer(item)                  
                )}
              >
                <div
                  className={classNames(
                    'fw-bold fs-4',
                    styles.alphaBetContainer
                  )}
                >
                  <div className={styles.alphaBetText}>A</div>
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
              </div>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default MultipleChoiceAnswerSection
