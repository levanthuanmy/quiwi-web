import classNames from 'classnames'
import {FC, useEffect, useState} from 'react'
import {Col, Row} from 'react-bootstrap'
import {TAnswer, TQuestion} from '../../../../types/types'
import styles from './SingleChoiceAnswerSection.module.css'
import OptionAnswerSection from "./OptionAnswerSection";
import {bool} from "yup";

type SingpleChoiceAnswerSectionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answer: any) => void
  option?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isSubmitted: boolean
  isTimeOut: boolean
  isCounting: boolean
  isShowSkeleton: boolean
}

const SingleChoiceAnswerSection: FC<SingpleChoiceAnswerSectionProps> = ({
                                                                          className,
                                                                          socketSubmit,
                                                                          option,
                                                                          showAnswer,
                                                                          isHost,
                                                                          isSubmitted,
                                                                          isTimeOut,
                                                                          isCounting,
                                                                          isShowSkeleton
                                                                        }) => {

  const [answerSet, setAnswerSet] = useState<Set<number>>(new Set())
  const selectAnswer = (answerId: number) => {
    if (isSubmitted) return
    if (isTimeOut) return
    // Chọn và bỏ chọn câu hỏi
    const answers: Set<number> = answerSet
    if (answers.has(answerId)) {
      answers.delete(answerId)
    } else {
      answers.clear()
      answers.add(answerId)
    }
    setAnswerSet(new Set(answers))
    socketSubmit(answerSet)
  }

  useEffect(() => {
    if (!isSubmitted && !isHost && isCounting) {
      socketSubmit(answerSet)
    }
  }, [isCounting]);

  return (
    <div className={classNames(className, '')}>
      <OptionAnswerSection
        didSelectAnswerId={selectAnswer}
        option={option}
        selectedAnswers={answerSet}
        showAnswer={showAnswer}
        isHost={isHost}
        isShowSkeleton={isShowSkeleton}
        baseIcon="circle">
      </OptionAnswerSection>
    </div>
  )
}

export default SingleChoiceAnswerSection
