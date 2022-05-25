import classNames from 'classnames'
import React, {FC, useState} from 'react'
import {Col, Image, Modal, Row} from 'react-bootstrap'
import {animated, useSpring, useTransition} from 'react-spring'
import {TAnswer, TQuestion} from '../../../../types/types'
import styles from './SingleChoiceAnswerSection.module.css'
import useIsMobile from "../../../../hooks/useIsMobile/useIsMobile";
import useScreenSize from "../../../../hooks/useScreenSize/useScreenSize";
import QRCode from "react-qr-code";

type OptionAnswerSectionProps = {
  className?: string
  handleSubmitAnswer: (answerId: number) => void
  option?: TQuestion
  selectedAnswers?: Set<number>
  showAnswer: boolean
  isHost: boolean
  baseIcon: string
}
const colorArray: Array<string> = ['#00a991', '#e2352a', '#f67702', '#0082BE', "#facc50", "#773172"]
const incorrectColor = "#cccccc"

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
                                                             baseIcon
                                                           }) => {
  const isMobile = useIsMobile()
  const screenSize = useScreenSize()

  const [showImage, setShowImage] = useState<string>("")
  // 2 case:
  const getBackgroundColorForAnswer = (
    answer: TAnswer,
    index: number
  ): string => {
    // làm mờ đi câu sai
    if (showAnswer && !answer.isCorrect) {
      return incorrectColor//hexColor += (answer.isCorrect ? correctAlphaValue : incorrectAlphaValue)
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
        return `bi-check-${baseIcon}`
      else
        return `bi-${baseIcon}`
    } else {
      if (selectedAnswers && answer.id && selectedAnswers?.has(answer.id))
        if (answer.isCorrect)
          return `bi-check-${baseIcon}-fill`
        else
          return `bi-x-${baseIcon}-fill`
      else
        return `bi-${baseIcon}`
    }
  }

  const getCheckIconForGameState = (answer: TAnswer): string => {
    return isHost ? getIconForHost(answer) : getIconForPlayer(answer)
  }

  const getColHeight = (): string => {

    if (option?.questionAnswers) {
      if (screenSize >= 768) {
        if (option?.questionAnswers.length > 4)
          return "34%"
        return "50%"
      }
      // if (!isMobile)
        return `${Math.floor(100/option?.questionAnswers.length)}%`

      // return "16%"
    }

    return "100%"
  }

  return (
    /* 4 câu trả lời */
    <Row className={`${styles.row} px-0 mx-0 py-6 pb-3`}>
      {option?.questionAnswers?.map((item, index) => {
        return (
          <Col
            // lg={option?.questionAnswers.length > 4 ? "4" : "6"}
            lg="6"
            xs="12"
            md="6"
            className={classNames(styles.selectionItem)}
            style={{
              height: getColHeight()
            }}
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
                'd-flex align-items-center h-100 w-100 gap-3',
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
                className={`text-white d-flex gap-3 align-items-center justify-content-center flex-grow-1 h-100 fw-semiBold ${
                  item.answer.length < 100
                    ? styles.selectionTextHuge
                    : styles.selectionTextSmall
                }`}
              >
                <div className={"flex-grow-1"}>
                  {item.answer}
                </div>
                {item.media?.length > 0 && (
                  <div
                    className="h-100 flex-grow-1 d-flex justify-content-center align-items-center overflow-hidden"
                  >
                    <Image
                      src={item.media}
                      fluid={true}
                      width="100%"
                      height="auto"
                      className="object-fit-cover"
                      // rounded={true}
                      alt=""
                    />
                  </div>
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
  )
}

export default OptionAnswerSection
