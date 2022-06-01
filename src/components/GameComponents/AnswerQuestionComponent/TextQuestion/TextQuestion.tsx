import React, {FC, useEffect, useRef, useState} from 'react'
import {TAnswer, TQuestion} from "../../../../types/types";
import styles from "./TextQuestion.module.css"
import classNames from "classnames";
import {Set} from "immutable";
import TextAnswerList from "./TextAnswerList/TextAnswerList";

type TextQuestionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answer: any) => void
  question?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isTimeOut: boolean
  isSubmitted: boolean
}
const correctColor = "#0082BE"
const incorrectColor = "#cccccc"
const TextQuestion: FC<TextQuestionProps> = ({
                                               className,
                                               socketSubmit,
                                               question,
                                               showAnswer,
                                               isHost,
                                               isTimeOut,
                                               isSubmitted,
                                             }) => {
  const [answerText, setAnswerText] = useState<string | null>(null)
  let isCorrect = false

  useEffect(() => {
    if (isTimeOut && !isSubmitted) {
      if (answerText) {
        socketSubmit(answerText)
      }
    }
  }, [isTimeOut]);

  const concatAnswerList = (): string[] => {
    if (!question) return []
    return question?.questionAnswers.map((answer: TAnswer) => answer.answer)
  }

  // factory + strategy please`
  const getQuestionType = (): string => {
    if (question && question.matcher)
      switch (question.matcher) {
        case '10EXC':
          return "Câu trả lời chính xác là:"
        case '20CNT':
          return "Câu trả lời phải chứa:"
        default:
          return "Câu trả lời là:"
      }
    return "Câu trả lời là:"
  }

  const getSuggestType = (): string => {
    if (question && question.matcher)
      switch (question.matcher) {
        case '10EXC':
          return "Câu trả lời chính xác được tính điểm!"
        case '20CNT':
          return "Câu trả lời chỉ cần chứa từ khoá đúng"
        default:
          return "Câu hỏi tự luận"
      }
    return "Câu hỏi tự luận"
  }

  const getBackgroundColorForAnswer = (): string => {
    if (isTimeOut && !isHost) {
      if (question && question.matcher)
        switch (question.matcher) {
          case '10EXC':
            for (const answer in question.questionAnswers) {
              if (answer == answerText) {
                isCorrect = true
                return correctColor
              }
            }
            break
          case '20CNT':
            for (const answer in question.questionAnswers) {
              if (answerText?.includes(answer)) {
                isCorrect = true
                return correctColor
              }
            }
            break
          default:
            isCorrect = true
            return incorrectColor
        }
      isCorrect = false
      return incorrectColor
    }
    isCorrect = true
    return "#0082BE"
  }

  return (
    <div
      style={{
        background: getBackgroundColorForAnswer(),
        transition: "all .5s ease",
        WebkitTransition: "all .5s ease",
        MozTransition: "all .5s ease"
      }}
      className={classNames(
        'd-flex flex-column align-items-center justify-content-center',
        styles.selectionBox,
      )}
    >
      <div className={`d-flex flex-column w-100 ${styles.selectionInner}`}>
        {isTimeOut &&
            <div className={`d-flex `}>
                <div
                    className={`text-white bg-white ps-12px flex-grow-1 ${styles.questionType}`}>{getQuestionType()}</div>
                <div className={`d-flex align-items-center`}>
                    <i className={`fw-bold bi ${isCorrect ? "bi-check-circle-fill" : "bi-x-circle-fill"} fs-1`}
                       style={{
                         color: isCorrect ? "#00a991" : "#e2352a",
                         transition: "all .5s ease",
                         WebkitTransition: "all .5s ease",
                         MozTransition: "all .5s ease"
                       }}></i>
                </div>
            </div>
        }
        {
          isTimeOut && <TextAnswerList
                className={styles.showAnswer}
                answers={concatAnswerList()}
            />
        }

        {
          isHost ?
            (!isTimeOut &&
                <div className={"h-100 w-100 d-flex align-items-center"}>
                    <div
                        className={classNames(
                          "w-100 outline-none border-0 px-12px bg-transparent text-white text-center flex-grow-1 customScrollbar",
                          styles.answerInput,
                        )}
                    >
                      {getSuggestType()}
                    </div>
                </div>

            )
            :
            <textarea
              autoFocus
              disabled={(isTimeOut || isSubmitted)}
              className={classNames(
                "w-100 text-center flex-grow-1 customScrollbar",
                styles.answerInput,
              )}
              onChange={(t) => setAnswerText(t.target.value)}
            />
        }

      </div>
    </div>
  )
}

export default TextQuestion
