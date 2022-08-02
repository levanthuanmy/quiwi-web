import React, { FC, useEffect, useRef, useState } from 'react'
import { TAnswer, TQuestion } from '../../../../types/types'
import styles from './TextQuestion.module.css'
import classNames from 'classnames'
import { Set } from 'immutable'
import TextAnswerList from './TextAnswerList'
import { bool } from 'yup'

type TextQuestionProps = {
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
const TextQuestion: FC<TextQuestionProps> = ({
  className,
  socketSubmit,
  question,
  showAnswer,
  isHost,
  isTimeOut,
  isSubmitted,
  isCounting,
  isShowSkeleton,
  isExam,
  initSelectedAnswer,
}) => {
  const [answerText, setAnswerText] = useState<string | null>(
    initSelectedAnswer
  )

  useEffect(() => {
    setAnswerText(initSelectedAnswer)
  }, [initSelectedAnswer])

  const [isCorrect, setIsCorrect] = useState<boolean>(false)

  useEffect(() => {
    if (isShowSkeleton) {
      setAnswerText(null)
    }
  }, [isShowSkeleton])


  useEffect(() => {
    if (!isCounting && !isSubmitted && !isHost) {
      socketSubmit(answerText ?? '')
    }
  }, [isCounting])

  useEffect(() => {
    if (showAnswer) setIsCorrect(checkAnswer())
  }, [showAnswer])

  const concatAnswerList = (): string[] => {
    if (!question) return []
    return question?.questionAnswers.map((answer: TAnswer) => answer.answer)
  }

  // factory + strategy please`
  const getQuestionTypeForHost = (): string => {
    if (question && question.matcher)
      switch (question.matcher) {
        case '10EXC':
          return 'Câu trả lời chính xác gồm:'
        case '20CNT':
          return 'Câu trả lời phải chứa:'
        default:
          return 'Câu trả lời gồm:'
      }
    return 'Câu trả lời gồm:'
  }

  const getQuestionTypeForPlayer = (correct: boolean): string => {
    let prefix = correct ? 'ĐÚNG' : 'SAI'
    let postfix = ''
    if (question && question.matcher)
      switch (question.matcher) {
        case '10EXC':
          postfix = correct
            ? ', câu trả lời của bạn giống với:'
            : ', câu trả lời chính xác bao gồm:'
          break
        case '20CNT':
          postfix = correct
            ? ', câu trả lời của bạn có chứa:'
            : ', câu trả lời chính xác phải chứa:'
          break
        default:
          postfix = correct
            ? ', câu trả lời gồm:'
            : ', câu trả lời chính xác gồm:'
          break
      }
    return prefix + postfix
  }

  const getSuggestType = (): string => {
    if (question && question.matcher)
      switch (question.matcher) {
        case '10EXC':
          return 'Câu trả lời chính xác được tính điểm!'
        case '20CNT':
          return 'Câu trả lời chỉ cần chứa từ khoá đúng'
        default:
          return 'Câu hỏi tự luận'
      }
    return 'Câu hỏi tự luận'
  }

  const checkAnswer = (): boolean => {
    if (!isHost) {
      if (question && question.matcher)
        if (answerText && answerText.length > 0)
          switch (question.matcher) {
            case '10EXC':
              // console.log("=>(TextQuestion.tsx:100) exc");
              for (const answer of question.questionAnswers) {
                if (answer.answer == answerText) {
                  return true
                }
              }
              break
            case '20CNT':
              // console.log("=>(TextQuestion.tsx:100) cnt");
              for (const answer of question.questionAnswers) {
                if (answerText?.includes(answer.answer)) {
                  return true
                }
              }
              break
            default:
              return false
          }
      return false
    }
    // setIsCorrect(true)
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
        {showAnswer && (
          <div className={`d-flex ${styles.titleGroup}`}>
            <div className={`ps-12px flex-grow-1 ${styles.questionType}`}>
              {isHost
                ? getQuestionTypeForHost()
                : getQuestionTypeForPlayer(isCorrect)}
            </div>
            {!isHost && (
              <div className={`d-flex align-items-center`}>
                <i
                  className={`fw-bold bi 
                          ${
                            isCorrect
                              ? 'bi-check-circle-fill'
                              : 'bi-x-circle-fill'
                          } 
                          ${styles.icon}`}
                  style={{
                    color: isCorrect ? '#00a991' : '#e2352a',
                    transition: 'all .5s ease',
                    WebkitTransition: 'all .5s ease',
                    MozTransition: 'all .5s ease',
                  }}
                ></i>
              </div>
            )}
          </div>
        )}

        {!(isHost && !showAnswer) && (
          <TextAnswerList
            className={styles.showAnswer}
            answers={showAnswer ? concatAnswerList() : [getSuggestType()]}
          />
        )}

        {!isHost && (
          <textarea
            autoFocus={true}
            placeholder={
              showAnswer
                ? 'Hết giờ, bạn đã không trả lời câu hỏi này!'
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
            value={answerText ?? ''}
          />
        )}

        {isHost &&
          (showAnswer ? (
            <div></div>
          ) : (
            <div
              className={
                'h-100 w-100 d-flex flex-column justify-content-center'
              }
            >
              <div
                className={classNames(
                  'w-100 fw-bold fs-1 outline-none border-0 px-12px  text-white text-center customScrollbar'
                )}
              >
                {getSuggestType()}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default TextQuestion
