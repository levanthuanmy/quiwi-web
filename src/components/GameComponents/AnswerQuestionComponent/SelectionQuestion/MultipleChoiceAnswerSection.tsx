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
  isCounting: boolean
  isShowSkeleton: boolean
}

const MultipleChoiceAnswerSection: FC<MultipleChoiceAnswerSectionProps> = ({
                                                                             className,
                                                                             socketSubmit,
                                                                             option,
                                                                             showAnswer,
                                                                             isHost,
                                                                             isTimeOut,
                                                                             isSubmitted,
                                                                             isCounting,
                                                                             isShowSkeleton
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
    console.log("=>(MultipleChoiceAnswerSection.tsx:41) thien thien");
    if (!isCounting && !isSubmitted && !isHost) {
      console.log("=>(MultipleChoiceAnswerSection.tsx:41) thien thien 2 2 ");
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
        isShowSkeleton={isShowSkeleton}
        isHost={isHost}
        baseIcon="square">
      </OptionAnswerSection>
    </div>
  )
}

export default MultipleChoiceAnswerSection
