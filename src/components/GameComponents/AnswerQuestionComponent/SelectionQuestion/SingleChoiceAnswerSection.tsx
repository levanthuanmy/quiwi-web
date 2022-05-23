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
  socketSubmit: (answerSet: Set<number>) => void
  option?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isSubmitted: boolean
}

const SingleChoiceAnswerSection: FC<SingpleChoiceAnswerSectionProps> = ({
                                                                          className,
                                                                          socketSubmit,
                                                                          option,
                                                                          showAnswer,
                                                                          isHost,
                                                                          isSubmitted,
                                                                        }) => {

  const [answerSet, setAnswerSet] = useState<Set<number>>(new Set())
  const selectAnswer = (answerId: number) => {
    if (isSubmitted) return
    if (showAnswer) return
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

  return (
    <div className={classNames(className, '')}>
      <OptionAnswerSection
        handleSubmitAnswer={selectAnswer}
        className="flex-grow-1"
        option={option}
        selectedAnswers={answerSet}
        showAnswer={showAnswer}
        isHost={isHost}>

      </OptionAnswerSection>
    </div>
  )
}

export default SingleChoiceAnswerSection
