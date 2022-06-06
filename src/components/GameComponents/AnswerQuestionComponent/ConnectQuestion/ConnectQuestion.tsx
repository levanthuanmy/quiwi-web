import React, {FC, useEffect, useState} from 'react'
import {TAnswer, TQuestion} from "../../../../types/types";
import styles from "./ConnectQuestion.module.css"
import classNames from "classnames";
import {ConnectAnswerList} from "./ConnectAnswerList";

type ConnectQuestionProps = {
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

const ConnectQuestion: FC<ConnectQuestionProps> = ({
                                                     className,
                                                     socketSubmit,
                                                     question,
                                                     showAnswer,
                                                     isHost,
                                                     isTimeOut,
                                                     isSubmitted,
                                                   }) => {
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [answerSet, setAnswerSet] = useState<Set<TAnswer>>(new Set())
  var correctAnswer: TAnswer[] = []
  var answerDict = new Map<number, TAnswer>();
  useEffect(() => {
    if (question?.questionAnswers) {
      correctAnswer = question.questionAnswers.filter(item => item.isCorrect)
      correctAnswer.sort(function (a, b) {
        return b.orderPosition - a.orderPosition
      })
      console.log("=>(ConnectQuestion.tsx:36) useffect ", correctAnswer);
    }
  }, [question?.questionAnswers]);

  useEffect(() => {
    if (isTimeOut && !isSubmitted) {
      // if (answerText) {
      // socketSubmit(answerText)
      // }
    }
    if (isTimeOut) {
      // setIsCorrect(checkAnswer())
    }
  }, [isTimeOut]);

  const getBackgroundColorForAnswer = (): string => {
    if (isTimeOut && !isHost) {
      return isCorrect ? correctColor : incorrectColor
    }
    return correctColor
  }

  function getBlankAnswer(): TAnswer {
    return {
      id: -1,
      answer: "Tạm"
    } as TAnswer
  }

  function getPlaceHolderAnswer(): TAnswer {
    return {
      id: -1,
      answer: "    "
    } as TAnswer
  }

  const concatOptionList = (): TAnswer[] => {
    if (!question) return []
    return question?.questionAnswers
  }

  const concatAnswerList = (): TAnswer[] => {
    if (!question) return []
    return Array.from(answerSet)
  }

  const didClickWord = (answer: TAnswer) => {
    console.log("=>(ConnectQuestion.tsx:71) answerSet", answer);
    const answers: Set<TAnswer> = answerSet
    answers.has(answer) ? answers.delete(answer) : answers.add(answer)
    setAnswerSet(new Set(answers))
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
        'd-flex flex-column align-items-center ', //justify-content-center
        styles.container,
      )}
    >
      <div className={`d-flex flex-column bg-white justify-content-around w-100 customScrollbar ${styles.selectedBox}`}>
        <ConnectAnswerList
          className={styles.selectedOption}
          options={concatAnswerList()}
          displayDecor={true}
          didSelect={didClickWord}
        />
      </div>

      <div
        className={`d-flex flex-column bg-primary justify-content-around w-100 customScrollbar ${styles.selectionBox}`}>
        <ConnectAnswerList
          className={styles.availableOption}
          options={concatOptionList()}
          displayDecor={false}
          didSelect={didClickWord}
        />
      </div>
    </div>
  )
}

export default ConnectQuestion
