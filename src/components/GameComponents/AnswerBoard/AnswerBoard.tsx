import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC, memo, useEffect, useState } from 'react'
import { Image, Modal, Navbar } from 'react-bootstrap'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../../hooks/useSocket/useSocket'
import { TStartQuizResponse, TUser } from '../../../types/types'
import { JsonParse } from '../../../utils/helper'
import MyModal from '../../MyModal/MyModal'
import SingleChoiceAnswerSection from '../AnswerQuestionComponent/SelectionQuestion/SingleChoiceAnswerSection'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
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
  const [timeout, _setTimeout] = useState<number>(-1)

  const [showTimeout, setShowTimeout] = useState<boolean>(false)
  const [_interval, _setInterval] = useState<NodeJS.Timer | undefined>()
  useEffect(() => {
    const gameData: TStartQuizResponse = JsonParse(
      lsGameSession
    ) as TStartQuizResponse

    const user: TUser = JsonParse(lsUser)
    setIsHost(user.id === gameData.hostId)
    setId(0)
  }, [lsGameSession, lsUser])

  useEffect(() => {
    const question = gameSession?.quiz?.questions[qid]
    if (question.duration > 0) {
      _setTimeout(question.duration)
    }
  }, [gameSession, qid])

  useEffect(() => {
    if (timeout <= 0) {
      setShowTimeout(true)
      return
    }
    const interval = setInterval(() => {
      if (timeout > 0) {
        _setTimeout(timeout - 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timeout])

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
          {timeout}
        </div>
        <Image
          src={
            gameSession?.quiz?.questions[qid]?.media ||
            'assets/default-question-image.png'
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
      )} */}

      {!isHost ? (
        <MyModal
          show={true}
          onHide={() => setShowRanking(false)}
          size="sm"
          header={
            <Modal.Title className="text-danger">Hết thời gian</Modal.Title>
          }
        >
          <div className="px-1 text-center">
            Ôi khum! Bạn đã hết thời gian làm bài
          </div>
        </MyModal>
      ) : null}

      <GameSessionRanking
        show={showRanking}
        onHide={() => setShowRanking(false)}
        rankingData={rankingData}
      />

      {/* này chắc là thêm state current tab rồi render component theo state điều kiện nha, check active tab theo state luôn  */}
      <Navbar
        fixed="bottom"
        // cái bg với variant này m chỉnh màu khác cũng được
        // https://react-bootstrap.github.io/components/navbar/#color-schemes
        bg="dark"
        variant="dark"
        className="justify-content-around py-0"
      >
        {/* tab active thì có border xanh với chữ xanh */}
        <Navbar.Text className="w-100 cursor-pointer p-0">
          <div className="p-3 w-100 border-top border-5 border-primary text-center text-primary">
            ???
          </div>
        </Navbar.Text>

        {/* tab bình thường */}
        <Navbar.Text className="w-100 cursor-pointer p-0 text-center">
          <div className="p-3 w-100">???</div>
        </Navbar.Text>
      </Navbar>
    </div>
  )
}

export default memo(AnswerBoard)
