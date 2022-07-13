/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import _ from 'lodash'
import { FC, memo, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { ColorHex, CountdownCircleTimer } from 'react-countdown-circle-timer'
import { usePracticeGameSession } from '../../../../hooks/usePracticeGameSession/usePracticeGameSession'
import { useTimer } from '../../../../hooks/useTimer/useTimer'
import {
  AnswerSectionFactory,
  QuestionTypeDescription,
} from '../../../GameComponents/AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import MyButton from '../../../MyButton/MyButton'
import AnswerSheet from '../AnswerSheet/AnswerSheet'
import styles from './ExamAnswerBoard.module.css'

export type UserAnswer = {
  answer: string
  answerIds: number[]
}
const ExamAnswerBoard: FC = () => {
  const { gameSession, gameSkEmit } = usePracticeGameSession()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const user = gameSession?.host
  const quiz = gameSession?.quiz
  const questions = quiz?.questions
  const questionsLength = questions?.length ?? 0
  const currentQuestion = _.get(questions, currentQuestionIndex)
  let answerSectionFactory: AnswerSectionFactory
  const timer = useTimer()
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]) // answer each question of user that will be submitted to server
  console.log('userAnswers', userAnswers)

  const init = () => {
    setUserAnswers(Array(questionsLength).fill({ answerIds: [], answer: '' }))
  }

  const renderAnswersSection = () => {
    if (!currentQuestion) return
    if (!answerSectionFactory)
      answerSectionFactory = new AnswerSectionFactory(
        false,
        styles.answerLayout,
        true
      )
    return answerSectionFactory.initAnswerSectionForType(
      currentQuestion.type,
      currentQuestion,
      (answer) => {
        updateAnswerAtIndex(currentQuestionIndex, answer)
      },
      undefined,
      getUserAnswersAtIndex(currentQuestionIndex)
      // answersStatistic
    )
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => prev - 1)
  }

  const updateAnswerAtIndex = (index: number, answer: any) => {
    if (!userAnswers) return

    setUserAnswers((prev) => {
      const newUserAnswers = [...prev]

      const typeOfAnswer = typeof answer
      if (typeOfAnswer === 'string') {
        newUserAnswers[index] = {
          answer: answer,
          answerIds: [...newUserAnswers[index].answerIds],
        }
      }
      if (typeOfAnswer === 'object') {
        newUserAnswers[index] = {
          answer: newUserAnswers[index].answer,
          answerIds: [...answer],
        }
      }
      return newUserAnswers
    })
  }

  const getUserAnswersAtIndex = (index: number) => {
    if (!userAnswers || !userAnswers[index]) return
    if (userAnswers[index].answer !== '') {
      return userAnswers[index].answer
    }
    return userAnswers[index].answerIds
  }

  const submit = () => {
    gameSkEmit('submit-answer', {
      invitationCode: gameSession?.invitationCode,
      answers: userAnswers,
    })
  }

  useEffect(() => {
    const configTimerForExamMode = () => {
      timer.setIsShowSkeleton(false)
      timer.setIsSubmittable(true)
      timer.setIsCounting(true)
      timer.setIsShowAnswer(false)
    }

    configTimerForExamMode()
  }, [timer])

  useEffect(() => {
    init()
  }, [questionsLength])

  return (
    <>
      <div
        className={classNames(
          'd-flex flex-column position-relative flex-grow-1'
        )}
      >
        {
          // currentQuestion?.question &&
          <div
            className={classNames(
              'd-flex flex-column bg-dark bg-opacity-50 rounded-10px shadow mb-2'
            )}
          >
            <div className="pt-2 px-2 d-flex align-items-center gap-3">
              <Image
                src={user?.avatar ?? '/assets/default-avatar.png'}
                width={40}
                height={40}
                className="rounded-circle"
                alt=""
              />
              <div className="fw-medium fs-20px text-white">
                {user?.name ?? 'Ẩn danh'}
              </div>
            </div>
            <div className="px-2 pb-2 text-white d-flex gap-3 align-items-center justify-content-between">
              {/*câu hỏi hiện tại*/}
              <div className="fw-medium fs-32px text-primary">
                {currentQuestionIndex + 1}/
                <span className="text-secondary fs-24px">
                  {questionsLength}
                </span>
              </div>
              <div
                id="questionProgressBar"
                className="flex-grow-1 bg-secondary rounded-pill"
                style={{ height: 6 }}
              >
                <div
                  className="bg-primary h-100 rounded-pill transition-all-150ms position-relative"
                  style={{
                    width: `${Math.floor(
                      ((currentQuestionIndex + 1) * 100) / questionsLength
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        }

        <CountdownCircleTimer
          isPlaying={true}
          duration={330}
          size={180}
          strokeWidth={18}
          onComplete={() => alert('Het gio')}
          colors={timerColor}
          colorsTime={[6, 5, 4, 3, 2.5, 2, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 0]}
        >
          {({ remainingTime }) => <FormatTime remainingTime={remainingTime} />}
        </CountdownCircleTimer>
        {/* hình ảnh */}
        <div
          style={{ height: 260 }}
          className="bg-white w-100 d-flex justify-content-center"
        >
          <Image
            src={currentQuestion?.media ?? '/assets/default-question-image.png'}
            height="100%"
            width="auto"
            alt=""
            className="mw-100 object-fit-cover"
          />
        </div>
        <div
          className={classNames(
            'bg-white'
            // styles.questionTitle,
            // { 'rounded-10px': fromMedium }
          )}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: currentQuestion?.question ?? '',
            }}
          />
        </div>
        {currentQuestion && (
          <div
            className={classNames(
              'noselect px-2 py-2 fs-4 fw-bold text-white mb-2 bg-dark bg-opacity-50 d-flex justify-content-between align-items-center'
              // { 'rounded-10px': fromMedium }
            )}
          >
            <div className={''}>
              <i
                className={classNames(
                  'fs-20px text-white me-2',
                  QuestionTypeDescription[currentQuestion.type].icon
                )}
              />
              {QuestionTypeDescription[currentQuestion.type].title}
            </div>
          </div>
        )}

        {renderAnswersSection()}

        <div className="d-flex gap-2">
          <MyButton
            className="text-white"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Câu trước
          </MyButton>
          <MyButton
            className="text-white"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questionsLength - 1}
          >
            Câu sau
          </MyButton>
          <MyButton className="text-white" onClick={submit}>
            Nộp bài
          </MyButton>
        </div>
        {/* {renderHostControlSystem()} */}
        {/* {getEndGameModal()} */}
      </div>
      <AnswerSheet
        userAnswers={userAnswers}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        currentQuestionIndex={currentQuestionIndex}
        submit={submit}
      />
    </>
  )
}

export default ExamAnswerBoard

// eslint-disable-next-line react/display-name
const FormatTime = memo(({ remainingTime }: { remainingTime: number }) => {
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  return (
    <div className="text-center user-select-none">
      {remainingTime >= 0 ? (
        <>
          <div className="text-white fs-20px fw-medium">Còn lại</div>

          <div className="text-white fs-32px fw-bold">{`${minutes} : ${seconds}`}</div>
        </>
      ) : (
        <div className={classNames(styles.valueDanger)}>Hết giờ!</div>
      )}
    </div>
  )
})

const timerColor: { 0: ColorHex } & { 1: ColorHex } & ColorHex[] = [
  '#009883',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#ffc107',
  '#dc3545',
  '#A30000',
]
