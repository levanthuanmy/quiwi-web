/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import _ from 'lodash'
import {useRouter} from 'next/router'
import {FC, memo, useEffect, useRef, useState} from 'react'
import {useCommunitySocket} from '../../../hooks/useCommunitySocket/useCommunitySocket'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import {TQuestion, TStartQuizResponse, TUser} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import {
  AnswerSectionFactory
} from '../../GameComponents/AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import MoreButton from '../../GameComponents/MoreButton/MoreButton'
import {QuestionMedia} from '../../GameComponents/QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'

type AnswerBoardProps = {
  className?: string
  questionId: number | 0
}

const AnswerBoard: FC<AnswerBoardProps> = ({className, questionId}) => {
  const {
    gameSession,
    saveGameSession,
    clearGameSession,
    gameSocket,
    getQuestionWithID,
  } = useGameSession()
  const {socket} = useCommunitySocket()

  const [lsUser] = useLocalStorage('user', '')
  const [currentQID, setCurrentQID] = useState<number>(-1)

  const router = useRouter()

  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(null)

  const [isShowNext, setIsShowNext] = useState<boolean>(false)

  const [endTime, setEndTime] = useState<number>(0)
  const [countDown, setCountDown] = useState<number>(-101)

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const [numSubmission, setNumSubmission] = useState<number>(0)
  const {fromMedium} = useScreenSize()
  const intervalRef = useRef<NodeJS.Timer | null>(null)

  let answerSectionFactory: AnswerSectionFactory

  useEffect(() => {
    handleSocket()
  }, [])

  useEffect(() => {
    if (!gameSession) return
    if (currentQID < 0) {
      const firstQuestion = getQuestionWithID(0)
      if (firstQuestion) {
        setCurrentQID(0)
        displayQuestion(firstQuestion)
      }
    }
  }, [gameSession])

  // nhảy mỗi lần countdown
  useEffect(() => {
    if (!currentQuestion) return
    setCountDown(currentQuestion.duration)
    intervalRef.current = setInterval(() => {
      let curr = Math.round(new Date().getTime())
      let _countDown = Math.ceil((endTime - curr) / 1000)
      setCountDown(_countDown)

      if (_countDown <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 1000)
    resetGameState()
  }, [endTime])

  const resetGameState = () => {
    setIsSubmitted(false)
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

      saveGameSession({
        ...JsonParse(localStorage.getItem('game-session')),
      } as TStartQuizResponse)

      console.log('next-question', data)

      const currentQuestionId = data.currentQuestionIndex as number
      const newQuestion = data.question as TQuestion

      if (currentQID != currentQuestionId) {
        setCurrentQID(currentQuestionId)
        displayQuestion(newQuestion)
      }
    })

    socket.off('view-result')
    socket.on('view-result', (data) => {
      console.log('view', data)
      // setRoomStatus('Xem xếp hạng')
      setIsShowNext(true)

      saveGameSession({
        ...JsonParse(localStorage.getItem('game-session')),
        gameRoundStatistics: [
          ...(gameSession?.gameRoundStatistics ?? []),
          _.get(data, 'gameRoundStatistic'),
        ],
      } as TStartQuizResponse)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setCountDown(0)
      }
    })

    socket.off('timeout')
    socket.on('timeout', (data) => {
      console.log('timeout', data)
      setIsShowNext(true)
    })

    socket.off('error')
    socket.on('error', (data) => {
      console.log('answer board socket error', data)
    })
  }

  const goToNextQuestion = () => {
    if (!gameSession) return
    const msg = {invitationCode: gameSession.invitationCode}
    socket?.emit('next-question', msg)
    console.log(msg)
  }

  const handleSubmitAnswer = (answer: any) => {
    if (!gameSession) return
    if (isSubmitted) return
    let msg = {
      invitationCode: gameSession.invitationCode,
      nickname: gameSession.nickName,
      answerIds: [] as number[],
      answer: '',
    }

    if (answer instanceof Set) {
      console.log('=>(AnswerBoard.tsx:174) submit set')
      msg.answerIds = Array.from(answer)
    } else if (answer instanceof Array) {
      console.log('=>(AnswerBoard.tsx:174) submit array')
      msg.answerIds = answer
    } else if (typeof answer === 'string') {
      console.log('=>(AnswerBoard.tsx:174) submit text')
      msg.answer = answer
    } else {
      console.log('=>(AnswerBoard.tsx:191) not supported')
      return
    }
    setIsSubmitted(true)
    if (msg.answer || msg.answerIds) socket?.emit('submit-answer', msg)
  }
  const exitRoom = () => {
    // dùng clear game session là đủ
    clearGameSession()
    router.push('/')
  }

  const renderAnswersSection = () => {
    if (!currentQuestion) return
    if (!answerSectionFactory)
      answerSectionFactory = new AnswerSectionFactory(
        false,
        styles.answerLayout,
        isSubmitted,
        true,
        countDown
      )
    return answerSectionFactory.initAnswerSectionForType(
      currentQuestion.type,

      currentQuestion,
      handleSubmitAnswer
    )
  }

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

  const renderHostControlSystem = () => {
    return (
      <div className="my-3 d-flex justify-content-between position-fixed fixed-bottom">
        <MoreButton
          iconClassName="bi bi-x-circle-fill"
          className={classNames('text-white fw-medium', styles.nextButton)}
          title="Thoát phòng"
          onClick={exitRoom}
        />

        <MoreButton
          isEnable={isShowNext}
          iconClassName="bi bi-arrow-right-circle-fill"
          className={classNames('text-white fw-medium', styles.nextButton)}
          title="Câu tiếp theo"
          onClick={goToNextQuestion}
        />
      </div>
    )
  }

  return (
    <>
      {renderHostControlSystem()}
      <div
        className={classNames(
          'd-flex flex-column h-100',
          className,
          styles.container
        )}
      >
        {currentQuestion?.question ? (
          <div
            className={classNames(
              'shadow px-3 pt-2 bg-white mb-2 rounded-10px',
              styles.questionTitle
            )}
            dangerouslySetInnerHTML={{__html: currentQuestion.question}}
          />
        ) : (
          <></>
        )}

        <QuestionMedia
          //timeout sẽ âm để tránh 1 số lỗi, đừng sửa chỗ này
          numStreak={0}
          timeout={countDown > 0 ? countDown : 0}
          media={currentQuestion?.media ?? null}
          numSubmission={numSubmission}
          key={currentQID}
          className={styles.questionMedia}
        />
        {currentQuestion?.question && renderAnswersSection()}
      </div>
    </>
  )
}

export default memo(AnswerBoard)
