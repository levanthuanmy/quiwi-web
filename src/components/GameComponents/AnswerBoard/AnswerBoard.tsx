import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC, memo, useEffect, useState } from 'react'
import { Col, Modal, Row, Table } from 'react-bootstrap'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../../hooks/useSocket/useSocket'
import { TStartQuizResponse, TUser } from '../../../types/types'
import { JsonParse } from '../../../utils/helper'
import MyModal from '../../MyModal/MyModal'
import SingleChoiceAnswerSection from '../AnswerQuestionComponent/SelectionQuestion/SingleChoiceAnswerSection'
import MoreButton from '../MoreButton/MoreButton'
import styles from './AnswerBoard.module.css'

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
  const [showRanking, setShowRanking] = useState<boolean>(false)
  const [rankingData, setRankingData] = useState<any[]>([])

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

    socket?.on('view-result', (data) => {
      console.log('view', data)
      setRoomStatus('Xem xếp hạng')
      setIsShowAnswer(true)
    })

    socket?.on('timeout', (data) => {
      setIsShowAnswer(true)
      setRoomStatus('Hết giờ')
      console.log('timeout', data)
    })

    socket?.on('ranking', (data) => {
      setShowRanking(true)
      setRankingData(data?.playersSortedByScore)
      console.log('ranking', data)
    })

    socket?.on('error', (data) => {
      console.log('answer board socket error', data)
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

  const exitRoom = () => {
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
      className={classNames(
        'd-flex flex-column bg-white ',
        className,
        styles.container
      )}
    >
      <div className="fs-4 fw-semiBold pt-3">
        {gameSession?.quiz?.questions[qid]?.question}
      </div>

      {gameSession?.quiz?.questions[qid]?.question && renderAnswersSection()}
      {isHost && (
        <div className="d-flex gap-3 justify-content-between">
          <MoreButton
            iconClassName="bi bi-x-circle-fill"
            className={classNames('text-white fw-medium', styles.nextButton)}
            title="Thoát phòng"
            onClick={exitRoom}
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
      )}

      <GameSessionRanking
        show={showRanking}
        onHide={() => setShowRanking(false)}
        rankingData={rankingData}
      />
    </div>
  )
}

export default memo(AnswerBoard)

type GameSessionRankingProps = {
  show: boolean
  onHide: () => void
  rankingData: any[]
}
const GameSessionRanking: FC<GameSessionRankingProps> = ({
  show,
  onHide,
  rankingData,
}) => {
  return (
    <MyModal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen
      header={<Modal.Title>Bảng xếp hạng</Modal.Title>}
    >
      <div className="rounded-14px border overflow-hidden">
        <Table borderless className="mb-0">
          <tbody>
            <tr className="border-bottom bg-primary bg-opacity-10 fw-medium">
              <td className="p-3">#</td>
              <td className="p-3">Tên người tham dự</td>
              <td className="p-3">Điểm số</td>
              <td className="p-3">Liên tiếp</td>
            </tr>
            {rankingData?.map((item, key) => (
              <tr
                key={key}
                className={classNames({
                  'border-top': key !== 0,
                })}
              >
                <td className="p-3">
                  <div
                    className={classNames(
                      'd-flex justify-content-center align-items-center fw-medium',
                      {
                        'rounded-circle text-white': key < 3,
                        'bg-warning': key === 0,
                        'bg-secondary bg-opacity-50': key === 1,
                        'bg-bronze': key === 2,
                      }
                    )}
                    style={{ width: 30, height: 30 }}
                  >
                    {key + 1}
                  </div>
                </td>
                <td className="p-3">{item?.nickname}</td>
                <td className="p-3">
                  <div
                    className={classNames(
                      'py-1 px-2 fw-medium text-center rounded-10px overflow-hidden',
                      {
                        'text-white': key < 3,
                        'bg-warning': key === 0,
                        'bg-secondary bg-opacity-50': key === 1,
                        'bg-bronze': key === 2,
                        'bg-secondary bg-opacity-75': key > 2,
                      }
                    )}
                    style={{ width: 90 }}
                  >
                    {Math.round(item?.score)}
                  </div>
                </td>
                <td className="p-3">{item?.currentStreak}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </MyModal>
  )
}
