import React, { FC, useEffect, useState } from 'react'
import styles from './AnswerBoard.module.css'
import classNames from 'classnames'
import SingleChoiceAnswerSection from '../AnswerQuestionComponent/SelectionQuestion/SingleChoiceAnswerSection'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { TStartQuizResponse, TUser } from '../../../types/types'
import { JsonParse } from '../../../utils/helper'
import { useSocket } from '../../../hooks/useSocket/useSocket'
import MoreButton from '../MoreButton/MoreButton'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import { useRouter } from 'next/router'
import MyModal from '../../MyModal/MyModal'
import { Image } from 'react-bootstrap'

type AnswerBoardProps = {
  className?: string
  questionId: number | 0
}
const AnswerBoard: FC<AnswerBoardProps> = ({ className, questionId }) => {
  const [lsGameSession] = useLocalStorage('game-session', '')
  const { socket } = useSocket()
  const gameSession = useGameSession()
  const [lsUser] = useLocalStorage('user', '')
  const [isHost, setIsHost] = useState<boolean>(false)
  const [qid, setId] = useState<number>(0)
  const [answerSet, setAnswerSet] = useState<Set<number>>(new Set())
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(false)
  const router = useRouter()
  const [roomStatus, setRoomStatus] = useState<string>('Đang trả lời câu hỏi')
  const [isShowNext, setIsShowNext] = useState<boolean>(false)

  const [isFinish, setIsFinish] = useState<boolean>(false)
  useEffect(() => {
    const gameData: TStartQuizResponse = JsonParse(
      lsGameSession
    ) as TStartQuizResponse

    const user: TUser = JsonParse(lsUser)
    setIsHost(user.id === gameData.hostId)
    setId(0)
  }, [lsGameSession, lsUser])

  const displayQuestionId = (questionId: number) => {
    setIsShowAnswer(false)
    setAnswerSet(new Set())
    setId(questionId)
  }

  const handleSocket = () => {
    socket?.on('new-submission', (data) => {
      console.log('new-submission', data)
    })

    socket?.on('next-question', (data) => {
      setIsShowNext(false)
      setRoomStatus('Đang trả lời câu hỏi')
      if (data.currentQuestionIndex) {
        displayQuestionId(data.currentQuestionIndex)
      }
    })

    // socket?.on('view-result', (data) => {
    //   console.log('view', data)
    //   setRoomStatus('Xem xếp hạng')
    //   setIsShowAnswer(true)
    // })

    // socket?.on('timeout', (data) => {
    //   setIsShowAnswer(true)
    //   setRoomStatus('Hết giờ')
    //   console.log('timeout', data)
    // })

    socket?.on('error', (data) => {
      console.log('answerboard socket error', data)
    })

    socket?.on('ranking', (data) => {
      console.log('ranking', data)
    })
  }

  handleSocket()

  const goToNextQuestion = () => {
    console.log('goToNextQuestion - questionId', questionId)
    if (qid == gameSession?.quiz?.questions.length - 1) {
      setIsFinish(true)
      return
    }

    const msg = { invitationCode: gameSession.invitationCode }
    socket?.emit('next-question', msg)
    console.log(msg)
  }

  const viewRanking = () => {
    const msg = { invitationCode: gameSession.invitationCode }
    socket?.emit('view-ranking', msg)
    setIsShowNext(true)
  }

  const handleSubmitAnswer = (answerId: number) => {
    if (isShowAnswer) return
    // Chọn và bỏ chọn câu hỏi
    const answers: Set<number> = answerSet
    answers.has(answerId) ? answers.delete(answerId) : answers.add(answerId)
    console.log('handleSubmitAnswer - answers', answers)
    setAnswerSet(new Set(answers))

    const msg = {
      invitationCode: gameSession.invitationCode,
      answerIds: Array.from(answerSet),
      nickname: gameSession.nickName,
    }

    socket.emit('submit-answer', msg)
  }

  const extiRoom = () => {
    localStorage.removeItem('game-session')
    localStorage.removeItem('game-session-player')
    socket.close()
    router.push('/')
  }

  const renderAnswersSection = () => {
    const question = gameSession?.quiz?.questions[qid]
    switch (question.type) {
      case '10SG':
        return (
          <SingleChoiceAnswerSection
            handleSubmitAnswer={handleSubmitAnswer}
            className="flex-grow-1"
            option={gameSession?.quiz?.questions[qid]}
            selectedAnswers={answerSet}
            showAnswer={isShowAnswer}
            isHost={isHost}
          />
        )

      default:
        return (
          <SingleChoiceAnswerSection
            handleSubmitAnswer={handleSubmitAnswer}
            className="flex-grow-1"
            option={gameSession?.quiz?.questions[qid]}
            selectedAnswers={answerSet}
            showAnswer={isShowAnswer}
            isHost={isHost}
          />
        )
    }
  }

  return (
    <div
      className={classNames('d-flex flex-column', className, styles.container)}
    >
      <div
        className={classNames(
          'fs-4 fw-semiBold p-3 px-4 shadow bg-white mb-4',
          styles.questionTitle
        )}
      >
        {gameSession?.quiz?.questions[qid]?.question}
      </div>

      <div className="text-center mb-3 d-flex justify-content-between align-items-center">
        {/* Timeout */}
        <div
          className={classNames(
            'bg-primary text-white p-3 rounded-circle fs-4 fw-medium',
            styles.circleContainer
          )}
        >
          30
        </div>
        <Image
          src={
            gameSession?.quiz.questions[qid]?.media ??
            'https://i.ytimg.com/vi/ByBANt5sz80/maxresdefault.jpg'
          }
          alt="question-image"
          fluid={true}
          className={classNames(styles.questionImage)}
        />
        {/* Số người submit */}
        <div
          className={classNames(
            'bg-primary text-white p-3 rounded-circle fs-4 fw-medium',
            styles.circleContainer
          )}
        >
          0
        </div>
      </div>

      {gameSession?.quiz?.questions[qid]?.question && renderAnswersSection()}
      {/* {isHost && (
        <div className="d-flex gap-3 justify-content-between">
          <MoreButton
            iconClassName="bi bi-x-circle-fill"
            className={classNames('text-white fw-medium', styles.nextButton)}
            title="Thoát phòng"
            onClick={extiRoom}
          />
          <MoreButton
            iconClassName="bi bi-bar-chart"
            className={classNames('text-white fw-medium', styles.nextButton)}
            title={roomStatus}
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
      )} */}

      <MyModal
        show={isFinish}
        onHide={() => {
          // TODO
        }}
        activeButtonTitle="Thoát game"
        activeButtonCallback={() => {
          extiRoom()
          router.push('/')
        }}
      >
        <div className="text-center h3">Thoát game</div>
      </MyModal>
    </div>
  )
}

export default AnswerBoard
