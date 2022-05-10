import React, { FC, useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import styles from './AnswerBoard.module.css'
import classNames from 'classnames'
import MultipleChoiceAnswerSection from '../AnswerQuestionComponent/SelectionQuestion/MultipleChoiceAnswerSection'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { TQuestion, TStartQuizResponse, TUser } from '../../../types/types'
import { JsonParse } from '../../../utils/helper'
import { useSocket } from '../../../hooks/useSocket/useSocket'
import MoreButton from '../MoreButton/MoreButton'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'

type AnswerBoardProps = {
  className?: string
  questionId: number | 0
  onClick?: React.MouseEventHandler<HTMLDivElement>
  title?: string
}
const AnswerBoard: FC<AnswerBoardProps> = ({
  className,
  questionId,
  onClick,
  title,
}) => {
  const [lsGameSession] = useLocalStorage('game-session', '')
  const [questions, setQuestions] = useState<TQuestion[]>([])
  const { socket } = useSocket()
  const gameSession = useGameSession()
  const [lsUser] = useLocalStorage('user', '')
  const [isHost, setIsHost] = useState<boolean>(false)
  const [id, setId] = useState<number>(0)

  useEffect(() => {
    const gameData: TStartQuizResponse = JsonParse(
      lsGameSession
    ) as TStartQuizResponse

    const user: TUser = JsonParse(lsUser)
    setIsHost(user.id === gameData.hostId)
    setId(0)
    console.log('danh sách câu hỏi ', gameData.quiz.questions)
  }, [])

  useEffect(() => {
    socket?.on('new-submission', (data) => {
      console.log('new-submission', data)
    })

    socket?.on('next-question', (data) => {
      console.log('next-question', data)
      if (data.currentQuestionIndex) {
        console.log('data.currentQuestionIndex', data.currentQuestionIndex)
        setId(data.currentQuestionIndex)
      }
    })

    socket?.on('timeout', (data) => {
      console.log('timeout', data)
    })

    socket?.on('error', (data) => {
      console.log('error', data)
    })

    socket?.on('ranking', (data) => {
      console.log('ranking', data)
    })
  }, [socket])

  const goToNextQuestion = () => {
    const msg = { invitationCode: gameSession.invitationCode }
    socket?.emit('next-question', msg)
    console.log(msg)
  }

  const viewRanking = () => {
    const msg = { invitationCode: gameSession.invitationCode }
    socket?.emit('view-ranking', msg)
    console.log(msg)
  }

  const handleSubmitAnswer = (answerId: number) => {
    const msg = {
      invitationCode: gameSession.invitationCode,
      answerIds: [answerId],
      nickname: gameSession.nickName,
    }
    console.log('submit', msg)
    socket.emit('submit-answer', msg)
  }

  return (
    <div
      className={classNames(
        'd-flex flex-column bg-white ',
        className,
        styles.container
      )}
    >
      <div className="fs-4 fw-semiBold pt-3">
        {gameSession?.quiz?.questions[id]?.question}
      </div>
      <MultipleChoiceAnswerSection
        handleSubmitAnswer={handleSubmitAnswer}
        className="flex-grow-1"
        option={gameSession?.quiz?.questions[id]}
      ></MultipleChoiceAnswerSection>
      {isHost && (
        <div className="d-flex gap-3 justify-content-between">
          <MoreButton
            iconClassName="bi bi-bar-chart"
            className={classNames('text-white fw-medium', styles.nextButton)}
            title="Xem xếp hạng"
            onClick={viewRanking}
          />          
          <MoreButton
            iconClassName="bi bi-arrow-right-circle-fill"
            className={classNames('text-white fw-medium', styles.nextButton)}
            title="Câu tiếp theo"
            onClick={goToNextQuestion}
          />
        </div>
      )}

    </div>
  )
}

export default AnswerBoard
