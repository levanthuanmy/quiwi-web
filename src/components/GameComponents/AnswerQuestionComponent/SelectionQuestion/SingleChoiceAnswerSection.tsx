import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { TAnswer, TQuestion } from '../../../../types/types'
import styles from './SingleChoiceAnswerSection.module.css'
import OptionAnswerSection from './OptionAnswerSection'
import { bool } from 'yup'

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
  isExam?: boolean
  initSelectedAnswer?: any 
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
  isShowSkeleton,
  isExam,
  initSelectedAnswer
}) => {
  const [answerSet, setAnswerSet] = useState<Set<number>>(new Set(initSelectedAnswer))

  useEffect(() => {
    setAnswerSet(new Set(initSelectedAnswer))
  }, [initSelectedAnswer])

  const selectAnswer = (answerId: number) => {
    if (isExam) {
      // Mỹ Lê Exam
      const answers: Set<number> = answerSet
      if (answers.has(answerId)) {
        answers.delete(answerId)
      } else {
        answers.clear()
        answers.add(answerId)
      }
      setAnswerSet(new Set(answers))
      socketSubmit(answers)
      return
    }

    if (isHost) return
    if (isSubmitted || !isCounting) return
    // Chọn và bỏ chọn câu hỏi
    const answers: Set<number> = answerSet
    if (answers.has(answerId)) {
      answers.delete(answerId)
    } else {
      answers.clear()
      answers.add(answerId)
    }
    setAnswerSet(new Set(answers))
  }

  useEffect(() => {
    if (!isCounting && !isSubmitted && !isHost) {
      socketSubmit(answerSet)
    }
  }, [isCounting])

  return (
    <div className={classNames(className, '')}>
      <OptionAnswerSection
        didSelectAnswerId={selectAnswer}
        option={option}
        selectedAnswers={answerSet}
        showAnswer={showAnswer}
        isHost={isHost}
        isShowSkeleton={isShowSkeleton}
        baseIcon="circle"
      ></OptionAnswerSection>
    </div>
  )
}

export default SingleChoiceAnswerSection
