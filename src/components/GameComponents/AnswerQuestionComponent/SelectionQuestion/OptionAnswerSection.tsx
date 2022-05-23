import classNames from 'classnames'
import React, {FC} from 'react'
import {Col, Image, Row} from 'react-bootstrap'
import {animated, useSpring, useTransition} from 'react-spring'
import {TAnswer, TQuestion} from '../../../../types/types'
import styles from './SingleChoiceAnswerSection.module.css'

type OptionAnswerSectionProps = {
  className?: string
  handleSubmitAnswer: (answerId: number) => void
  option?: TQuestion
  selectedAnswers?: Set<number>
  showAnswer: boolean
  isHost: boolean
}
const colorArray: Array<string> = ['#00A384', '#e86262', '#ef6415', '#0082BE']
const incorectColor = "#cccccc"

const normalAlphaValue: string = "E6" // D9
const correctAlphaValue: string = "FF"
const incorrectAlphaValue: string = "26"

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F']
const OptionAnswerSection: FC<OptionAnswerSectionProps> = ({
                                                             className,
                                                             handleSubmitAnswer,
                                                             option,
                                                             selectedAnswers,
                                                             showAnswer,
                                                             isHost,
                                                           }) => {

  // 2 case:
  const getBackgroundColorForAnswer = (
    answer: TAnswer,
    index: number
  ): string => {
    // làm mờ đi câu sai
    if (showAnswer && !answer.isCorrect) {
      return incorectColor//hexColor += (answer.isCorrect ? correctAlphaValue : incorrectAlphaValue)
    } else {
      return colorArray[index]
    }
  }
  const getIconForHost = (answer: TAnswer): string => {
    if (!showAnswer) return "bi-question-circle"
    return answer.isCorrect ? "bi-check-circle-fill" : "bi-x-circle-fill"
  }

  const getIconForPlayer = (answer: TAnswer): string => {
    if (!showAnswer) {
      if (answer.id && selectedAnswers && selectedAnswers?.has(answer.id))
        return "bi-check-circle"
      else
        return "bi-circle"
    } else {
      if (selectedAnswers && answer.id && selectedAnswers?.has(answer.id))
        if (answer.isCorrect)
          return "bi-check-circle-fill"
        else
          return "bi-x-circle-fill"
      else
        return "bi-circle"
    }
  }

  const getCheckIconForGameState = (answer: TAnswer): string => {
    return isHost ? getIconForHost(answer) : getIconForPlayer(answer)
  }

  return (
    <div className={classNames(className, '')}>
      {/* 4 câu trả lời */}
      <Row className={`pt-20px ${styles.row} px-0 mx-0`}>
        {option?.questionAnswers?.map((item, index) => {
          return (
            <Col
              md="6"
              xs="12"
              className={classNames(styles.selectionItem)}
              key={index}
              onClick={() => {
                if (!isHost && item.id && !showAnswer) handleSubmitAnswer(item.id)
              }}
            >
              <div
                style={{
                  background: getBackgroundColorForAnswer(
                    item,
                    index % colorArray.length
                  ),
                  transition: "all .5s ease",
                  WebkitTransition: "all .5s ease",
                  MozTransition: "all .5s ease"
                }}
                className={classNames(
                  'd-flex align-items-center h-100 w-100 ',
                  styles.selectionBox,
                )}
              >
                <div
                  className={classNames(
                    'fw-bold fs-4',
                    styles.alphaBetContainer
                  )}
                  style={{
                    backgroundColor: "white",
                    color: getBackgroundColorForAnswer(item, index),
                  }}
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
                  <div>
                    {item.answer}
                  </div>
                  {item.media?.length ? (
                    <Image
                      src={item.media}
                      width="100%"
                      height="180"
                      className="object-fit-cover"
                      alt=""
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  <i className={`text-white fw-bold bi ${getCheckIconForGameState(item)} fs-1`}></i>
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default OptionAnswerSection
