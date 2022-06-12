import classNames from 'classnames'
import cn from 'classnames'
import {useRouter} from 'next/router'
import React, {FC, memo, useEffect, useRef, useState} from 'react'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {TQuestion, TStartQuizResponse, TUser, TViewResult,} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import GameSessionRanking from '../GameSessionRanking/GameSessionRanking'
import {QuestionMedia} from '../QuestionMedia/QuestionMedia'
import styles from './AnswerBoard.module.css'
import {AnswerSectionFactory} from '../AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import {Fade} from "react-bootstrap";
import GameButton from "../GameButton/GameButton";
import useScreenSize from "../../../hooks/useScreenSize/useScreenSize";

type AnswerBoardProps = {
  className?: string
  isShowHostControl: boolean
}

const AnswerBoard: FC<AnswerBoardProps> = ({className, isShowHostControl}) => {
  const {
    gameSession,
    saveGameSession,
    clearGameSession,
    gameSocket,
    gameSkOn,
    getQuestionWithID,
    getNickName
  } = useGameSession()

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
  const [isCounting, setIsCounting] = useState<boolean>(false)

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const _numSubmission = useRef<number>(0)
  const [numSubmission, setNumSubmission] = useState<number>(0)
  const [numStreak, setNumStreak] = useState<number>(0)
  const [viewResultData, setViewResultData] = useState<TViewResult>()

  const {fromMedium} = useScreenSize()
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
        console.log('client timeout')
        _clearInterval();
      }
    }, 1000)
    resetGameState()
  }, [endTime])

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
      setViewResultData(data)
    })

    gameSkOn('timeout', (data) => {
      //nếu mà chưa countdown xong thì set count down
      if (intervalRef.current) {
        _clearInterval()
        setCountDown( 0)
      }
    })

    gameSkOn('ranking', (data) => {
      setShowRanking(true)
      const rkData: any[] = data?.playersSortedByScore
      setRankingData(rkData)
      const user: TUser = JsonParse(lsUser)
      const uData = rkData.filter(player => player?.nickname == getNickName())[0]
      // console.log("=>(AnswerBoard.tsx:125) uData", uData);
      if (uData) {
        if (uData?.currentStreak)
          setNumStreak(uData.currentStreak)
      }


    })

    gameSkOn('error', (data) => {

    })
  }

  const goToNextQuestion = () => {
    if (!gameSession) return
    const msg = {invitationCode: gameSession.invitationCode}
    gameSocket()?.emit('next-question', msg)
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
      console.log('=>(AnswerBoard.tsx:174) submit set "',answer,'"')
      msg.answerIds = Array.from(answer)
    } else if (answer instanceof Array) {
      console.log('=>(AnswerBoard.tsx:174) submit array "',answer,'"')
      msg.answerIds = answer
    } else if (typeof answer === 'string') {
      console.log('=>(AnswerBoard.tsx:174) submit text "', answer, '"')
      msg.answer = answer
    } else {
      console.log('=>(AnswerBoard.tsx:191) not supported "',answer,'"')
      return;
    }
    setIsSubmitted(true)
    setIsCounting(false)
    if (msg.answer || msg.answerIds)
      gameSocket()?.emit('submit-answer', msg)
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

  const renderHostControlSystem = () => {
    return (
      <Fade in={isShowHostControl || fromMedium}>
        {(isShowHostControl || fromMedium) ?
          (<div className={cn(styles.hostControl)}>
            <GameButton
              iconClassName="bi bi-x-circle-fill"
              className={classNames('text-white fw-medium')}
              title="Thoát"
              onClick={exitRoom}
            />
            <GameButton
              isEnable={countDown <= 0}
              iconClassName="bi bi-bar-chart"
              className={classNames('text-white fw-medium')}
              title={'Xếp hạng'}
              onClick={viewRanking}
            />
            <GameButton
              isEnable={isShowNext}
              iconClassName="bi bi-arrow-right-circle-fill"
              className={classNames('text-white fw-medium')}
              title="Câu sau"
              onClick={goToNextQuestion}
            />
          </div>) : <></>
        }
      </Fade>
    )
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
          timeout={countDown > 0 ? countDown : 0}
          media={currentQuestion?.media ?? null}
          numStreak={numStreak}
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

        {/* này chắc là thêm state current tab rồi render component theo state điều kiện nha, check active tab theo state luôn  */}
      </div>
    </>
  )
}

export default memo(AnswerBoard)
