import classNames from 'classnames'
import {useRouter} from 'next/router'
import React, {FC, memo, useEffect, useRef, useState} from 'react'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {SocketManager} from '../../../hooks/useSocket/socketManager'
import {TQuestion, TStartQuizResponse, TUser} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import MoreButton from '../MoreButton/MoreButton'
import {QuestionMedia} from '../QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'
import {AnswerSectionFactory} from "../AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory";

type AnswerBoardProps = {
  className?: string
}

const AnswerBoard: FC<AnswerBoardProps> = ({className}) => {
  const {gameSession, saveGameSession, clearGameSession, gameSocket, gameSkOn, getQuestionWithID} = useGameSession()

  const [lsUser] = useLocalStorage('user', '')
  const [isHost, setIsHost] = useState<boolean>(false)
  const [currentQID, setCurrentQID] = useState<number>(-1)

  const router = useRouter()

  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(null)

  const [isShowNext, setIsShowNext] = useState<boolean>(false)
  const [showRanking, setShowRanking] = useState<boolean>(false)
  const [rankingData, setRankingData] = useState<any[]>([])

  const [endTime, setEndTime] = useState<number>(0)
  const [countDown, setCountDown] = useState<number>(-101)

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [numSubmission, setNumSubmission] = useState<number>(0)

  let answerSectionFactory: AnswerSectionFactory


  useEffect(() => {
    handleSocket()
  }, [])

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
    }
  }, [gameSession])

  const intervalRef = useRef<NodeJS.Timer | null>(null)

  // nhảy mỗi lần countdown
  useEffect(() => {
    if (!currentQuestion) return
    setCountDown(currentQuestion.duration)
    intervalRef.current = setInterval(() => {
      let curr = Math.round((new Date()).getTime());
      let _countDown = Math.ceil((endTime - curr) / 1000);
      setCountDown(_countDown)

      if (_countDown <= 0) {
        if (intervalRef.current)
          clearInterval(intervalRef.current)
      }
    }, 1000)
  }, [endTime])

  const displayQuestion = (question: TQuestion) => {
    resetGameState()
    if (question) {
      if (question.duration > 0) {
        // chạy cái này sớm nhất có thể thui
        setCurrentQuestion(question)
        // rồi mới tính toán để timeout
        let endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() + question.duration);
        let endTime = Math.round(endDate.getTime());
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
      console.log('new-submission', data)
      // nhớ check mode
      setNumSubmission(numSubmission + 1)
    })

    gameSkOn('next-question', (data) => {
      setIsShowNext(false)
      setShowRanking(false)

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

    gameSkOn('view-result', (data) => {
      console.log('view-result', data)
      //nếu mà chưa countdown xong thì set count down
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setCountDown(0)
      }
    })

    gameSkOn('timeout', (data) => {
      console.log('timeout', data)
    })

    gameSkOn('ranking', (data) => {
      setShowRanking(true)
      setRankingData(data?.playersSortedByScore)
    })

    gameSkOn('error', (data) => {
      console.log('answer board socket error', data)
    })
  }

  const goToNextQuestion = () => {
    if (!gameSession) return
    const msg = {invitationCode: gameSession.invitationCode}
    gameSocket()?.emit('next-question', msg)
    console.log(msg)
  }

  const viewRanking = () => {
    if (!gameSession) return
    const msg = {invitationCode: gameSession.invitationCode}
    gameSocket()?.emit('view-ranking', msg)
    setIsShowNext(true)
  }

  const handleSubmitAnswer = (answerSet: Set<any>) => {
    if (!gameSession) return
    if (isSubmitted) return
    if (isHost) return
    console.log("=>(AnswerBoard.tsx:183) answerSet", Array.from(answerSet));
    const msg = {
      invitationCode: gameSession.invitationCode,
      answerIds: Array.from(answerSet),
      nickname: gameSession.nickName,
    }

    setIsSubmitted(true)
    gameSocket()?.emit('submit-answer', msg)
  }

  const exitRoom = () => {
    // dùng clear game session là đủ
    clearGameSession()
    router.push('/')
  }

  const renderAnswersSection = () => {
    if (!currentQuestion) return
    if (!answerSectionFactory) answerSectionFactory = new AnswerSectionFactory(isHost, styles.answerLayout, isSubmitted)
    return answerSectionFactory.initAnswerSectionForType(currentQuestion.type, countDown, currentQuestion, handleSubmitAnswer)
  }

  const renderHostControlSystem = () => {
    return <div className="my-3 d-flex justify-content-between position-fixed fixed-bottom">
      <MoreButton
        iconClassName="bi bi-x-circle-fill"
        className={classNames('text-white fw-medium', styles.nextButton)}
        title="Thoát phòng"
        onClick={exitRoom}
      />
      <MoreButton
        isEnable={countDown <= 0}
        iconClassName="bi bi-bar-chart"
        className={classNames('text-white fw-medium', styles.nextButton)}
        title={'Xem xếp hạng'}
        onClick={viewRanking}
      />
      <MoreButton
        isEnable={isShowNext}
        iconClassName="bi bi-arrow-right-circle-fill"
        className={classNames('text-white fw-medium', styles.nextButton)}
        title="Câu tiếp theo"
        onClick={goToNextQuestion}
      />
    </div>
  }

  return (
    <>
      {isHost && renderHostControlSystem()}
      <div
        className={classNames(
          'd-flex flex-column h-100',
          className,
          styles.container
        )}
      >
        <pre
          className={classNames(
            'fs-4 shadow-sm fw-semiBold p-2 px-3 bg-white mb-2',
            styles.questionTitle
          )}>
          {currentQuestion?.question}
        </pre>

        <QuestionMedia
          //timeout sẽ âm để tránh 1 số lỗi, đừng sửa chỗ này
          timeout={countDown > 0 ? countDown : 0}
          media={currentQuestion?.media ?? null}
          numSubmission={numSubmission}
          key={currentQID}
        />

        {currentQuestion?.question && renderAnswersSection()}

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
        />

        {/* này chắc là thêm state current tab rồi render component theo state điều kiện nha, check active tab theo state luôn  */}
      </div>
    </>
  )
}

export default memo(AnswerBoard)
