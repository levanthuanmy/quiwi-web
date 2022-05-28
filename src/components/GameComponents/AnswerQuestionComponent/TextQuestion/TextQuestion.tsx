import React, {FC, useEffect, useRef, useState} from 'react'
import {TAnswer, TQuestion} from "../../../../types/types";
import styles from "./TextQuestion.module.css"
import classNames from "classnames";
import {Set} from "immutable";


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

  const concatAnswerList = (): string => {
    if (!option) return "Không có câu trả lời!"
    const answerList = option?.questionAnswers.map((answer: TAnswer) => answer.answer)
    return answerList.join(`  -  `)
  }

  return (
    <>
      <div className={classNames(className, 'position-relative')}>
        <div
          style={{
            background: "#0082BE",
            transition: "all .5s ease",
            WebkitTransition: "all .5s ease",
            MozTransition: "all .5s ease"
          }}
          className={classNames(
            'd-flex align-items-center w-100 gap-3',
            styles.selectionBox,
          )}
        >
          <div className={"w-100 h-100 align-items-center d-flex"}>
            {!isHost
              && <textarea
                    autoFocus
                    disabled={(isTimeOut || isSubmitted)}
                    className={classNames(
                      "w-100 outline-none border-0 px-12px bg-transparent text-white text-center",
                      styles.answerInput,
                    )}
                    onChange={(t) => setAnswerText(t.target.value)}
                />
            }
            {/*{showAnswer*/}
            {/*  && <div*/}
            {/*        className={classNames(*/}
            {/*          "w-100 outline-none border-0 px-12px bg-transparent text-white text-center",*/}
            {/*          styles.answerInput,*/}
            {/*        )}>*/}
            {/*    {concatAnswerList()}*/}
            {/*    </div>*/}
            {/*}*/}
            {showAnswer && isHost &&
                <div
                    className={classNames(
                      "w-100 outline-none border-0 px-12px bg-transparent text-white text-center",
                      styles.answerInput,
                    )}>
                  {concatAnswerList()}
                </div>
            }
          </div>

        </div>
      </div>
    </>
  )
}

export default TextQuestion
