import { default as classNames, default as cn } from 'classnames'
import { useRouter } from 'next/router'
import { FC, memo, useContext, useEffect, useState } from 'react'
import { Fade, Image } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { useSound } from '../../../hooks/useSound/useSound'
import { useTimer } from '../../../hooks/useTimer/useTimer'
import { useUser } from '../../../hooks/useUser/useUser'
import { ExitContext } from '../../../pages/game/play'
import { TAnswerSubmit, TQuestion, TViewResult } from '../../../types/types'
import { SOUND_EFFECT } from '../../../utils/constants'
import MyModal from '../../MyModal/MyModal'
import {
  AnswerSectionFactory,
  QuestionTypeDescription,
} from '../AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import GameButton from '../GameButton/GameButton'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import LoadingBoard from '../LoadingBoard/LoadingBoard'
import { QuestionMedia } from '../QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'

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
    if (!invitationCode?.length) {
      // setLoading("Phòng không tồn tại")
      // setTimeout(() => {
      //   exitRoom()
      // }, 2000)
    }
    handleSocket()
    resetState()
  }, [])

  const displayFirstQuestion = () => {
    if (!gameManager.currentQuestion || !gameManager.gameSession) return
    if (gameManager.currentQuestion.orderPosition != 0) {
      gameManager.submittedAnswer
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

    displayFirstQuestion()
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
              <span className={'fw-bolder'}>{lastSubmit.nickname}</span> đã nộp
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
    if (!gameManager.gameSession) return
    if (!timer.isSubmittable) return
    if (gameManager.isHost) return

    let answerToSubmit: TAnswerSubmit = {
      invitationCode: gameManager.gameSession.invitationCode,
      nickname: gameManager.nickName,
      answerIds: [] as any[],
      answer: '',
    }

    if (answer instanceof Set) {
      console.log('=>(AnswerBoard.tsx:174) submit set "', answer, '"')
      answerToSubmit.answerIds = Array.from(answer)
    } else if (answer instanceof Array) {
      console.log('=>(AnswerBoard.tsx:174) submit array "', answer, '"')
      answerToSubmit.answerIds = answer
    } else if (typeof answer === 'string') {
      console.log('=>(AnswerBoard.tsx:174) submit text "', answer, '"')
      answerToSubmit.answer = answer
    } else {
      console.log('=>(AnswerBoard.tsx:191) not supported "', answer, '"')
      return
    }

    if (
      gameManager.currentQuestion &&
      gameManager.currentQuestion.type != '22POLL'
    )
      timer.setIsSubmittable(false)
    if (answerToSubmit.answer || answerToSubmit.answerIds) {
      gameManager.gameSkEmit('submit-answer', answerToSubmit)
      answerToSubmit.questionId = gameManager.currentQuestion?.orderPosition
      gameManager.submittedAnswer = answerToSubmit
    }
  }

  const exitRoom = () => {
    // dùng clear game session là đủ
    gameManager.clearGameSession()
    router.push('/my-lib')
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
      gameManager.isHost
    ) {
      const msg = { invitationCode: gameManager.gameSession.invitationCode }
      gameManager.gameSkEmit('game-ended', msg)
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
  const currentPlayerRankingIndex =
    gameManager.gameSession?.players.findIndex(
      (item) => item.nickname === viewResultData?.player?.nickname
    ) ?? -1

  function getEndGameModal() {
    return (
      <MyModal
        show={exitContext.showEndGameModal}
        onHide={() => exitContext.setShowEndGameModal(false)}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={endGame}
        inActiveButtonCallback={() => exitContext.setShowEndGameModal(false)}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center h3 fw-bolder">Kết thúc game?</div>

        <div className="text-center fw-bold">
          {gameManager.currentQuestion && (
            <div className="text-secondary fs-24x">
              {gameManager.currentQuestion.orderPosition + 1 <
              (gameManager.gameSession?.quiz?.questions?.length ?? 0) ? (
                <>
                  {'Quiz mới hoàn thành '}
                  <span className="fw-bolder fs-24x  text-primary">
                    {gameManager.currentQuestion.orderPosition + 1}
                  </span>
                  {' câu, còn '}
                  <span className="fw-bolder fs-24x  text-primary">
                    {gameManager.gameSession?.quiz?.questions?.length}
                  </span>
                  {' câu chưa hoàn thành!'}
                </>
              ) : (
                <>
                  {'Quiz đã hoàn thành tất cả '}
                  <span className="fw-bolder fs-24x  text-primary">
                    {gameManager.currentQuestion.orderPosition + 1}
                  </span>
                  {' câu trên '}
                  <span className="fw-bolder fs-24x  text-primary">
                    {gameManager.gameSession?.quiz?.questions?.length}
                  </span>
                  {' câu!'}
                </>
              )}
            </div>
          )}
          <div className="text-secondary fs-24x text-warning">
            Các thành viên trong phòng sẽ không thể chat với nhau nữa, bạn có
            chắc chắn muốn kết thúc phòng?
          </div>
        </div>
      </MyModal>
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
        {gameManager.currentQuestion?.question ? (
          <div
            className={classNames(
              'd-flex flex bg-dark bg-opacity-50 rounded-10px shadow mb-2',
              { 'gap-5 py-2': fromMedium, 'py-1': isMobile }
            )}
          >
            <div
              className={cn('px-2 d-flex align-items-center', {
                'gap-3': fromMedium,
              })}
            >
              {(user?.avatar || fromMedium) && (
                <Image
                  src={`${user?.avatar ?? '/assets/default-avatar.png'}`}
                  width={40}
                  height={40}
                  className="rounded-circle"
                  alt=""
                />
              )}
              {/*{fromMedium &&*/}
              <div className="fw-medium fs-20px text-white">
                {gameManager.isHost
                  ? gameManager.gameSession?.host?.name
                  : gameManager.player?.nickname}
              </div>
              {/*}*/}
            </div>
            <div
              className={cn(
                'flex-grow-1 h-100 px-2 text-white d-flex align-items-center justify-content-between',
                { 'gap-3': fromMedium }
              )}
            >
              {gameManager.currentQuestion && gameManager.isHost ? (
                <div
                  id="questionProgressBar"
                  className="flex-grow-1 bg-secondary rounded-pill"
                  style={{ height: 6 }}
                >
                  <div
                    className="bg-primary h-100 rounded-pill transition-all-150ms position-relative"
                    style={{
                      width: `${Math.floor(
                        ((gameManager.currentQuestion.orderPosition + 1) *
                          100) /
                          Number(
                            gameManager.gameSession?.quiz?.questions?.length
                          )
                      )}%`,
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="fs-4">
                    <span className="me-2">🔥</span>
                    {viewResultData?.player?.currentStreak ?? 0}
                  </div>
                  <div className="fs-4">
                    <i className="bi bi-award text-primary me-2 " />
                    {currentPlayerRankingIndex > -1
                      ? currentPlayerRankingIndex + 1
                      : '-'}
                  </div>
                  <div className="fs-4">
                    <span className="text-primary me-2">Điểm</span>
                    {Math.floor(viewResultData?.player?.score ?? 0)}
                  </div>
                </>
              )}
              <div className="fw-medium fs-4 text-primary">
                <span className="fs-4">Câu: </span>
                <span className="text-white text-primary fs-3">
                  {(gameManager.currentQuestion?.orderPosition ?? 0) + 1}/
                </span>
                <span className="text-secondary fs-24px">
                  {gameManager.gameSession?.quiz?.questions?.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <></>
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
        {gameManager.currentQuestion && (
          <div
            className={classNames(
              'px-2 py-1 fs-4 fw-bold text-white mb-2 bg-dark bg-opacity-50 d-flex justify-content-between align-items-center',
              { 'rounded-10px': fromMedium }
            )}
          >
            <div className={''}>
              <i
                className={cn(
                  'fs-20px text-white me-2',
                  QuestionTypeDescription[gameManager.currentQuestion.type]
                    ?.icon
                )}
              />
              {QuestionTypeDescription[gameManager.currentQuestion.type]?.title}
            </div>
          </div>
        )}

        {/*height min của question view là 300*/}
        {/*edit styles.answerLayout trong css*/}
        {gameManager.currentQuestion?.question && renderAnswersSection()}
        {gameManager.isHost && renderHostControlSystem()}
        {!gameManager.isHost && gameManager.currentQuestion && (
          <div
            className={classNames(
              'px-2 my-2 py-1 fs-4 fw-bold text-white mb-2 bg-dark bg-opacity-50 d-flex justify-content-end align-items-center',
              { 'rounded-10px': fromMedium }
            )}
          >
            <GameButton
              isEnable={
                timer.isSubmittable &&
                gameManager.currentQuestion?.type !== '22POLL'
              }
              iconClassName="bi bi-check-circle-fill"
              className={classNames(
                'text-white fw-medium bg-warning',
                styles.submitButton
              )}
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
        )}
        {/*&& currentQuestion.type != "22POLL"*/}
        <div className={styles.blankDiv}></div>
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

        {gameManager.isHost && getEndGameModal()}

        <LoadingBoard
          loading={loading != null}
          className={'position-fixed top-0 bottom-0 start-0 end-0'}
          loadingTitle={loading ?? ''}
        />
      </div>
    </>
  )
}

export default memo(AnswerBoard)
