import classNames from 'classnames'
import {useRouter} from 'next/router'
import React, {FC, memo, useEffect, useState} from 'react'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {useSocket} from '../../../hooks/useSocket/useSocket'
import {TQuestion, TStartQuizResponse, TUser} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import MoreButton from '../MoreButton/MoreButton'
import {QuestionMedia} from '../QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'
import {AnswerSectionFactory} from "../AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory";

type AnswerBoardProps = {
  className?: string
  questionId: number | 0
}

const AnswerBoard: FC<AnswerBoardProps> = ({className, questionId}) => {
  const {gameSession, saveGameSession, clearGameSession, gameSocket} = useGameSession()
  const socket = gameSocket()
  
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
  const [itIsTimeToSubmitYourAwesomeAnswer, setItIsTimeToSubmitYourAwesomeAnswer] = useState<boolean>(false)
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
      setCurrentQID(0)
    }
  }, [gameSession])

  //  mỗi lần nhảy câu mới thì gọi
  useEffect(() => {
    const question = gameSession?.quiz?.questions[currentQID]
    console.log("=>(AnswerBoard.tsx:61) gameSession?.quiz?.questions", gameSession?.quiz?.questions);
    if (question) {
      if (question.duration > 0) {
        let endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() + question.duration);
        let endTime = Math.round(endDate.getTime());
        setEndTime(endTime)
        setCurrentQuestion(question)
      }
    }
  }, [currentQID])

  // hết giờ thì handle như nào?
  const handleTimeout = () => {
    if (!isSubmitted) {
      setItIsTimeToSubmitYourAwesomeAnswer(true)
    }
  }

  // nhảy mỗi lần countdown
  useEffect(() => {
    if (!currentQuestion) return
    setCountDown(currentQuestion.duration)
    const interval = setInterval(() => {
      let curr = Math.round((new Date()).getTime());
      let _countDown = Math.ceil((endTime - curr) / 1000);
      setCountDown(_countDown)

      if ((_countDown <= 0)) {
        handleTimeout()
        clearInterval(interval)
      }
    }, 1000)
  }, [endTime])

  useEffect(() => {

  }, [isSubmitted])

  const displayQuestionId = (questionId: number) => {
    resetGameState()
    setCurrentQID(questionId)
  }

  const resetGameState = () => {
    setIsSubmitted(false)
    setItIsTimeToSubmitYourAwesomeAnswer(false)
  }

  const handleSocket = () => {
    if (!socket) return
    socket.off('new-submission')
    socket.on('new-submission', (data) => {
      console.log('new-submission', data)
      // nhớ check mode
      setNumSubmission(numSubmission + 1)
    })

    socket.off('next-question')
    socket.on('next-question', (data) => {
      setIsShowNext(false)
      setShowRanking(false)

      saveGameSession({
        ...JsonParse(localStorage.getItem('game-session')),
        players: [...rankingData],
      } as TStartQuizResponse)
      // setRoomStatus('Đang trả lời câu hỏi')
      console.log('next-question', data)
      if (currentQID != data.currentQuestionIndex) {
        displayQuestionId(data.currentQuestionIndex)
      }
    })

    socket.off('view-result')
    socket.on('view-result', (data) => {
      console.log('view', data)
      // setRoomStatus('Xem xếp hạng')
    })

    socket.off('timeout')
    socket.on('timeout', (data) => {
      console.log('timeout', data)
      handleTimeout()
    })

    socket.off('ranking')
    socket.on('ranking', (data) => {
      setShowRanking(true)
      setRankingData(data?.playersSortedByScore)
      console.log('view-ranking', data)
    })

    socket.off('error')
    socket.on('error', (data) => {
      console.log('answer board socket error', data)
    })
  }

  const goToNextQuestion = () => {
    if (!gameSession?.quiz?.questions) return
    if (currentQID >= gameSession?.quiz?.questions.length - 1) {
      return
    }

    const msg = {invitationCode: gameSession.invitationCode}
    socket?.emit('next-question', msg)
    console.log(msg)
  }

  const viewRanking = () => {
    if (!gameSession) return
    const msg = {invitationCode: gameSession.invitationCode}
    socket?.emit('view-ranking', msg)
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
    socket?.emit('submit-answer', msg)
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
          timeout={countDown}
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
