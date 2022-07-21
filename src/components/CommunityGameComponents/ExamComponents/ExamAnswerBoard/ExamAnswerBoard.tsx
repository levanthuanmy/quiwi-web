/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import _ from 'lodash'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import { ColorHex, CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useMyleGameSession } from '../../../../hooks/usePracticeGameSession/useMyleGameSession'
import useScreenSize from '../../../../hooks/useScreenSize/useScreenSize'
import { useTimer } from '../../../../hooks/useTimer/useTimer'
import FullScreenLoader from '../../../FullScreenLoader/FullScreenLoader'
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
  const myleGameSession = useMyleGameSession()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const user = myleGameSession.gameSession?.host
  const quiz = myleGameSession.gameSession?.quiz
  const questions = quiz?.questions
  const questionsLength = questions?.length ?? 0
  const currentQuestion = _.get(questions, currentQuestionIndex)
  let answerSectionFactory: AnswerSectionFactory
  const timer = useTimer()
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]) // answer each question of user that will be submitted to server
  const timeEnd = myleGameSession.examDeadline?.timeEnd
  const { fromMedium } = useScreenSize()

  // const [duration, setDuration] = useState<number>()
  useEffect(() => {
    if (timeEnd) {
      const currentDuration = timeEnd - new Date().getTime()
      // setDuration(currentDuration)
      // timer.setDefaultDuration(currentDuration)

      if (!timer.isCounting) {
        timer.startCounting(currentDuration / 1000)
      }
      // timer.startCounting(currentDuration)
    }
  }, [timeEnd])

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
    myleGameSession.gameSkEmit('submit-answer', {
      invitationCode: myleGameSession.gameSession?.invitationCode,
      answers: userAnswers,
    })
  }

  useEffect(() => {
    const configTimerForExamMode = () => {
      timer.stopCounting(true)
      timer.stopCountingSound(true)
      timer.setIsShowSkeleton(false)
      timer.setIsSubmittable(true)
      timer.setIsCounting(false)
      timer.setIsShowAnswer(false)
    }

    configTimerForExamMode()
    return () => configTimerForExamMode()
  }, [])

  useEffect(() => {
    init()
  }, [questionsLength])

  const isAnswerQuestionAtIndex = (index: number): boolean => {
    if (userAnswers[index].answer !== '') {
      return true
    }
    return userAnswers[index].answerIds.length > 0
  }

  const countAnswer = useMemo(() => {
    let count = 0
    for (let index = 0; index < userAnswers.length; index++) {
      if (isAnswerQuestionAtIndex(index)) {
        count++
      }
    }

    return count
  }, [userAnswers])

  return timer.duration !== undefined ? (
    <>
      <div
        className={classNames(
          'd-flex flex-column position-relative flex-grow-1'
        )}
        style={{ overflowX: 'hidden' }}
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
              <div className="fw-medium text-primary">
                Số câu: {questionsLength}
              </div>
              <div className="fw-medium text-primary">
                Đã trả lời: {countAnswer}
              </div>
              <div className="fw-medium text-secondary">
                Chưa trả lời: {questionsLength - countAnswer}
              </div>
            </div>
          </div>
        }

        {/* hình ảnh */}
        <Row className="bg-white w-100 m-0 p-0">
          {/* small screen */}
          <Col
            xs="12"
            className={classNames('align-self-center', {
              'd-block': !fromMedium,
              'd-none': fromMedium,
            })}
          >
            Thời gian còn lại
            {Math.floor(timer.countDown / 60)} : {timer.countDown % 60}
          </Col>

          <Col
            xs="auto"
            className={classNames('align-self-center', {
              'd-block': fromMedium,
              'd-none': !fromMedium,
            })}
          >
            <CountdownCircleTimer
              strokeLinecap="square"
              isPlaying={true}
              duration={timer.duration}
              size={160}
              strokeWidth={18}
              onComplete={() => console.log('Het gio')}
              colors={timerColor}
              colorsTime={[
                6, 5, 4, 3, 2.5, 2, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 0,
              ]}
            >
              {() => (
                <div className="fw-medium fs-24px text-primary">
                  Câu {currentQuestionIndex + 1}/
                  <span className="text-secondary fs-20px">
                    {questionsLength}
                  </span>
                </div>
              )}
            </CountdownCircleTimer>
          </Col>

          <Col className="text-center">
            <Image
              src={
                currentQuestion?.media || '/assets/default-question-image.png'
              }
              height="260px"
              width="auto"
              alt=""
              className="mw-100 object-fit-scale-down"
            />
          </Col>

          <Col
            xs="auto"
            className={classNames('align-self-center', {
              'd-block': fromMedium,
              'd-none': !fromMedium,
            })}
          >
            <CountdownCircleTimer
              strokeLinecap="square"
              isPlaying={true}
              duration={timer.duration}
              size={160}
              strokeWidth={18}
              onComplete={() => console.log('Het gio')}
              colors={timerColor}
              colorsTime={[
                6, 5, 4, 3, 2.5, 2, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 0,
              ]}
            >
              {({ remainingTime }) => (
                <FormatTime remainingTime={remainingTime} />
              )}
            </CountdownCircleTimer>
          </Col>
        </Row>

        <div
          className={classNames(
            'bg-white p-3 pb-0'
            // styles.questionTitle,
            // { 'rounded-10px': fromMedium }
          )}
        >
          <div className="h4">Câu hỏi:</div>
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

        <div style={{ marginLeft: -5, marginRight: -5 }}>
          {renderAnswersSection()}
        </div>

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
  ) : (
    <FullScreenLoader isLoading />
  )
}

export default ExamAnswerBoard

// eslint-disable-next-line react/display-name
const FormatTime = memo(({ remainingTime }: { remainingTime: number }) => {
  const { minutes, seconds } = useMemo(() => {
    return {
      minutes: Math.floor(remainingTime / 60),
      seconds: Math.ceil(remainingTime % 60),
    }
  }, [remainingTime])
  return (
    <div className="text-center user-select-none">
      {remainingTime > 0 ? (
        <>
          <div className="text-black fs-20px fw-medium">Còn lại</div>

          <div className="text-black fs-32px fw-bold">{`${minutes} : ${seconds}`}</div>
        </>
      ) : (
        <div className="text-black fs-32px fw-bold">Hết giờ!</div>
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
