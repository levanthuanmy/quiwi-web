import React, {FC, useEffect, useRef, useState} from 'react'
import {TAnswer, TQuestion} from "../../../../types/types";
import styles from "./TextQuestion.module.css"
import classNames from "classnames";
import {Set} from "immutable";
import TextAnswerList from "./TextAnswerList/TextAnswerList";

type TextQuestionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answerSet: Set<any>) => void
  option?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isTimeOut: boolean
  isSubmitted: boolean
}

const TextQuestion: FC<TextQuestionProps> = ({
                                               className,
                                               socketSubmit,
                                               option,
                                               showAnswer,
                                               isHost,
                                               isTimeOut,
                                               isSubmitted,
                                             }) => {
  const [answerText, setAnswerText] = useState<string | null>(null)
  const focusDiv = useRef();

  console.log("=>(TextQuestion.tsx:31) questionAnswers", option?.questionAnswers);
  useEffect(() => {
    if (isTimeOut && !isSubmitted) {
      if (answerText) {
        let answerSet: Set<string> = Set([answerText]);
        console.log("=>(TextQuestion.tsx:36) answerSet", answerSet);


        socketSubmit(answerSet)
      }
    }
  }, [isTimeOut]);

  const concatAnswerList = (): string[] => {
    if (!option) return []
    return option?.questionAnswers.map((answer: TAnswer) => answer.answer)
  }

  const getQuestionType = (): string => {
    if (option && option.matcher)
      switch (option.matcher) {
        case '10EXC':
          return "Câu trả lời chính xác là:"
        case '20CNT':
          return "Câu trả lời phải chứa:"
        default:
          return "Câu trả lời là:"
      }
    return "Câu trả lời là:"
  }

  return (
    <div
      style={{
        background: "#0082BE",
        transition: "all .5s ease",
        WebkitTransition: "all .5s ease",
        MozTransition: "all .5s ease"
      }}
      className={classNames(
        'd-flex flex-column align-items-center justify-content-center',
        styles.selectionBox,
      )}
    >
      <div className={"d-flex flex-column h-100"}>
        <div className={"text-white fs-3 w-100 py-12px ps-12px"}>{getQuestionType()}</div>
        <TextAnswerList
          answers={concatAnswerList()}
        />
        {!isHost
          && <textarea
                autoFocus
                disabled={!(isTimeOut || isSubmitted)}
                className={classNames(
                  "w-100 outline-none border-0 px-12px bg-transparent text-white text-center",
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
