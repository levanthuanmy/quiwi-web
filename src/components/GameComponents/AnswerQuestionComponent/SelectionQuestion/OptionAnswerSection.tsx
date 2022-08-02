import classNames from 'classnames'
import React, {FC} from 'react'
import {Col, Image, Row} from 'react-bootstrap'
import {TAnswer, TQuestion} from '../../../../types/types'
import styles from './SingleChoiceAnswerSection.module.css'
import useScreenSize from "../../../../hooks/useScreenSize/useScreenSize";
import {ANSWER_COLORS} from "../../../../utils/constants";

type OptionAnswerSectionProps = {
  className?: string
  didSelectAnswerId: (answerId: number) => void
  option?: TQuestion
  selectedAnswers?: Set<number>
  showAnswer: boolean
  isHost: boolean
  baseIcon: string
  isShowSkeleton:boolean
  numOfVote?: number[]
}

const incorrectColor = "#cccccc"

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F']

const OptionAnswerSection: FC<OptionAnswerSectionProps> = ({
                                                             className,
                                                             didSelectAnswerId,
                                                             option,
                                                             selectedAnswers,
                                                             showAnswer,
                                                             isHost,
                                                             baseIcon,
                                                             isShowSkeleton,
                                                             numOfVote
                                                           }) => {
  const {fromMedium} = useScreenSize()

  // 2 case:
  const getBackgroundColorForAnswer = (
    answer: TAnswer,
    index: number
  ): string => {
    // làm mờ đi câu sai
    if (showAnswer && !answer.isCorrect) {
      return incorrectColor//hexColor += (answer.isCorrect ? correctAlphaValue : incorrectAlphaValue)
    } else {
      return ANSWER_COLORS[index]
    }
  }
  const getIconForHost = (answer: TAnswer): string => {
    if (!showAnswer) return `bi-question-${baseIcon}`
    return answer.isCorrect ? `bi-check-${baseIcon}-fill` : `bi-x-${baseIcon}-fill`
  }

  const getIconForPlayer = (answer: TAnswer): string => {
    console.log("=>(OptionAnswerSection.tsx:57) selectedAnswers", selectedAnswers, answer);
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
      if (fromMedium) {
        if (option?.questionAnswers.length > 4)
          return (100 / 3) + "%"
        return "50%"
      }
      // if (!isMobile)
      return `${Math.floor(100 / option?.questionAnswers.length)}%`

      // return "16%"
    }

    return "100%"
  }

  return (
    /* 4 câu trả lời */
    <Row className={`${styles.row} px-0 mx-0 bg-dark bg-opacity-50 rounded-10px`}>
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
              if (!isHost && item.id && !showAnswer) didSelectAnswerId(item.id)
            }}
          >

            <div
              style={{
                background: getBackgroundColorForAnswer(
                  item,
                  index % ANSWER_COLORS.length
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
                <div className={styles.alphaBetText}>{numOfVote ? numOfVote[index] ?? 0: alphabet[index]}</div>
              </div>
              <div
                className={`text-white d-flex gap-3 align-items-center justify-content-center flex-grow-1 h-100 fw-semiBold ${
                  item.answer.length < 100
                    ? styles.selectionTextHuge
                    : styles.selectionTextSmall
                }`}
              >
                <div className={"flex-grow-1"}>
                  {isShowSkeleton ? "" : item.answer}
                </div>
                {item.media?.length > 0 && !isShowSkeleton && (
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
                <div></div>
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
