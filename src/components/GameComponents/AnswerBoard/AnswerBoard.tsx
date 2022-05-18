import classNames from 'classnames'
import {useRouter} from 'next/router'
import React, {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {useSocket} from '../../../hooks/useSocket/useSocket'
import {TUser} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import MyModal from '../../MyModal/MyModal'
import SingleChoiceAnswerSection from '../AnswerQuestionComponent/SelectionQuestion/SingleChoiceAnswerSection'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import MoreButton from '../MoreButton/MoreButton'
import {QuestionMedia} from '../QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'

type AnswerBoardProps = {
  className?: string
  questionId: number | 0
}
const AnswerBoard: FC<AnswerBoardProps> = ({className, questionId}) => {
  const {socket} = useSocket()
  const {gameSession, saveGameSession, clearGameSession} = useGameSession()
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
  const [_interval, _setInterval] = useState<NodeJS.Timer | undefined>()

  useEffect(() => {
    if (!gameSession) return
    const user: TUser = JsonParse(lsUser)
    setIsHost(user.id === gameSession.hostId)
    setId(0)
  }, [gameSession])

  useEffect(() => {
    const question = gameSession?.quiz?.questions[qid]
    if (question) {
      if (question.duration > 0) {
        _setTimeout(question.duration)
      }
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
      console.log('view-result', data)
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
      console.log('view-ranking', data)
    })

    socket?.on('error', (data) => {
      console.log('answer board socket error', data)
    })
  }

  handleSocket()

  const goToNextQuestion = () => {
    console.log('goToNextQuestion - questionId', questionId)
    if (!gameSession?.quiz?.questions) return;
    if (qid == gameSession?.quiz?.questions.length - 1) {
      setIsFinish(true)
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

  const handleSubmitAnswer = (answerId: number) => {
    if (!gameSession) return
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

    socket?.emit('submit-answer', msg)
  }

  const exitRoom = () => {
    // dùng clear game session là đủ
    clearGameSession()
    router.push("/")
  }

  const renderAnswersSection = () => {
    const question = gameSession?.quiz?.questions[qid]
    if (!question) return;
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
          media={gameSession?.quiz?.questions[qid]?.media ?? null}
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
