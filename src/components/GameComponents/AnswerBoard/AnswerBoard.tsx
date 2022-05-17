import classNames from 'classnames'
import { useRouter } from 'next/router'
import { FC, memo, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../../hooks/useSocket/useSocket'
import { TStartQuizResponse, TUser } from '../../../types/types'
import { JsonParse } from '../../../utils/helper'
import MyModal from '../../MyModal/MyModal'
import SingleChoiceAnswerSection from '../AnswerQuestionComponent/SelectionQuestion/SingleChoiceAnswerSection'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import MoreButton from '../MoreButton/MoreButton'
import { QuestionMedia } from '../QuestionMedia/QuestionMedia'
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
  const [numSubmission, setNumSubmission] = useState<number>(0)

  const [showTimeout, setShowTimeout] = useState<boolean>(false)
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

  const handleTimeout = () => {
    if (roomStatus === 'Đang trả lời câu hỏi') {
      setShowTimeout(true)
      setRoomStatus('Hết giờ')
      setIsShowAnswer(true)
    }
  }

  useEffect(() => {
    if (timeout == 0) {
      handleTimeout()
      return
    }
    const interval = setInterval(() => {
      if (timeout > 0) {
        _setTimeout(timeout - 1)
      }
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeout])

  const displayQuestionId = (questionId: number) => {
    setIsShowAnswer(false)
    setAnswerSet(new Set())
    setId(questionId)
  }

  const handleSocket = () => {
    socket?.on('new-submission', (data) => {
      console.log('new-submission', data)

      // nhớ check mode

      setNumSubmission(numSubmission + 1)
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
      console.log('timeout', data)
      if (timeout === 0) {
        handleTimeout()
      }
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
    <div className="d-flex flex-column">
      <div className="my-3 d-flex justify-content-between">
        <MoreButton
          iconClassName="bi bi-x-circle-fill"
          className={classNames('text-white fw-medium', styles.nextButton)}
          title="Thoát phòng"
          onClick={exitRoom}
        />
        <MoreButton
          isEnable={isShowAnswer}
          iconClassName="bi bi-bar-chart"
          className={classNames('text-white fw-medium', styles.nextButton)}
          title={'Tiếp theo'}
          onClick={viewRanking}
        />
      </div>
      <div
        className={classNames(
          'd-flex flex-column',
          className,
          styles.container
        )}
      >
        <div
          className={classNames(
            'fs-4 shadow-sm fw-semiBold p-3 px-4 bg-white mb-4',
            styles.questionTitle
          )}
        >
          {gameSession?.quiz?.questions[qid]?.question}
        </div>

        <QuestionMedia
          timeout={timeout}
          media={gameSession?.quiz?.questions[qid]?.media}
          numSubmission={numSubmission}
          key={qid}
        />

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
            show={showTimeout}
            onHide={() => setShowTimeout(false)}
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
      </div>
    </div>
  )
}

export default memo(AnswerBoard)
