import classNames from 'classnames'
import {FC, useEffect, useState} from 'react'
import {TQuestion} from '../../../../types/types'
import OptionAnswerSection from "./OptionAnswerSection";

type MultipleChoiceAnswerSectionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answer: any) => void
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
    console.log("=>(MultipleChoiceAnswerSection.tsx:33) isSubmitted", isSubmitted);
    if (isTimeOut) return
    // Chọn và bỏ chọn câu hỏi
    const answers: Set<number> = answerSet
    answers.has(answerId) ? answers.delete(answerId) : answers.add(answerId)
    setAnswerSet(new Set(answers))
  }

  useEffect(() => {
    if (isTimeOut && !isSubmitted && !isHost) {
      socketSubmit(answerSet)
    }
  }, [isTimeOut]);

  return (
    <div className={classNames(className, '')}>
      <OptionAnswerSection
        didSelectAnswerId={selectAnswer}
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
