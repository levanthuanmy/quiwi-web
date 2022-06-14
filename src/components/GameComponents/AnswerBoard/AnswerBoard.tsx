import classNames from 'classnames'
import cn from 'classnames'
import router, {useRouter} from 'next/router'
import React, {FC, memo, useContext, useEffect, useRef, useState} from 'react'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {
  TPlayer,
  TQuestion,
  TStartQuizResponse,
  TUser,
  TViewResult,
} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import {QuestionMedia} from '../QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'
import { AnswerSectionFactory } from '../AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import { Fade, Image } from 'react-bootstrap'
import GameButton from '../GameButton/GameButton'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import MyModal from "../../MyModal/MyModal";
import {ExitContext} from "../../../pages/game/play";
import {style} from "dom-helpers";


type AnswerBoardProps = {
  className?: string
  isShowHostControl: boolean
}

const AnswerBoard: FC<AnswerBoardProps> = ({
                                             className,
                                             isShowHostControl,
                                           }) => {
  const {
    gameSession,
    saveGameSession,
    clearGameSession,
    gameSocket,
    gameSkOn,
    getQuestionWithID,
    getNickName,
  } = useGameSession()
  const exitContext = useContext(ExitContext)
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

  const [endTime, setEndTime] = useState<number>(0)
  const [countDown, setCountDown] = useState<number>(-101)
  const [isCounting, setIsCounting] = useState<boolean>(false)

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const _numSubmission = useRef<number>(0)
  const [numSubmission, setNumSubmission] = useState<number>(0)
  const [viewResultData, setViewResultData] = useState<TViewResult>()

  const {fromMedium} = useScreenSize()
  let answerSectionFactory: AnswerSectionFactory

  useEffect(() => {
    handleSocket()
  }, [])

  useEffect(() => {
    if (lsGameSessionPlayer?.length) {
      setGameSessionPlayer(JsonParse(lsGameSessionPlayer))
    }
  }, [lsGameSessionPlayer])

  useEffect(() => {
    if (!gameSession) return
    const user: TUser = JsonParse(lsUser)
    setIsHost(user.id === gameSession.hostId)
    if (currentQID < 0) {
      const firstQuestion = getQuestionWithID(0)
      if (firstQuestion) {
        setCurrentQID(0)
        displayQuestion(firstQuestion)
      }
      const quizLength = gameSession.quiz.questions.length
      if (quizLength) {
        setQuizLength(quizLength)
      }
    }
  }, [gameSession])

  const intervalRef = useRef<NodeJS.Timer | null>(null)

  function _clearInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  // nhảy mỗi lần countdown
  useEffect(() => {
    if (!currentQuestion) return
    setCountDown(currentQuestion.duration)
    intervalRef.current = setInterval(() => {
      let curr = Math.round(new Date().getTime())
      let _countDown = Math.ceil((endTime - curr) / 1000)
      setIsCounting(true)
      setCountDown(_countDown)
      if (_countDown <= 0) {
        if (intervalRef.current && isCounting) {
          console.log('client timeout')
          _clearInterval()
        }
      }
    }, 1000)
    resetGameState()
  }, [endTime])

  useEffect(() => {
    setIsShowEndGame((currentQID == quizLength - 1) && countDown <= 0)
  }, [countDown, currentQID, quizLength]);


  const displayQuestion = (question: TQuestion) => {
    if (question) {
      if (question.duration > 0) {
        // chạy cái này sớm nhất có thể thui
        setCurrentQuestion(question)
        // rồi mới tính toán để timeout
        let endDate = new Date()
        endDate.setSeconds(endDate.getSeconds() + question.duration)
        let endTime = Math.round(endDate.getTime())
        setEndTime(endTime)
      }
    }
  }

  const resetGameState = () => {
    setIsSubmitted(false)
  }

  const handleSocket = () => {
    if (!gameSocket()) return

    gameSkOn('new-submission', (data) => {
      // nhớ check mode
      _numSubmission.current = _numSubmission.current + 1
      setNumSubmission(_numSubmission.current)
    })

    gameSkOn('next-question', (data) => {
      _numSubmission.current = 0
      setNumSubmission(_numSubmission.current)
      setIsShowNext(false)
      setShowRanking(false)
      setIsCounting(false)

      saveGameSession({
        ...JsonParse(localStorage.getItem('game-session')),
        players: [...rankingData],
      } as TStartQuizResponse)
      const currentQuestionId = data.currentQuestionIndex as number
      const newQuestion = data.question as TQuestion

      if (currentQID != currentQuestionId) {
        setCurrentQID(currentQuestionId)
        displayQuestion(newQuestion)
      }
    })

    gameSkOn('view-result', (data: TViewResult) => {
      if (intervalRef.current) {
        _clearInterval()
        setCountDown(0)
      }
      setViewResultData(data)
      setIsShowNext(true)
      if (data?.player && !isHost && typeof window !== 'undefined') {
        localStorage.setItem(
          'game-session-player',
          JSON.stringify(data?.player)
        )
      }
    })

    gameSkOn('timeout', (data) => {
      //nếu mà chưa countdown xong thì set count down
      if (intervalRef.current) {
        _clearInterval()
        setCountDown(0)
      }
    })

    gameSkOn('ranking', (data) => {
      setShowRanking(true)
      const rkData: any[] = data?.playersSortedByScore
      setRankingData(rkData)
    })

    gameSkOn('error', (data) => {
    })
  }

  const viewRanking = () => {
    if (!gameSession) return
    const msg = {invitationCode: gameSession.invitationCode}
    gameSocket()?.emit('view-ranking', msg)
    setIsShowNext(true)
  }

  const handleSubmitAnswer = (answer: any) => {
    if (!gameSession) return
    if (isSubmitted) return
    if (isHost) return

    let msg = {
      invitationCode: gameSession.invitationCode,
      nickname: gameSession.nickName,
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
    setIsSubmitted(true)
    setIsCounting(false)
    if (msg.answer || msg.answerIds) gameSocket()?.emit('submit-answer', msg)
  }

  const exitRoom = () => {
    // dùng clear game session là đủ
    clearGameSession()
    router.push('/my-lib')
  }

  const renderAnswersSection = () => {
    if (!currentQuestion) return
    if (!answerSectionFactory)
      answerSectionFactory = new AnswerSectionFactory(
        isHost,
        styles.answerLayout,
        isSubmitted,
        isCounting,
        countDown
      )
    return answerSectionFactory.initAnswerSectionForType(
      currentQuestion.type,
      currentQuestion,
      handleSubmitAnswer
    )
  }

  const goToNextQuestion = () => {
    if (!gameSession) return
    const msg = {invitationCode: gameSession.invitationCode}
    gameSocket()?.emit('next-question', msg)
  }

  const endGame = () => {
    if (gameSession && gameSocket() && isHost) {
      console.log("=>(AnswerBoard.tsx:281) gameSession", gameSession);
      const msg = {invitationCode: gameSession.invitationCode}
      gameSocket()?.emit('game-ended', msg)
    } else {
      clearGameSession()
      router.push('/my-lib')
    }
  }

  const renderHostControlSystem = () => {
    return (
      <Fade in={isShowHostControl || fromMedium}>
        {(isShowHostControl || fromMedium) ?
          <div className={cn(styles.hostControl)}>
            <GameButton
              isEnable={countDown <= 0}
              iconClassName="bi bi-bar-chart"
              className={classNames('text-white fw-medium')}
              title={'Xếp hạng'}
              onClick={viewRanking}
            />

            {
              isShowEndGame &&
                <GameButton
                    isEnable={true}
                    iconClassName="bi bi-x-octagon-fill"
                    className={classNames('text-white fw-medium bg-danger')}
                    title="Kết thúc game"
                    onClick={() => exitContext.setShowEndGameModal(true)}
                />
            }
            {!isShowEndGame &&
                <GameButton
                    isEnable={isShowNext}
                    iconClassName="bi bi-arrow-right-circle-fill"
                    className={classNames('text-white fw-medium')}
                    title="Câu sau"
                    onClick={goToNextQuestion}
                />
            }
          </div>
          :
          <></>
        }
      </Fade>
    )
  }
  const currentPlayerRankingIndex =
    gameSession?.players?.findIndex(
      (item) => item.nickname === viewResultData?.player?.nickname
    ) ?? -1

  function getEndGameModal() {
    return <MyModal
      show={exitContext.showEndGameModal}
      onHide={() => exitContext.setShowEndGameModal(false)}
      activeButtonTitle="Đồng ý"
      activeButtonCallback={endGame}
      inActiveButtonCallback={() => exitContext.setShowEndGameModal(false)}
      inActiveButtonTitle="Huỷ"
    >
      <div className="text-center h3 fw-bolder">
        Kết thúc game?
      </div>

      <div className="text-center fw-bold">
        <div className="text-secondary fs-24x">
          {currentQID + 1 ==
          gameSession?.quiz?.questions?.length ?
            <>
              {"Quiz mới hoàn thành "}
              <span className="fw-bolder fs-24x  text-primary">
              {currentQID + 1}
                </span>
              {" câu, còn "}
              <span className="fw-bolder fs-24x  text-primary">
              {gameSession?.quiz?.questions?.length}
                </span>
              {" câu chưa hoàn thành!"}
            </>
            :
            <>
              {"Quiz đã hoàn thành tất cả "}
              <span className="fw-bolder fs-24x  text-primary">
              {currentQID + 1}
                </span>
              {" câu trên "}
              <span className="fw-bolder fs-24x  text-primary">
              {gameSession?.quiz?.questions?.length}
                </span>
              {" câu!"}
            </>
          }
        </div>
        <div className="text-secondary fs-24x text-warning">
          Các thành viên trong phòng sẽ không thể chat với nhau nữa, bạn có chắc chắn muốn kết thúc phòng?
        </div>
      </div>
    </MyModal>;
  }

  return (
    <>
      <div
        className={classNames(
          'd-flex flex-column h-100',
          className,
          styles.container
        )}
      >
        {currentQuestion?.question ? (
          <div className={classNames("d-flex flex-column bg-dark bg-opacity-50 rounded-10px shadow mb-2")}>
            <div className="pt-3 px-3 d-flex align-items-center gap-3">
              <Image
                src="/assets/default-logo.png"
                width={40}
                height={40}
                className="rounded-circle"
                alt=""
              />
              <div className="fw-medium fs-20px text-white">
                {isHost ? gameSession?.host.name : gameSessionPlayer?.nickname}
              </div>
            </div>
            <div className="px-3 pb-2 pt-2 text-white d-flex gap-3 align-items-center justify-content-between">
              <div className="fw-medium fs-32px text-primary">
                {currentQID + 1}/
                <span className="text-secondary fs-24px">
                  {gameSession?.quiz?.questions?.length}
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
                        Number(gameSession?.quiz?.questions?.length)
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

        <div
          className={classNames('shadow px-3 pt-2 bg-white mb-2 rounded-10px', styles.questionTitle)}>
          <div
            dangerouslySetInnerHTML={{__html: currentQuestion?.question ?? ""}}
          />
        </div>

        <QuestionMedia
          //timeout sẽ âm để tránh 1 số lỗi, đừng sửa chỗ này
          timeout={countDown > 0 ? countDown : 0}
          media={currentQuestion?.media ?? null}
          numStreak={0}
          numSubmission={numSubmission}
          key={currentQID}
          className={styles.questionMedia}
        />

        {/*height min của question view là 300*/}
        {/*edit styles.answerLayout trong css*/}
        {currentQuestion?.question && renderAnswersSection()}
        {isHost && renderHostControlSystem()}
        <div className={styles.blankDiv}/>
        <GameSessionRanking
          show={showRanking}
          onHide={() => {
            setShowRanking(false)
            saveGameSession({
              ...gameSession,
              players: [...rankingData],
            } as TStartQuizResponse)
          }}
          rankingData={rankingData}
          viewResultData={viewResultData as TViewResult}
          currentQuestion={currentQuestion as TQuestion}
        />
      </div>
      {isHost && getEndGameModal()}
    </>
  )
}

export default memo(AnswerBoard)
