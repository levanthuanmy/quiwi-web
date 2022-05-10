import React, { FC, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import styles from './MultipleChoiceAnswerSection.module.css'
import classNames from 'classnames'
import { TQuestion, TQuestionAnswer } from '../../../../types/types'

type MultipleChoiceAnswerSectionProps = {
  className?: string
  handleSubmitAnswer: (answerId: number) => void
  option?: TQuestion
}
const colorArray: Array<string> = ['#009883', '#424171', '#B89A61', '#A9C77E']
const MultipleChoiceAnswerSection: FC<MultipleChoiceAnswerSectionProps> = ({
  className,
  handleSubmitAnswer,
  option,
}) => {
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
              onClick={() => handleSubmitAnswer(item.id)}
            >
              <div
                className={classNames(
                  'd-flex align-items-center h-100 w-100',
                  styles.selectionBox
                )}
                style={{
                  background: colorArray[index % colorArray.length],
                }}
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
