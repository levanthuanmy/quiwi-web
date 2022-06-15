import React, {FC, useEffect, useRef, useState} from 'react'
import {TAnswer, TQuestion} from "../../../../types/types";
import styles from "./PollQuestion.module.css"
import classNames from "classnames";
import {Set} from "immutable";
import PollAnswerList from "./PollAnswerList";
import {bool} from "yup";

type PollQuestionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answer: any) => void
  question?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isTimeOut: boolean
  isSubmitted: boolean
  isCounting: boolean
}
const correctColor = "#0082BE"
const incorrectColor = "#cccccc"
const PollQuestion: FC<PollQuestionProps> = ({
                                               className,
                                               socketSubmit,
                                               question,
                                               showAnswer,
                                               isHost,
                                               isTimeOut,
                                               isSubmitted,
                                               isCounting
                                             }) => {
  const [answerText, setAnswerText] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)

  useEffect(() => {
    if (isTimeOut && !isSubmitted && isCounting) {
      socketSubmit(answerText ?? "")
    }
    if (isTimeOut) {
      setIsCorrect(checkAnswer())
    }
  }, [isTimeOut]);

  const getSuggestType = (): string => {
    return isCorrect && !isHost ? "Câu hỏi của bạn đã được ghi nhận": "Câu hỏi tự do"
  }

  const checkAnswer = (): boolean => {
    if (isTimeOut && !isHost) {
      if (answerText && answerText.length > 0) {
        setIsCorrect(true)
        return true;
      }
      setIsCorrect(false)
      return false
    }
    // setIsCorrect(true)
    return true
  }

  const getBackgroundColorForAnswer = (): string => {
    if (isTimeOut && !isHost) {
      return isCorrect ? correctColor : incorrectColor
    }
    return correctColor
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
      <div className={`d-flex flex-column justify-content-around h-100 w-100 ${styles.selectionInner}`}>
        {/*{isTimeOut &&*/}
        {/*    <div className={`d-flex ${styles.titleGroup}`}>*/}
        {/*        <div className={`ps-12px flex-grow-1 ${styles.questionType}`}>*/}
        {/*          {isHost ? getQuestionTypeForHost() : (getQuestionTypeForPlayer(isCorrect))}*/}
        {/*        </div>*/}
        {/*      {!isHost &&*/}
        {/*          <div className={`d-flex align-items-center`}>*/}
        {/*              <i*/}
        {/*                  className={`fw-bold bi */}
        {/*                  ${isCorrect ? "bi-check-circle-fill" : "bi-x-circle-fill"} */}
        {/*                  ${styles.icon}`}*/}
        {/*                  style={{*/}
        {/*                    color: isCorrect ? "#00a991" : "#e2352a",*/}
        {/*                    transition: "all .5s ease",*/}
        {/*                    WebkitTransition: "all .5s ease",*/}
        {/*                    MozTransition: "all .5s ease"*/}
        {/*                  }}></i>*/}
        {/*          </div>}*/}

        {/*    </div>*/}
        {/*}*/}

        <div className={"h-100 w-100 d-flex flex-column justify-content-center"}>
          <div
            className={classNames(
              "w-100 fw-bold fs-1 outline-none border-0 px-12px  text-white text-center customScrollbar",
            )}
          >
            {getSuggestType()}
          </div>
        </div>

        {
          !isHost &&
            <textarea
                autoFocus={true}
                placeholder={isTimeOut ? "Bạn đã bỏ qua câu hỏi này!" : "Nhập câu trả lời của bạn"}
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

export default PollQuestion
