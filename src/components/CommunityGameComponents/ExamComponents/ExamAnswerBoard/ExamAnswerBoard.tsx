/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import _ from 'lodash'
import React, {FC, memo, useEffect, useMemo, useState} from 'react'
import {Col, Image, Row} from 'react-bootstrap'
import {ColorHex, CountdownCircleTimer} from 'react-countdown-circle-timer'
import {useMyleGameSession} from '../../../../hooks/usePracticeGameSession/useMyleGameSession'
import useScreenSize from '../../../../hooks/useScreenSize/useScreenSize'
import {useTimer} from '../../../../hooks/useTimer/useTimer'
import {
  AnswerSectionFactory,
  QuestionTypeDescription,
} from '../../../GameComponents/AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import MyButton from '../../../MyButton/MyButton'
import AnswerSheet from '../AnswerSheet/AnswerSheet'
import styles from './ExamAnswerBoard.module.css'
import {TDetailPlayer, TQuestion, TViewResult} from "../../../../types/types";
import LoadingBoard from "../../../GameComponents/LoadingBoard/LoadingBoard";
import CommunityEndGameBoard from "../../CommunityEndGameBoard/CommunityEndGameBoard";
import {useRouter} from "next/router";
import {UserAndProcessInfo} from "../../../GameComponents/UtilComponents/UserAndProcessInfo";
import {QuestionMedia} from "../../../GameComponents/QuestionMedia/QuestionMedia";

export type UserAnswer = {
  answer: string
  answerIds: number[]
}

type ExamAnswerBoardProps = {
  className?: string
  isShowHostControl: boolean
  setIsShowHostControl: React.Dispatch<React.SetStateAction<boolean>>
}

const ExamAnswerBoard: FC<ExamAnswerBoardProps> = ({
                                                     className,
                                                     isShowHostControl,
                                                     setIsShowHostControl,
                                                   }) => {
  const gameManager = useMyleGameSession()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  let answerSectionFactory: AnswerSectionFactory
  const timer = useTimer()

  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]) // answer each question of user that will be submitted to server

  const router = useRouter()
  const {fromMedium} = useScreenSize()
  const [loading, setLoading] = useState<string | null>(null)
  const [viewResultData, setViewResultData] = useState<TViewResult>()
  const [isShowEndGame, setIsShowEndGame] = useState<boolean>(false)
  const [showEndGame, setShowEndGame] = useState<boolean>(false)

  useEffect(() => {
    handleSocket()
    setCurrentQuestionIndex(gameManager?.currentQuestion?.orderPosition ?? 0)
  }, [])

  useEffect(() => {
    const question = gameManager.getQuestionWithID(currentQuestionIndex)
    if (question) {
      gameManager.currentQuestion = question
    }

  }, [currentQuestionIndex])

  const handleSocket = () => {
    if (!gameManager.gameSocket) return

    gameManager.gameSkOnce('game-started', (data) => {
      gameManager.deadline = data.deadline
      setUserAnswers(Array(gameManager.gameSession?.quiz.questions.length).fill({answerIds: [], answer: ''}))
      if (gameManager.deadline) {
        const duration = gameManager.deadline?.timeEnd - gameManager.deadline?.timeStart;
        timer.startCounting(duration / 1000 ?? 0)
        setLoading(null)
      } else {
        setLoading("Load game l???i, xin vui l??ng tho??t ph??ng!")
      }
    })


    gameManager.gameSkOn('loading', (data) => {
      if (data.loading == 4) {
        timer.setIsShowSkeleton(true)
        gameManager.deadline = data.game.deadline
        if (gameManager.deadline) {
          const duration = gameManager.deadline?.timeEnd - gameManager.deadline?.timeStart;
          timer.setDefaultDuration(duration / 1000)
        }
        setLoading('Chu???n b???!')
        gameManager.submittedAnswer = null
      } else if (data?.loading) {
        setLoading(data.loading)
      }
    })

    gameManager.gameSkOn('game-ended', (data: TViewResult) => {
      timer.countDown >= 0 ? setLoading('???? tr??? l???i!') : setLoading('H???t gi???!')
      setTimeout(() => {
        setLoading(null)
      }, 1000)
      timer.stopCounting(true)
      timer.stopCountingSound(true)
      setViewResultData(data)

      setShowEndGame(true)
    })

    gameManager.gameSkOn('view-result', (data: TViewResult) => {
      gameManager.player = (data?.player as TDetailPlayer) ?? null
    })

  }

  const renderAnswersSection = () => {
    if (!gameManager.currentQuestion) return
    if (!answerSectionFactory)
      answerSectionFactory = new AnswerSectionFactory(
        false,
        styles.answerLayout,
        true
      )
    return answerSectionFactory.initAnswerSectionForType(
      gameManager.currentQuestion.type,
      gameManager.currentQuestion,
      (answer) => {
        if (gameManager.currentQuestion)
          updateAnswerAtIndex(gameManager.currentQuestion.orderPosition, answer)
      },
      undefined,
      getUserAnswersAtIndex(gameManager.currentQuestion.orderPosition)
      // answersStatistic
    )
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => prev - 1)
  }

  const onOutRoomInEndGameBoard = () => {
    gameManager.clearGameSession()
    router.push('/home')
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
    gameManager.gameSkEmit('submit-answer', {
      invitationCode: gameManager.gameSession?.invitationCode,
      answers: userAnswers,
    })
    if (gameManager.gameSession && gameManager.gameSocket && gameManager.isHost) {
      const msg = {invitationCode: gameManager.gameSession.invitationCode}
      gameManager.gameSkEmit('game-ended', msg)
    }
  }

  // useEffect(() => {
  //   const configTimerForExamMode = () => {
  //     timer.stopCounting(true)
  //     timer.stopCountingSound(true)
  //     timer.setIsShowSkeleton(false)
  //     timer.setIsSubmittable(true)
  //     timer.setIsCounting(false)
  //     timer.setIsShowAnswer(false)
  //   }
  //
  //   configTimerForExamMode()
  //   return () => configTimerForExamMode()
  // }, [])

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

  return !showEndGame ? (
    <>
      <div
        className={classNames(
          'd-flex flex-column position-relative',
          className
        )}
        style={{overflowX: 'hidden'}}
      >
        {gameManager.currentQuestion &&
            <UserAndProcessInfo
                gameManager={gameManager}
                viewResultData={viewResultData}
            />
        }

        {/* h??nh ???nh */}
        {/*<Row className="bg-white w-100 m-0 p-0">*/}
        {/*  /!* small screen *!/*/}
        {/*  <Col*/}
        {/*    xs="12"*/}
        {/*    className={classNames('align-self-center', {*/}
        {/*      'd-block': !fromMedium,*/}
        {/*      'd-none': fromMedium,*/}
        {/*    })}*/}
        {/*  >*/}
        {/*    Th???i gian c??n l???i*/}
        {/*    {Math.floor(timer.countDown / 60)} : {timer.countDown % 60}*/}
        {/*  </Col>*/}

        {/*  <Col*/}
        {/*    xs="auto"*/}
        {/*    className={classNames('align-self-center', {*/}
        {/*      'd-block': fromMedium,*/}
        {/*      'd-none': !fromMedium,*/}
        {/*    })}*/}
        {/*  >*/}
        {/*    <CountdownCircleTimer*/}
        {/*      strokeLinecap="square"*/}
        {/*      isPlaying={true}*/}
        {/*      duration={timer.duration}*/}
        {/*      size={160}*/}
        {/*      strokeWidth={18}*/}
        {/*      onComplete={() => console.log('Het gio')}*/}
        {/*      colors={timerColor}*/}
        {/*      colorsTime={[*/}
        {/*        6, 5, 4, 3, 2.5, 2, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 0,*/}
        {/*      ]}*/}
        {/*    >*/}
        {/*      {() => (*/}
        {/*        <div className="fw-medium fs-24px text-primary">*/}
        {/*          C??u {currentQuestionIndex + 1}/*/}
        {/*          <span className="text-secondary fs-20px">*/}
        {/*            {questionsLength}*/}
        {/*          </span>*/}
        {/*        </div>*/}
        {/*      )}*/}
        {/*    </CountdownCircleTimer>*/}
        {/*  </Col>*/}

        {/*  <Col className="text-center">*/}
        {/*    <Image*/}
        {/*      src={*/}
        {/*        currentQuestion?.media || '/assets/default-question-image.png'*/}
        {/*      }*/}
        {/*      height="260px"*/}
        {/*      width="auto"*/}
        {/*      alt=""*/}
        {/*      className="mw-100 object-fit-scale-down"*/}
        {/*    />*/}
        {/*  </Col>*/}

        {/*  <Col*/}
        {/*    xs="auto"*/}
        {/*    className={classNames('align-self-center', {*/}
        {/*      'd-block': fromMedium,*/}
        {/*      'd-none': !fromMedium,*/}
        {/*    })}*/}
        {/*  >*/}
        {/*    <CountdownCircleTimer*/}
        {/*      strokeLinecap="square"*/}
        {/*      isPlaying={true}*/}
        {/*      duration={timer.duration}*/}
        {/*      size={160}*/}
        {/*      strokeWidth={18}*/}
        {/*      onComplete={() => console.log('Het gio')}*/}
        {/*      colors={timerColor}*/}
        {/*      colorsTime={[*/}
        {/*        6, 5, 4, 3, 2.5, 2, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 0,*/}
        {/*      ]}*/}
        {/*    >*/}
        {/*      {({remainingTime}) => (*/}
        {/*        <FormatTime remainingTime={remainingTime}/>*/}
        {/*      )}*/}
        {/*    </CountdownCircleTimer>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        {gameManager.currentQuestion &&
            <QuestionMedia
                media={gameManager.currentQuestion.media ?? null}
                numStreak={0}
                numSubmission={0}
                key={gameManager.currentQuestion.orderPosition}
                className={styles.questionMedia}
                questionTitle={gameManager.currentQuestion?.question ?? ''}
                endTime={gameManager.deadline?.timeEnd}
            />
        }

        <div style={{marginLeft: -5, marginRight: -5}}>
          {renderAnswersSection()}
        </div>
        {gameManager.gameSession &&
            <div className="d-flex gap-2">
                <MyButton
                    className="text-white"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    C??u tr?????c
                </MyButton>
                <MyButton
                    className="text-white"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === (gameManager.gameSession.quiz.questions.length - 1)}
                >
                    C??u sau
                </MyButton>
                <MyButton className="text-white" onClick={submit}>
                    N???p b??i
                </MyButton>
            </div>
        }
      </div>
      <AnswerSheet
        userAnswers={userAnswers}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        currentQuestionIndex={currentQuestionIndex}
        submit={submit}
      />
      <LoadingBoard loadingTitle={loading}/>
    </>
  ) : (
    <CommunityEndGameBoard
      gameSessionHook={gameManager}
      onOutRoomInEndGameBoard={onOutRoomInEndGameBoard}
      showEndGame={showEndGame}
    />
    // <FullScreenLoader isLoading />
  )
}

export default ExamAnswerBoard

// eslint-disable-next-line react/display-name
const FormatTime = memo(({remainingTime}: { remainingTime: number }) => {
  const {minutes, seconds} = useMemo(() => {
    return {
      minutes: Math.floor(remainingTime / 60),
      seconds: Math.ceil(remainingTime % 60),
    }
  }, [remainingTime])
  return (
    <div className="text-center user-select-none">
      {remainingTime > 0 ? (
        <>
          <div className="text-black fs-20px fw-medium">C??n l???i</div>

          <div className="text-black fs-32px fw-bold">{`${minutes} : ${seconds}`}</div>
        </>
      ) : (
        <div className="text-black fs-32px fw-bold">H???t gi???!</div>
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
