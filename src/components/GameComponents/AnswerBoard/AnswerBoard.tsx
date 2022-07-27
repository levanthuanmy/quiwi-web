import { default as classNames, default as cn } from 'classnames'
import { useRouter } from 'next/router'
import { FC, memo, useContext, useEffect, useState } from 'react'
import { Fade } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { useSound } from '../../../hooks/useSound/useSound'
import { useTimer } from '../../../hooks/useTimer/useTimer'
import { useUser } from '../../../hooks/useUser/useUser'
import { ExitContext } from '../../../pages/game/play'
import { TQuestion, TViewResult } from '../../../types/types'
import { SOUND_EFFECT } from '../../../utils/constants'
import { AnswerSectionFactory } from '../AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import GameButton from '../GameButton/GameButton'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import LoadingBoard from '../LoadingBoard/LoadingBoard'
import { QuestionMedia } from '../QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'
import { UserAndProcessInfo } from '../UtilComponents/UserAndProcessInfo'
import { QuestionType } from '../UtilComponents/QuestionType'
import { EndGameModal } from '../UtilComponents/EndGameModal'

type AnswerBoardProps = {
  className?: string
  isShowHostControl: boolean
}

const AnswerBoard: FC<AnswerBoardProps> = ({
  className,
  isShowHostControl,
}) => {
  const gameManager = useGameSession()
  const sound = useSound()
  const timer = useTimer()
  const exitContext = useContext(ExitContext)
  const router = useRouter()
  const query = router.query
  const { invitationCode } = query
  const user = useUser()

  let answerSectionFactory: AnswerSectionFactory

  const [isShowNext, setIsShowNext] = useState<boolean>(false)
  const [isShowEndGame, setIsShowEndGame] = useState<boolean>(false)
  const [showRanking, setShowRanking] = useState<boolean>(false)
  const [rankingData, setRankingData] = useState<any[]>([])
  const [answersStatistic, setAnswersStatistic] = useState<
    Record<string, number>
  >({})
  const [loading, setLoading] = useState<string | null>(null)
  const [numSubmission, setNumSubmission] = useState<number>(0)
  const [viewResultData, setViewResultData] = useState<TViewResult>()
  const { addToast } = useToasts()
  const { fromMedium, isMobile } = useScreenSize()

  useEffect(() => {
    handleSocket()
    resetState()
  }, [])

  const displayFirstQuestion = () => {
    if (!gameManager.currentQuestion || !gameManager.gameSession) return
    if (gameManager.currentQuestion.orderPosition != 0) {
      //
    } else {
      console.log(
        '=>(AnswerBoard.tsx:82) gameManager.currentQuestion',
        gameManager.currentQuestion
      )
      timer.setDefaultDuration(gameManager.currentQuestion.duration)
      setNumSubmission(0)
    }
  }

  function checkEndGame() {
    if (!gameManager.currentQuestion) return
    if (gameManager.gameSession?.quiz?.questions?.length) {
      setIsShowEndGame(
        gameManager.currentQuestion?.orderPosition ==
          gameManager.gameSession?.quiz?.questions?.length - 1 &&
          !timer.isCounting
      )
    }
  }

  function resetState() {
    if (
      !isNextEmitted &&
      gameManager.gameSession &&
      !gameManager.currentQuestion
    ) {
      setLoading('Chuẩn bị!')
      sound.playSound(SOUND_EFFECT['READY'])
    }
    if (gameManager.gameSession) {
      if (!gameManager.gameSocket || !gameManager.gameSocket.connected) {
        setLoading('Đang kết nối lại...')
      } else {
        setLoading(null)
      }
    }

    setIsNextEmitted(true)
    timer.setIsShowSkeleton(true)
    setIsShowNext(false)
    setIsNextEmitted(false)
    setShowRanking(false)

    // displayFirstQuestion()
  }

  const handleSocket = () => {
    gameManager.gameSkOnce('game-started', (data) => {
      setNumSubmission(0)
      setIsNextEmitted(false)
      timer.startCounting(data.question.duration ?? 0)
      setLoading(null)
    })

    gameManager.gameSkOn('new-submission', (data) => {
      sound.playSound(SOUND_EFFECT['NEWSUBMISSION'])
      if (data.numberOfSubmission) {
        setNumSubmission(data.numberOfSubmission)

        const lastSubmit =
          data.playersWithAnswer[data.playersWithAnswer.length - 1]
        if (lastSubmit) {
          addToast(
            <div>
              <span className={'fw-bolder'}>{lastSubmit.nickname}</span> đã trả
              lời
            </div>,
            {
              placement: 'bottom-left',
              appearance: 'success',
              newestOnTop: true,
              autoDismiss: true,
            }
          )
        }
        setAnswersStatistic(data.answersStatistic)
      }
    })

    gameManager.gameSkOn('next-question', (data) => {
      setNumSubmission(0)
      setIsNextEmitted(false)
      timer.startCounting(data.question.duration ?? 0)
      setLoading(null)
    })

    gameManager.gameSkOn('view-result', (data: TViewResult) => {
      timer.countDown >= 0
        ? setLoading('Tất cả đã trả lời!')
        : setLoading('Hết giờ!')
      setTimeout(() => {
        setLoading(null)
      }, 1000)
      timer.stopCounting(true)
      timer.stopCountingSound(true)
      setViewResultData(data)
      if (data.answersStatistic.length > 0)
        setAnswersStatistic(data.answersStatistic)

      setIsShowNext(true)
      if (
        data?.player &&
        !gameManager.isHost &&
        typeof window !== 'undefined'
      ) {
        const curStreak = data.player.currentStreak ?? 0
        if (curStreak > 0) {
          sound?.playRandomCorrectAnswerSound()
        } else {
          sound?.playSound(SOUND_EFFECT['INCORRECT_BACKGROUND'])
          sound?.playSound(SOUND_EFFECT['INCORRECT_ANSWER'])
        }
        localStorage.setItem(
          'game-session-player',
          JSON.stringify(data?.player)
        )
      }

      checkEndGame()
    })

    gameManager.gameSkOn('ranking', (data) => {
      sound?.playSound(SOUND_EFFECT['RECHARGED'])
      setShowRanking(true)
      const rkData: any[] = data?.playersSortedByScore
      setRankingData(rkData)
    })

    gameManager.gameSkOn('loading', (data) => {
      if (data?.question?.question) {
        timer.setIsShowSkeleton(true)
        setIsShowNext(false)
        setShowRanking(false)
        setIsNextEmitted(true)

        gameManager.players = [...rankingData]

        const newQuestion = data.question.question as TQuestion

        timer.setDefaultDuration(newQuestion.duration)
        setNumSubmission(0)
        setLoading('Chuẩn bị!')
        sound.playSound(SOUND_EFFECT['READY'])

        gameManager.submittedAnswer = null
      }
      if (data?.loading) {
        setLoading(data.loading)
        sound.playSound(SOUND_EFFECT['BELL'])
      }
    })
  }

  const viewRanking = () => {
    if (!gameManager.gameSession) return
    const msg = { invitationCode: gameManager.gameSession.invitationCode }
    gameManager.gameSkEmit('view-ranking', msg)
    setIsShowNext(true)
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
        gameManager.isHost,
        styles.answerLayout
      )
    return answerSectionFactory.initAnswerSectionForType(
      gameManager.currentQuestion.type,
      gameManager.currentQuestion,
      handleSubmitAnswer,
      answersStatistic
    )
  }

  const [isNextEmitted, setIsNextEmitted] = useState<boolean>(false)

  const goToNextQuestion = () => {
    if (!gameManager.gameSession) return
    const msg = { invitationCode: gameManager.gameSession.invitationCode }
    gameManager.gameSkEmit('next-question', msg)
  }

  function endGame() {
    if (
      gameManager.gameSession &&
      gameManager.gameSocket &&
      gameManager.isHost &&
      gameManager.gameSocket.connected
    ) {
      const msg = { invitationCode: gameManager.gameSession.invitationCode }
      gameManager.gameSkEmit('game-ended', msg)
      gameManager.clearGameSession()
    } else {
      gameManager.clearGameSession()
      router.push('/my-lib')
    }
  }

  const renderHostControlSystem = () => {
    return (
      <Fade in={isShowHostControl || fromMedium}>
        {isShowHostControl || fromMedium ? (
          <div
            className={cn(
              styles.hostControl,
              'px-2 my-2 py-1 bg-dark bg-opacity-50'
            )}
          >
            <GameButton
              isEnable={isShowNext || !timer.isCounting}
              iconClassName="bi bi-bar-chart"
              className={classNames('text-white fw-medium')}
              title={'Xếp hạng'}
              onClick={viewRanking}
            />

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
            {!isShowEndGame && (
              <GameButton
                isEnable={!isNextEmitted && !timer.isCounting}
                iconClassName="bi bi-arrow-right-circle-fill"
                className={classNames('text-white fw-medium')}
                title="Câu sau"
                onClick={goToNextQuestion}
              />
            )}
          </div>
        ) : (
          <></>
        )}
      </Fade>
    )
  }

  function renderPlayerControlSystem() {
    return (
      <div
        className={classNames(
          'px-2 my-2 py-1 fs-4 fw-bold text-white mb-2 bg-dark bg-opacity-50 d-flex justify-content-end align-items-center',
          { 'rounded-10px': fromMedium }
        )}
      >
        <GameButton
          className={classNames(
            'text-white fw-medium bg-warning',
            styles.submitButton
          )}
          isEnable={
            timer.isSubmittable &&
            gameManager.currentQuestion?.type !== '22POLL'
          }
          iconClassName="bi bi-check-circle-fill"
          title={
            gameManager.currentQuestion?.type !== '22POLL'
              ? 'Trả lời'
              : 'Câu trả lời tự nộp'
          }
          onClick={() => {
            timer.stopCounting(false)
          }}
        />
      </div>
    )
  }

  function renderRanking() {
    return (
      <GameSessionRanking
        show={showRanking}
        onHide={() => {
          setShowRanking(false)
          gameManager.players = [...rankingData]
        }}
        rankingData={rankingData}
        viewResultData={viewResultData as TViewResult}
        currentQuestion={gameManager.currentQuestion as TQuestion}
      />
    )
  }

  return (
    <>
      <div
        className={classNames(
          'd-flex flex-column',
          className,
          styles.container
        )}
      >
        {gameManager.currentQuestion?.question && (
          <UserAndProcessInfo viewResultData={viewResultData} />
        )}

        {gameManager.currentQuestion && (
          <QuestionMedia
            media={gameManager.currentQuestion.media ?? null}
            numStreak={0}
            numSubmission={numSubmission}
            key={gameManager.currentQuestion.orderPosition}
            className={styles.questionMedia}
            questionTitle={gameManager.currentQuestion?.question ?? ''}
          />
        )}

        {gameManager.currentQuestion?.type && (
          <QuestionType type={gameManager.currentQuestion.type} />
        )}

        {gameManager.currentQuestion?.question && renderAnswersSection()}

        {gameManager.isHost
          ? renderHostControlSystem()
          : renderPlayerControlSystem()}

        <div className={styles.blankDiv}></div>

        {renderRanking()}

        {gameManager.isHost && (
          <EndGameModal
            showEndGameModal={exitContext.showEndGameModal}
            onHide={() => exitContext.setShowEndGameModal(false)}
            activeButtonCallback={endGame}
          />
        )}

        <LoadingBoard loadingTitle={loading} />
      </div>
    </>
  )
}

export default memo(AnswerBoard)
