import classNames from 'classnames'
import {FC, useEffect, useState} from 'react'
import { Col, Row } from 'react-bootstrap'
import { TAnswer, TQuestion } from '../../../../types/types'
import styles from './SingleChoiceAnswerSection.module.css'
import OptionAnswerSection from "./OptionAnswerSection";

type MultipleChoiceAnswerSectionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answerSet: Set<number>) => void
  option?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isTimeOut: boolean
  isSubmitted: boolean
}

const MultipleChoiceAnswerSection: FC<MultipleChoiceAnswerSectionProps> = ({
                                                                             className,
                                                                             socketSubmit,
                                                                             option,
                                                                             showAnswer,
                                                                             isHost,
                                                                             isTimeOut,
                                                                             isSubmitted,
}) => {
  const [answerSet, setAnswerSet] = useState<Set<number>>(new Set())

  const selectAnswer = (answerId: number) => {
    if (showAnswer) return
    // Chọn và bỏ chọn câu hỏi
    const answers: Set<number> = answerSet
    answers.has(answerId)  ? answers.delete(answerId) : answers.add(answerId)
    setAnswerSet(new Set(answers))
  }

  useEffect(() => {
  if (isTimeOut && !isSubmitted) {
      socketSubmit(answerSet)
  }
  }, [isTimeOut]);

  return (
    <div className={classNames(className, '')}>
      <OptionAnswerSection
        handleSubmitAnswer={selectAnswer}
        option={option}
        selectedAnswers={answerSet}
        showAnswer={showAnswer}
        isHost={isHost}
        baseIcon="square">
      </OptionAnswerSection>
    </div>
  )
}

export default MultipleChoiceAnswerSection
