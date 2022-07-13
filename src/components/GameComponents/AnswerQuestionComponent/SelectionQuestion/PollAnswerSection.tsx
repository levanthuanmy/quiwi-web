import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import { TQuestion } from '../../../../types/types'
import HostPollVisualize from './HostPollVisualize'
import OptionAnswerSection from './OptionAnswerSection'

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
  answersStatistic?: Record<string, number>
  isExam?: boolean
  initSelectedAnswer?: any
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
  isShowSkeleton,
  answersStatistic,
  isExam,
  initSelectedAnswer,
}) => {
  const [answerSet, setAnswerSet] = useState<Set<number>>(
    new Set(initSelectedAnswer)
  )
  const [numOfVote, setNumOfVote] = useState<number[]>([])
  const selectAnswer = (answerId: number) => {
    if (isExam) {
      // Mỹ Lê Exam
      const answers: Set<number> = answerSet
      answers.has(answerId) ? answers.delete(answerId) : answers.add(answerId)
      setAnswerSet(new Set(answers))
      socketSubmit(answerSet)
      return
    }
    if (isTimeOut) return
    // Chọn và bỏ chọn câu hỏi
    const answers: Set<number> = answerSet
    answers.has(answerId) ? answers.delete(answerId) : answers.add(answerId)
    setAnswerSet(new Set(answers))
    if (!isSubmitted && !isHost) {
      socketSubmit(answerSet)
    }
  }

  function getIndexFor(answerId: number): number {
    return answersStatistic ? answersStatistic[answerId] : 0
  }

  useEffect(() => {
    if (option) {
      let answerIds = option.questionAnswers.map((answer) =>
        answer.id ? getIndexFor(answer.id) : 0
      )
      setNumOfVote(answerIds)
    }
  }, [answersStatistic])

  useEffect(() => {
    if (!isCounting && !isSubmitted && !isHost) {
      socketSubmit(answerSet)
    }
  }, [isCounting])

  return (
    <div className={classNames(className, '')}>
      {isHost ? (
        <HostPollVisualize
          answersStatistic={answersStatistic}
          answers={option?.questionAnswers}
        />
      ) : (
        <OptionAnswerSection
          didSelectAnswerId={selectAnswer}
          option={option}
          selectedAnswers={answerSet}
          showAnswer={showAnswer}
          isShowSkeleton={isShowSkeleton}
          isHost={isHost}
          numOfVote={
            numOfVote.length > 0
              ? numOfVote
              : Array(option ? option.questionAnswers.length : 0).fill(0)
          }
          baseIcon="square"
        ></OptionAnswerSection>
      )}
    </div>
  )
}

export default PollAnswerSection
