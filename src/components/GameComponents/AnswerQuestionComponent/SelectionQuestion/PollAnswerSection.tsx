import classNames from 'classnames'
import {FC, useEffect, useState} from 'react'
import {TQuestion} from '../../../../types/types'
import OptionAnswerSection from "./OptionAnswerSection";

type PollAnswerSectionProps = {
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

const PollAnswerSection: FC<PollAnswerSectionProps> = ({
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
    if (isTimeOut) return
    // Chọn và bỏ chọn câu hỏi
    const answers: Set<number> = answerSet
    answers.has(answerId) ? answers.delete(answerId) : answers.add(answerId)
    setAnswerSet(new Set(answers))
  }

  useEffect(() => {
    if (!isCounting && !isSubmitted && !isHost) {
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
        numOfVote={Array(option ? option.questionAnswers.length : 0 ).fill(0)}
        baseIcon="square">
      </OptionAnswerSection>
    </div>
  )
}

export default PollAnswerSection
