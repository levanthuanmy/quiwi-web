import React, { FC, useEffect, useRef, useState } from 'react'
import { TAnswer, TQuestion } from '../../../../types/types'
import styles from './PollQuestion.module.css'
import classNames from 'classnames'
import { Set } from 'immutable'
import PollAnswerList from './PollAnswerList'
import { bool } from 'yup'

type EssayQuestionProps = {
  className?: string
  // gửi socket khi đã chọn kết quả cuối cùng
  socketSubmit: (answer: any) => void
  question?: TQuestion
  showAnswer: boolean
  isHost: boolean
  isTimeOut: boolean
  isSubmitted: boolean
  isCounting: boolean
  isShowSkeleton: boolean
  isExam?: boolean
  initSelectedAnswer?: any
}
const correctColor = '#0082BE'
const incorrectColor = '#cccccc'
const EssayQuestion: FC<EssayQuestionProps> = ({
  className,
  socketSubmit,
  question,
  showAnswer,
  isHost,
  isTimeOut,
  isSubmitted,
  isCounting,
  isExam,
  initSelectedAnswer,
}) => {
  const [answerText, setAnswerText] = useState<string | null>(
    initSelectedAnswer
  )
  const [isCorrect, setIsCorrect] = useState<boolean>(false)

  useEffect(() => {
    if (!isCounting && !isSubmitted && !isHost) {
      socketSubmit(answerText ?? '')
    }
  }, [isCounting])

  useEffect(() => {
    if (showAnswer) setIsCorrect(checkAnswer())
  }, [showAnswer])

  const getSuggestType = (): string => {
    return isCorrect && !isHost
      ? 'Câu hỏi của bạn đã được ghi nhận'
      : 'Câu hỏi tự do'
  }

  const checkAnswer = (): boolean => {
    if (isTimeOut && !isHost) {
      if (answerText && answerText.length > 0) {
        setIsCorrect(true)
        return true
      }
      setIsCorrect(false)
      return false
    }
    return true
  }

  const getBackgroundColorForAnswer = (): string => {
    if (showAnswer && !isHost) {
      return isCorrect ? correctColor : incorrectColor
    }
    return correctColor
  }

  return (
    <div
      style={{
        background: getBackgroundColorForAnswer(),
        transition: 'all .5s ease',
        WebkitTransition: 'all .5s ease',
        MozTransition: 'all .5s ease',
      }}
      className={classNames(
        'd-flex flex-column align-items-center justify-content-center',
        styles.selectionBox
      )}
    >
      <div
        className={`d-flex flex-column justify-content-around h-100 w-100 ${styles.selectionInner}`}
      >
        <div
          className={'h-100 w-100 d-flex flex-column justify-content-center'}
        >
          <div
            className={classNames(
              'w-100 fw-bold fs-1 outline-none border-0 px-12px  text-white text-center customScrollbar'
            )}
          >
            {getSuggestType()}
          </div>
        </div>

        {!isHost && (
          <textarea
            autoFocus={true}
            placeholder={
              showAnswer
                ? 'Bạn đã bỏ qua câu hỏi này!'
                : 'Nhập câu trả lời của bạn'
            }
            disabled={isTimeOut || isSubmitted}
            maxLength={120}
            className={classNames(
              'w-100 text-center flex-grow-1 customScrollbar',
              styles.answerInput
            )}
            onChange={(t) => {
              setAnswerText(t.target.value)
              if (isExam) {
                socketSubmit(t.target.value ?? '')
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default EssayQuestion
