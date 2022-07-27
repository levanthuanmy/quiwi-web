import {default as classNames, default as cn} from 'classnames'
import {useRouter} from 'next/router'
import React, {FC, memo, useContext, useEffect, useRef, useState,} from 'react'
import {Fade} from 'react-bootstrap'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import {useSound} from '../../../hooks/useSound/useSound'
import {useTimer} from '../../../hooks/useTimer/useTimer'
import {TQuestion, TViewResult} from '../../../types/types'
import {SOUND_EFFECT} from '../../../utils/constants'
import {
  AnswerSectionFactory,
} from '../../GameComponents/AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import GameButton from '../../GameComponents/GameButton/GameButton'
import LoadingBoard from '../../GameComponents/LoadingBoard/LoadingBoard'
import {QuestionMedia} from '../../GameComponents/QuestionMedia/QuestionMedia'
import {ExitContext} from '../CommunityGamePlay/CommunityGamePlay'
import styles from './CommunityAnswerBoard.module.css'
import CommunityEndGameBoard from '../CommunityEndGameBoard/CommunityEndGameBoard'
import {EndGameModal} from "../../GameComponents/UtilComponents/EndGameModal";
import {UserAndProcessInfo} from "../../GameComponents/UtilComponents/UserAndProcessInfo";
import {usePracticeGameSession} from "../../../hooks/usePracticeGameSession/usePracticeGameSession";

type CommunityAnswerBoardProps = {
  className?: string
  isShowHostControl: boolean
  setIsShowHostControl: React.Dispatch<React.SetStateAction<boolean>>
}

const CommunityAnswerBoard: FC<CommunityAnswerBoardProps> = ({
                                                               className,
                                                               isShowHostControl,
                                                               setIsShowHostControl,
                                                             }) => {
  const gameManager = usePracticeGameSession()
  const sound = useSound()
  const exitContext = useContext(ExitContext)
  const timer = useTimer()
  const DEFAULT_NEXT_TIMER = 3
  const router = useRouter()
  const [isShowNext, setIsShowNext] = useState<boolean>(false)
  const [autoNextCountDown, setAutoNextCountDown] =
    useState<number>(DEFAULT_NEXT_TIMER)
  const [isShowEndGame, setIsShowEndGame] = useState<boolean>(false)

  const [autoNext, setAutoNext] = useState<boolean>(false)
  const [submit, setSubmit] = useState<boolean>(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [viewResultData, setViewResultData] = useState<TViewResult>()
  const [numSubmission, setNumSubmission] = useState<number>(1)
  const {fromMedium} = useScreenSize()

  let answerSectionFactory: AnswerSectionFactory

  useEffect(() => {
    handleSocket()
    resetState()
    console.log("=>(CommunityAnswerBoard.tsx:58) gameManager", gameManager);
  }, [])

  function checkEndGame() {
    if (!gameManager.currentQuestion) return
    if (gameManager.gameSession?.quiz?.questions?.length) {
      setIsShowEndGame(
        gameManager.currentQuestion?.orderPosition ==
        gameManager.gameSession?.quiz?.questions?.length - 1 && !timer.isCounting
      )
    }
  }


  function resetState() {
    setLoading(null)
    timer.setIsShowSkeleton(true)
    setIsShowNext(false)
    setIsNextEmitted(false)
  }

  const intervalRef = useRef<NodeJS.Timer | null>(null)

  useEffect(() => {
    if (!autoNext && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [autoNext])

  useEffect(() => {
    if (submit) {
      if (
        gameManager.currentQuestion?.orderPosition ??
        0 >= (gameManager.gameSession?.quiz.questions.length ?? 0) - 1
      ) {
        setIsShowHostControl(true)
      }
      if (autoNext) {
        for (let i = 0; i <= DEFAULT_NEXT_TIMER; i++) {
          setTimeout(() => {
            setAutoNextCountDown(DEFAULT_NEXT_TIMER - i)
          }, i * 1000)
        }
        intervalRef.current = setInterval(() => {
          if (autoNext) {
            goToNextQuestion()
          }
        }, DEFAULT_NEXT_TIMER * 1000)
      } else {
        setIsShowHostControl(true)
      }
      setSubmit(false)
    }
  }, [submit])

  const handleSocket = () => {
    if (!gameManager.gameSocket) return
    gameManager.gameSkOnce('game-started', (data) => {
      setAutoNextCountDown(DEFAULT_NEXT_TIMER)
      setIsNextEmitted(false)
      timer.startCounting(data.question?.duration ?? 0)
      setIsShowHostControl(false)
      setLoading(null)
    })

    gameManager.gameSkOn('next-question', (data) => {
      setAutoNextCountDown(DEFAULT_NEXT_TIMER)
      setIsNextEmitted(false)
      timer.startCounting(data.question?.duration ?? 0)
      setIsShowHostControl(false)
      setLoading(null)
    })

    gameManager.gameSkOn('view-result', (data: TViewResult) => {
      timer.countDown >= 0
        ? setLoading('Đã trả lời!')
        : setLoading('Hết giờ!')
      setTimeout(() => {
        setLoading(null)
      }, 1000)
      timer.stopCounting(true)
      timer.stopCountingSound(true)
      setViewResultData(data)
      setIsShowNext(true)
      gameManager.player = data?.player ?? null
      if (data?.player && typeof window !== 'undefined') {
        const curStreak = data.player.currentStreak ?? 0
        if (curStreak > 0) {
          sound?.playRandomCorrectAnswerSound()
        } else {
          sound?.playSound(SOUND_EFFECT['INCORRECT_BACKGROUND'])
          sound?.playSound(SOUND_EFFECT['INCORRECT_ANSWER'])
        }
      }
      setSubmit(true)
      checkEndGame()
    })

    gameManager.gameSkOn('loading', (data) => {
      console.log("=>(ExamAnswerBoard.tsx:75) data", data);
      let question
      if (data?.question?.question) question = data.question.question
      if (data?.game?.question) question = data.game.question
      if (question) {
        timer.setIsShowSkeleton(true)
        setIsShowNext(false)
        setIsNextEmitted(true)

        const newQuestion = question as TQuestion

        timer.setDefaultDuration(newQuestion.duration)
        setLoading('Chuẩn bị!')
        gameManager.submittedAnswer = null
      } else if (data?.loading) {
        setLoading(data.loading)
      }
    })
  }

  const handleSubmitAnswer = (answer: any) => {
    if (!timer.isSubmittable) return
    gameManager.submitAnswer(answer)
    if (gameManager?.currentQuestion?.type != '22POLL')
      timer.setIsSubmittable(false)
  }

  const renderAnswersSection = () => {
    if (!gameManager.currentQuestion) return
    if (!answerSectionFactory)
      answerSectionFactory = new AnswerSectionFactory(
        false,
        styles.answerLayout
      )
    return answerSectionFactory.initAnswerSectionForType(
      gameManager.currentQuestion.type,
      gameManager.currentQuestion,
      handleSubmitAnswer
    )
  }

  const [isNextEmitted, setIsNextEmitted] = useState<boolean>(false)

  const goToNextQuestion = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (!gameManager.gameSession) return
    const msg = {invitationCode: gameManager.gameSession.invitationCode}
    gameManager.gameSkEmit('next-question', msg)
  }

  function endGame() {
    setShowEndGame(true)
  }

  const onOutRoomInEndGameBoard = () => {
    if (gameManager.gameSession && gameManager.gameSocket != null) {
      const msg = {invitationCode: gameManager.gameSession.invitationCode}
      gameManager.gameSkEmit('game-ended', msg)
    }
    gameManager.clearGameSession()
    router.push('/home')
  }

  const renderHostControlSystem = () => {
    return (
      <Fade in={isShowHostControl || fromMedium}>
        {isShowHostControl || fromMedium ? (
          <div
            className={cn(
              styles.hostControl,
              'px-2 py-2 flex-end bg-dark bg-opacity-50'
            )}
          >
            {!isShowEndGame && (
              <GameButton
                isEnable={true}
                iconClassName={cn('bi', {
                  'bi-pause-circle-fill': !autoNext,
                  'bi-play-circle': autoNext,
                })}
                className={classNames('text-white fw-medium', {
                  'bg-secondary': !autoNext,
                })}
                title={
                  autoNext
                    ? `Tự qua câu sau ${autoNextCountDown} giây`
                    : 'Bật tự qua câu'
                }
                onClick={() => setAutoNext(!autoNext)}
              />
            )}
            {!isShowEndGame && !timer.isSubmittable ? (
              <GameButton
                isEnable={true}
                iconClassName="bi bi-arrow-right-circle-fill"
                className={classNames('text-white fw-medium')}
                title="Câu sau"
                onClick={() => {
                  goToNextQuestion()
                }}
              />
            ) : (
              <GameButton
                isEnable={true}
                iconClassName="bi bi-check-circle-fill"
                className={classNames('text-white fw-medium bg-warning')}
                title={'Trả lời'}
                onClick={() => {
                  timer.stopCounting(false)
                }}
              />
            )}
            {isShowEndGame && (
              <GameButton
                isEnable={true}
                iconClassName="bi bi-x-octagon-fill"
                className={classNames('text-white fw-medium bg-danger')}
                title="Kết thúc game"
                onClick={() => {
                  exitContext.setShowEndGameModal(true)
                }}
              />
            )}
          </div>
        ) : (
          <></>
        )}
      </Fade>
    )
  }

  // END GAME HANDLING
  const [showEndGame, setShowEndGame] = useState<boolean>(false)

  return (
    <>
      <div
        className={classNames(
          'd-flex flex-column',
          className,
          styles.container
        )}
      >
        {showEndGame ? (
          <CommunityEndGameBoard
            gameSessionHook={gameManager}
            onOutRoomInEndGameBoard={onOutRoomInEndGameBoard}
            showEndGame={showEndGame}
          />
        ) : (
          <>
            {gameManager.currentQuestion &&
                <UserAndProcessInfo
                    viewResultData={viewResultData}
                />
            }

            {gameManager.currentQuestion &&
                <QuestionMedia
                    media={gameManager.currentQuestion.media ?? null}
                    numStreak={0}
                    numSubmission={numSubmission}
                    key={gameManager.currentQuestion.orderPosition}
                    className={styles.questionMedia}
                    questionTitle={gameManager.currentQuestion?.question ?? ''}
                />
            }

            {gameManager.currentQuestion?.question
              && renderAnswersSection()}

            {renderHostControlSystem()}

            <div className={styles.blankDiv}></div>

            <EndGameModal
              showEndGameModal={exitContext.showEndGameModal}
              onHide={() => exitContext.setShowEndGameModal(false)}
              activeButtonCallback={endGame}
            />

            <LoadingBoard loadingTitle={loading}/>
          </>
        )}
      </div>
    </>
  )
}

export default memo(CommunityAnswerBoard)
