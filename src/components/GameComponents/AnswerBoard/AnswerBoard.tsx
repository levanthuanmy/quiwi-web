import classNames from 'classnames'
import cn from 'classnames'
import {useRouter} from 'next/router'
import React, {FC, memo, useContext, useEffect, useRef, useState} from 'react'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'

import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {TPlayer, TQuestion, TStartQuizResponse, TUser, TViewResult,} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import {QuestionMedia} from '../QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'
import {
  AnswerSectionFactory,
  QuestionTypeDescription,
} from '../AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import {Fade, Image} from 'react-bootstrap'
import GameButton from '../GameButton/GameButton'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import MyModal from "../../MyModal/MyModal";
import {ExitContext} from "../../../pages/game/play";
import LoadingBoard from "../LoadingBoard/LoadingBoard";
import {useToasts} from "react-toast-notifications";
import {useTimer} from "../../../hooks/useTimer/useTimer";
import {SOUND_EFFECT} from '../../../utils/constants'
import {useUserSetting} from "../../../hooks/useUserSetting/useUserSetting";
import {useSound} from "../../../hooks/useSound/useSound";


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
  const setting = useUserSetting()

  // lưu qid để hiển thị bên trang bộ quiz
  const [lsCurrentQID, setLsCurrentQID] = useLocalStorage('currentQID', '-1')

  const exitContext = useContext(ExitContext)
  const timer = useTimer()
  const [lsUser] = useLocalStorage('user', '')
  const [lsGameSessionPlayer] = useLocalStorage('game-session-player', '')
  const [gameSessionPlayer, setGameSessionPlayer] = useState<TPlayer>()
  const [isHost, setIsHost] = useState<boolean>(false)
  const [currentQID, setCurrentQID] = useState<number>(-1)
  const [quizLength, setQuizLength] = useState<number>(0)

  const router = useRouter()

  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(null)

  const [isShowNext, setIsShowNext] = useState<boolean>(false)
  const [isShowEndGame, setIsShowEndGame] = useState<boolean>(false)

  const [showRanking, setShowRanking] = useState<boolean>(false)
  const [rankingData, setRankingData] = useState<any[]>([])
  const [answersStatistic, setAnswersStatistic] = useState<Record<string, number>>({})

  const [loading, setLoading] = useState<string | null>(null)

  const _numSubmission = useRef<number>(0)
  const [numSubmission, setNumSubmission] = useState<number>(0)
  const [viewResultData, setViewResultData] = useState<TViewResult>()

  const {addToast} = useToasts()
  const {fromMedium} = useScreenSize()
  let answerSectionFactory: AnswerSectionFactory

  useEffect(() => {
    handleSocket()
    resetState()
    console.log("=>(AnswerBoard.tsx:95) resetState");
  }, [])

  useEffect(() => {
    if (lsGameSessionPlayer?.length) {
      setGameSessionPlayer(JsonParse(lsGameSessionPlayer))
    }
  }, [lsGameSessionPlayer])

  useEffect(() => {
    if (!gameManager.gameSession) return
    const user: TUser = JsonParse(lsUser)
    setIsHost(user.id === gameManager.gameSession.hostId)
    if (currentQID < 0) {
      const firstQuestion = gameManager.getQuestionWithID(0)
      if (firstQuestion) {
        setCurrentQID(0)
        displayQuestion(firstQuestion)
        timer.setDefaultDuration(firstQuestion.duration)
        setNumSubmission(0)
      }
      const quizLength = gameManager.gameSession.quiz.questions.length
      if (quizLength) {
        setQuizLength(quizLength)
      }
    }
  }, [gameManager.gameSession])

  useEffect(() => {
    setIsShowEndGame(currentQID == quizLength - 1 && !timer.isCounting)
  }, [currentQID, quizLength])

  const displayQuestion = (question: TQuestion) => {
    console.log('=>(AnswerBoard.tsx:116) Display question', question)
    if (question && question.duration > 0) setCurrentQuestion(question)
  }

  function resetState() {
    if (!isNextEmitted && !currentQuestion) {
      setLoading('Chuẩn bị!')
      sound.playSound(SOUND_EFFECT['READY'])
    } else setLoading(null)

    setIsNextEmitted(true)
    timer.setIsShowSkeleton(true)
    setIsShowNext(false)
    setIsNextEmitted(false)
    setShowRanking(false)
  }

  const handleSocket = () => {
    if (!gameManager.gameSocket()) return
    gameManager.gameSkOnce('game-started', (data) => {
      _numSubmission.current = 0
      setNumSubmission(_numSubmission.current)
      setIsNextEmitted(false)
      timer.startCounting(data.question.duration ?? 0)
      setLoading(null)
    })

    gameManager.gameSkOn('new-submission', (data) => {
      sound.playSound(SOUND_EFFECT['NEWSUBMISSION'])
      if (data.playersWithAnswer) {
        _numSubmission.current = data.playersWithAnswer.length
        setNumSubmission(_numSubmission.current)

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
      _numSubmission.current = 0
      setNumSubmission(_numSubmission.current)
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
      if (data.answersStatistic.length > 0) setAnswersStatistic(data.answersStatistic)

      setIsShowNext(true)
      if (data?.player && !isHost && typeof window !== 'undefined') {
        const curStreak = data.player.currentStreak ?? 0
        if (curStreak > 0) {
          sound?.playRandomCorrectAnswerSound();
        } else {
          sound?.playSound(SOUND_EFFECT['INCORRECT_BACKGROUND']);
          sound?.playSound(SOUND_EFFECT['INCORRECT_ANSWER']);
        }
        localStorage.setItem(
          'game-session-player',
          JSON.stringify(data?.player)
        )
      }
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

        gameManager.saveGameSession({
          ...JsonParse(localStorage.getItem('game-session')),
          players: [...rankingData],
        } as TStartQuizResponse)

        const currentQuestionId = data.question.currentQuestionIndex as number
        const newQuestion = data.question.question as TQuestion
        setLsCurrentQID(`${data.question.currentQuestionIndex}`)

        if (currentQID != currentQuestionId) {
          setCurrentQID(currentQuestionId)
          displayQuestion(newQuestion)
        }
        timer.setDefaultDuration(newQuestion.duration)
        setNumSubmission(0)
        setLoading('Chuẩn bị!')
        sound.playSound(SOUND_EFFECT['READY'])
      }
      if (data?.loading) {
        setLoading(data.loading)
        sound.playSound(SOUND_EFFECT['BELL'])
      }
    })
  }

  const viewRanking = () => {
    if (!gameManager.gameSession) return
    const msg = {invitationCode: gameManager.gameSession.invitationCode}
    gameManager.gameSkEmit('view-ranking', msg)
    setIsShowNext(true)
  }

  const handleSubmitAnswer = (answer: any) => {
    if (!gameManager.gameSession) return
    if (!timer.isSubmittable) return
    if (isHost) return

    let msg = {
      invitationCode: gameManager.gameSession.invitationCode,
      nickname: gameManager.gameSession.nickName,
      answerIds: [] as any[],
      answer: '',
    }

    if (answer instanceof Set) {
      console.log('=>(AnswerBoard.tsx:174) submit set "', answer, '"')
      msg.answerIds = Array.from(answer)
    } else if (answer instanceof Array) {
      console.log('=>(AnswerBoard.tsx:174) submit array "', answer, '"')
      msg.answerIds = answer
    } else if (typeof answer === 'string') {
      console.log('=>(AnswerBoard.tsx:174) submit text "', answer, '"')
      msg.answer = answer
    } else {
      console.log('=>(AnswerBoard.tsx:191) not supported "', answer, '"')
      return
    }
    if (currentQuestion && currentQuestion.type != '22POLL')
      timer.setIsSubmittable(false)
    if (msg.answer || msg.answerIds) gameManager.gameSkEmit('submit-answer', msg)
  }

  const exitRoom = () => {
    // dùng clear game session là đủ
    gameManager.clearGameSession()
    router.push('/my-lib')
  }

  const renderAnswersSection = () => {
    if (!currentQuestion) return
    if (!answerSectionFactory)
      answerSectionFactory = new AnswerSectionFactory(
        isHost,
        styles.answerLayout
      )
    return answerSectionFactory.initAnswerSectionForType(
      currentQuestion.type,
      currentQuestion,
      handleSubmitAnswer,
      answersStatistic
    )
  }

  const [isNextEmitted, setIsNextEmitted] = useState<boolean>(false)

  const goToNextQuestion = () => {
    if (!gameManager.gameSession) return
    const msg = {invitationCode: gameManager.gameSession.invitationCode}
    gameManager.gameSkEmit('next-question', msg)
  }

  function endGame() {
    if (gameManager.gameSession && gameManager.gameSocket() != null && isHost) {
      const msg = {invitationCode: gameManager.gameSession.invitationCode}
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
          <div className={cn(styles.hostControl, 'px-2 py-2')}>
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
    gameManager.gameSession?.players?.findIndex(
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
          <div className="text-secondary fs-24x">
            {currentQID + 1 < (gameManager.gameSession?.quiz?.questions?.length ?? 0) ? (
              <>
                {'Quiz mới hoàn thành '}
                <span className="fw-bolder fs-24x  text-primary">
                  {currentQID + 1}
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
                  {currentQID + 1}
                </span>
                {' câu trên '}
                <span className="fw-bolder fs-24x  text-primary">
                  {gameManager.gameSession?.quiz?.questions?.length}
                </span>
                {' câu!'}
              </>
            )}
          </div>
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
        {currentQuestion?.question ? (
          <div
            className={classNames(
              'd-flex flex-column bg-dark bg-opacity-50 rounded-10px shadow mb-2'
            )}
          >
            <div className="pt-2 px-2 d-flex align-items-center gap-3">
              <Image
                src="/assets/default-avatar.png"
                width={40}
                height={40}
                className="rounded-circle"
                alt=""
              />
              <div className="fw-medium fs-20px text-white">
                {isHost ? gameManager.gameSession?.host?.name : gameSessionPlayer?.nickname}
              </div>
            </div>
            <div className="px-2 pb-2 text-white d-flex gap-3 align-items-center justify-content-between">
              <div className="fw-medium fs-32px text-primary">
                {currentQID + 1}/
                <span className="text-secondary fs-24px">
                  {gameManager.gameSession?.quiz?.questions?.length}
                </span>
              </div>

              {isHost ? (
                <div
                  id="questionProgressBar"
                  className="flex-grow-1 bg-secondary rounded-pill"
                  style={{height: 6}}
                >
                  <div
                    className="bg-primary h-100 rounded-pill transition-all-150ms position-relative"
                    style={{
                      width: `${Math.floor(
                        ((currentQID + 1) * 100) /
                        Number(gameManager.gameSession?.quiz?.questions?.length)
                      )}%`,
                    }}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <span className="me-2">🔥</span>
                    {viewResultData?.player?.currentStreak ?? 0}
                  </div>
                  <div>
                    <i className="bi bi-award fs-20px text-primary me-2"/>
                    {currentPlayerRankingIndex > -1
                      ? currentPlayerRankingIndex + 1
                      : '-'}
                  </div>
                  <div className="">
                    <span className="text-primary me-2">Điểm</span>
                    {Math.floor(viewResultData?.player?.score ?? 0)}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}

        <QuestionMedia
          media={currentQuestion?.media ?? null}
          numStreak={0}
          numSubmission={numSubmission}
          key={currentQID}
          className={styles.questionMedia}
        />

        <div
          className={classNames(
            'noselect shadow px-3 pt-2 bg-white mb-2',
            styles.questionTitle,
            {'rounded-10px': fromMedium}
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
              'px-2 py-2 fs-4 fw-bold text-white mb-2 bg-dark bg-opacity-50 d-flex justify-content-between align-items-center',
              {'rounded-10px': fromMedium}
            )}
          >
            <div className={''}>
              <i
                className={cn(
                  'fs-20px text-white me-2',
                  QuestionTypeDescription[currentQuestion.type].icon
                )}
              />
              {QuestionTypeDescription[currentQuestion.type].title}
            </div>
            {!isHost && currentQuestion && (
              <GameButton
                isEnable={timer.isSubmittable && currentQuestion?.type !== '22POLL'}
                iconClassName="bi bi-check-circle-fill"
                className={classNames(
                  'text-white fw-medium bg-warning',
                  styles.submitButton
                )}
                title={currentQuestion?.type !== '22POLL' ? 'Trả lời' : 'Câu trả lời tự nộp'}
                onClick={() => {
                  timer.stopCounting(false)
                }}
              />
            )}
          </div>
        )}

        {/*height min của question view là 300*/}
        {/*edit styles.answerLayout trong css*/}
        {currentQuestion?.question && renderAnswersSection()}
        {isHost && renderHostControlSystem()}
        {/*&& currentQuestion.type != "22POLL"*/}
        <div className={styles.blankDiv}></div>
        <GameSessionRanking
          show={showRanking}
          onHide={() => {
            setShowRanking(false)
            gameManager.saveGameSession({
              ...gameManager.gameSession,
              players: [...rankingData],
            } as TStartQuizResponse)
          }}
          rankingData={rankingData}
          viewResultData={viewResultData as TViewResult}
          currentQuestion={currentQuestion as TQuestion}
        />

        {isHost && getEndGameModal()}

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
