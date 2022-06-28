import classNames from 'classnames'
import cn from 'classnames'
import {useRouter} from 'next/router'
import React, {FC, memo, useContext, useEffect, useRef, useState} from 'react'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {TPlayer, TQuestion, TViewResult,} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import styles from './CommunityAnswerBoard.module.css'
import {Fade, Form, FormCheck, Image} from 'react-bootstrap'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import MyModal from "../../MyModal/MyModal";
import {useToasts} from "react-toast-notifications";
import {
  AnswerSectionFactory,
  QuestionTypeDescription
} from "../../GameComponents/AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory";
import GameButton from "../../GameComponents/GameButton/GameButton";
import {QuestionMedia} from "../../GameComponents/QuestionMedia/QuestionMedia";
import LoadingBoard from "../../GameComponents/LoadingBoard/LoadingBoard";
import {useTimer} from "../../../hooks/useTimer/useTimer";
import {usePracticeGameSession} from "../../../hooks/usePracticeGameSession/usePracticeGameSession";
import {Button} from "@restart/ui";
import {ExitContext} from "../CommunityGamePlay/CommunityGamePlay";
import { Howl } from 'howler'

type CommunityAnswerBoardProps = {
  className?: string
  isShowHostControl: boolean
  setIsShowHostControl: React.Dispatch<React.SetStateAction<boolean>>
  sound?: Howl
}

const CommunityAnswerBoard: FC<CommunityAnswerBoardProps> = ({
                                                               className,
                                                               isShowHostControl,
                                                               setIsShowHostControl
                                                             }) => {
  const {
    gameSession,
    clearGameSession,
    gameSocket,
    gameSkOn,
    gameSkEmit,
    gameSkOnce,
    getQuestionWithID,
  } = usePracticeGameSession()
  const exitContext = useContext(ExitContext)
  const timer = useTimer()

  const [lsUser] = useLocalStorage('user', '')
  const [lsGameSessionPlayer] = useLocalStorage('game-session-player', '')
  const [gameSessionPlayer, setGameSessionPlayer] = useState<TPlayer>()
  const [currentQID, setCurrentQID] = useState<number>(-1)
  const [quizLength, setQuizLength] = useState<number>(0)

  const router = useRouter()

  const [currentQuestion, setCurrentQuestion] = useState<TQuestion | null>(null)

  const [isShowNext, setIsShowNext] = useState<boolean>(false)
  const [autoNextCountDown, setAutoNextCountDown] = useState<number>(5)
  const [isShowEndGame, setIsShowEndGame] = useState<boolean>(false)

  const [autoNext, setAutoNext] = useState<boolean>(false)
  const [submit, setSubmit] = useState<boolean>(false)

  const [loading, setLoading] = useState<string | null>(null)

  const _numSubmission = useRef<number>(0)
  const [numSubmission, setNumSubmission] = useState<number>(0)
  const [viewResultData, setViewResultData] = useState<TViewResult>()

  const {addToast} = useToasts()
  const {fromMedium} = useScreenSize()
  let answerSectionFactory: AnswerSectionFactory

  useEffect(() => {
    handleSocket()
    resetState()
    setLoading("Chuẩn bị!")
    console.log("=>(CommunityAnswerBoard.tsx:77) goilao");
  }, [])

  useEffect(() => {
    if (lsGameSessionPlayer?.length) {
      setGameSessionPlayer(JsonParse(lsGameSessionPlayer))
    }
  }, [lsGameSessionPlayer])

  useEffect(() => {
    if (!gameSession) return
    if (currentQID < 0) {
      const firstQuestion = getQuestionWithID(0)
      if (firstQuestion) {
        setCurrentQID(0)
        displayQuestion(firstQuestion)
        timer.setDefaultDuration(firstQuestion.duration)
        setNumSubmission(0)
      }
      const quizLength = gameSession.quiz.questions.length
      if (quizLength) {
        setQuizLength(quizLength)
      }
    }
  }, [gameSession])

  useEffect(() => {
    setIsShowEndGame((currentQID == quizLength - 1) && !timer.isCounting)
  }, [currentQID, quizLength]);

  const displayQuestion = (question: TQuestion) => {
    console.log("=>(CommunityAnswerBoard.tsx:116) Display question", question);
    if (question && question.duration > 0)
      setCurrentQuestion(question)
  }

  function resetState() {
    // if (gameSession)

    // else
    //   setLoading(null)
    setLoading(null)
    timer.setIsShowSkeleton(true)
    setIsShowNext(false)
    setIsNextEmitted(false)
  }
  const intervalRef = useRef<NodeJS.Timer | null>(null)

  useEffect(() => {
    if (!autoNext && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [autoNext])

  useEffect(() => {
    if (submit) {
      if (currentQID >= quizLength - 1) {
        setIsShowHostControl(true)
      } else if (autoNext) {
        for (let i = 0; i <= 5; i++) {
          setTimeout(() => {
            setAutoNextCountDown(5 - i)
          }, i * 1000)
        }
        intervalRef.current = setInterval(() => {
          console.log("=>(CommunityAnswerBoard.tsx:138) autoNext", autoNext);
          if (autoNext) {
            goToNextQuestion()
          }
        }, 5000)
      } else {
        setIsShowHostControl(true)
      }
      setSubmit(false)
    }
  }, [submit])

  const handleSocket = () => {
    if (!gameSocket()) return
    gameSkOnce('game-started', (data) => {
      _numSubmission.current = 0
      setNumSubmission(_numSubmission.current)
      setAutoNextCountDown(5)
      setIsNextEmitted(false)
      timer.startCounting(data.question.duration ?? 0)
      setIsShowHostControl(false)
      setLoading(null)
    })

    gameSkOn('next-question', (data) => {
      _numSubmission.current = 0
      setNumSubmission(_numSubmission.current)
      setAutoNextCountDown(5)
      setIsNextEmitted(false)
      timer.startCounting(data.question.duration ?? 0)
      setIsShowHostControl(false)
      setLoading(null)
    })

    gameSkOn('view-result', (data: TViewResult) => {
      timer.countDown >= 0 ? setLoading("Đã trả lời!") : setLoading("Hết giờ!")
      setTimeout(() => {
        setLoading(null)
      }, 1000)
      timer.stopCounting(true)
      setViewResultData(data)
      setIsShowNext(true)
      if (data?.player && typeof window !== 'undefined') {
        localStorage.setItem(
          'game-session-player',
          JSON.stringify(data?.player)
        )
      }
      setSubmit(true)
    })

    gameSkOn('loading', (data) => {
      if (data?.question?.question) {
        timer.setIsShowSkeleton(true)
        setIsShowNext(false)
        setIsNextEmitted(true)

        const currentQuestionId = data.question.currentQuestionIndex as number
        const newQuestion = data.question.question as TQuestion

        if (currentQID != currentQuestionId) {
          setCurrentQID(currentQuestionId)
          displayQuestion(newQuestion)
        }
        timer.setDefaultDuration(newQuestion.duration)
        setNumSubmission(0)
        setLoading("Chuẩn bị!")
      }
      if (data?.loading) {
        setLoading(data.loading)
      }
    })
  }

  const handleSubmitAnswer = (answer: any) => {
    if (!gameSession) return
    if (!timer.isSubmittable) return

    let msg = {
      invitationCode: gameSession.invitationCode,
      nickname: gameSession.nickName,
      answerIds: [] as any[],
      answer: '',
    }

    if (answer instanceof Set) {
      console.log('=>(AnswerBoard.tsx:174) submit set "', answer, '"')
      msg.answerIds = Array.from(answer)
    } else if (answer instanceof Array) {
      console.log('=>(AnswerBoard.tsx:174) submit array "', answer, '"')
      msg.answerIds = answer
    } else if (typeof answer === 'string') {
      console.log('=>(AnswerBoard.tsx:174) submit text "', answer, '"')
      msg.answer = answer
    } else {
      console.log('=>(AnswerBoard.tsx:191) not supported "', answer, '"')
      return
    }
    if (currentQuestion && currentQuestion.type != "22POLL")
      timer.setIsSubmittable(false)
    if (msg.answer || msg.answerIds) gameSkEmit('submit-answer', msg)
  }

  const renderAnswersSection = () => {
    if (!currentQuestion) return
    if (!answerSectionFactory)
      answerSectionFactory = new AnswerSectionFactory(
        false,
        styles.answerLayout,
      )
    return answerSectionFactory.initAnswerSectionForType(
      currentQuestion.type,
      currentQuestion,
      handleSubmitAnswer,
    )
  }


  const [isNextEmitted, setIsNextEmitted] = useState<boolean>(false)

  const goToNextQuestion = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (!gameSession) return
    const msg = {invitationCode: gameSession.invitationCode}
    gameSkEmit('next-question', msg)
  }

  function endGame() {
    if (gameSession && gameSocket() != null) {
      const msg = {invitationCode: gameSession.invitationCode}
      gameSkEmit('game-ended', msg)
      clearGameSession()
      router.push('/')
    }
  }

  function getEndGameModal() {
    return <MyModal
      show={exitContext.showEndGameModal}
      onHide={() => exitContext.setShowEndGameModal(false)}
      activeButtonTitle="Đồng ý"
      activeButtonCallback={endGame}
      inActiveButtonCallback={() => exitContext.setShowEndGameModal(false)}
      inActiveButtonTitle="Huỷ"
    >
      <div className="text-center h3 fw-bolder">
        Kết thúc game?
      </div>

      <div className="text-center fw-bold">
        <div className="text-secondary fs-24x">
          {currentQID + 1 <
          (gameSession?.quiz?.questions?.length ?? 0) ?
            <>
              {"Quiz mới hoàn thành "}
              <span className="fw-bolder fs-24x  text-primary">
              {currentQID + 1}
                </span>
              {" câu, còn "}
              <span className="fw-bolder fs-24x  text-primary">
              {gameSession?.quiz?.questions?.length}
                </span>
              {" câu chưa hoàn thành!"}
            </>
            :
            <>
              {"Quiz đã hoàn thành tất cả "}
              <span className="fw-bolder fs-24x  text-primary">
              {currentQID + 1}
                </span>
              {" câu trên "}
              <span className="fw-bolder fs-24x  text-primary">
              {gameSession?.quiz?.questions?.length}
                </span>
              {" câu!"}
            </>
          }
        </div>
        <div className="text-secondary fs-24x text-warning">
          Các thành viên trong phòng sẽ không thể chat với nhau nữa, bạn có chắc chắn muốn kết thúc phòng?
        </div>
      </div>
    </MyModal>;
  }

  const renderHostControlSystem = () => {
    return (
      <Fade in={(isShowHostControl || fromMedium)}>
        {(isShowHostControl || fromMedium) ?
          <div className={cn(styles.hostControl, "px-2 py-2 flex-end")}>
            {!isShowEndGame && <GameButton
                isEnable={true}
                iconClassName={cn("bi", {"bi-pause-circle-fill": !autoNext, "bi-play-circle": autoNext})}
                className={classNames('text-white fw-medium', {
                  "bg-secondary": !autoNext
                })}
                title={autoNext ? `Tự qua câu sau ${autoNextCountDown} giây` : "Bật tự qua câu"}
                onClick={() => setAutoNext(!autoNext)}
            />}
            {!isShowEndGame &&
                <GameButton
                    isEnable={!isNextEmitted && !timer.isCounting}
                    iconClassName="bi bi-arrow-right-circle-fill"
                    className={classNames('text-white fw-medium')}
                    title="Câu sau"
                    onClick={goToNextQuestion}
                />
            }
            {
              isShowEndGame &&
                <GameButton
                    isEnable={true}
                    iconClassName="bi bi-x-octagon-fill"
                    className={classNames('text-white fw-medium bg-danger')}
                    title="Kết thúc game"
                    onClick={() => exitContext.setShowEndGameModal(true)}
                />
            }
          </div>
          :
          <></>
        }
      </Fade>
    )
  }

  return (
    <>
      <div
        className={classNames(
          'd-flex flex-column',
          className,
          styles.container
        )}
      >
        {currentQuestion?.question && (
          <div className={classNames("d-flex flex-column bg-dark bg-opacity-50 rounded-10px shadow mb-2")}>
            <div className="pt-2 px-2 d-flex align-items-center gap-3">
              <Image
                src="/assets/default-logo.png"
                width={40}
                height={40}
                className="rounded-circle"
                alt=""
              />
              <div className="fw-medium fs-20px text-white">
                {gameSession?.host?.name ?? "Ẩn danh"}
              </div>
            </div>
            <div className="px-2 pb-2 text-white d-flex gap-3 align-items-center justify-content-between">
              {/*câu hỏi hiện tại*/}
              <div className="fw-medium fs-32px text-primary">
                {currentQID + 1}/
                <span className="text-secondary fs-24px">
                  {gameSession?.quiz?.questions?.length}
                </span>
              </div>

              {/*streak hiện tại*/}
              <div className={"fs-32px"}>
                <span className="me-2">🔥</span>
                {viewResultData?.player?.currentStreak ?? 0}
              </div>

              {/*điểm*/}
              <div className="fs-32px">
                <span className="text-primary me-2 ">Điểm</span>
                {Math.floor(viewResultData?.player?.score ?? 0)}
              </div>
            </div>
          </div>
        )}

        <QuestionMedia
          //timeout sẽ âm để tránh 1 số lỗi, đừng sửa chỗ này
          media={currentQuestion?.media ?? null}
          numStreak={0}
          numSubmission={numSubmission}
          key={currentQID}
          className={styles.questionMedia}
        />

        <div
          className={classNames('shadow px-3 pt-2 bg-white mb-2', styles.questionTitle,
            {'rounded-10px': fromMedium})}>
          <div
            dangerouslySetInnerHTML={{__html: currentQuestion?.question ?? ""}}
          />
        </div>
        {
          currentQuestion &&
            <div
                className={classNames('noselect px-2 py-2 fs-4 fw-bold text-white mb-2 bg-dark bg-opacity-50 d-flex justify-content-between align-items-center',
                  {'rounded-10px': fromMedium})}>
                <div className={""}>
                    <i className={cn("fs-20px text-white me-2", QuestionTypeDescription[currentQuestion.type].icon)}/>
                  {QuestionTypeDescription[currentQuestion.type].title}
                </div>
                <GameButton
                    isEnable={timer.isSubmittable}
                    iconClassName="bi bi-check-circle-fill"
                    className={classNames('text-white fw-medium bg-warning', styles.submitButton)}
                    title={'Trả lời'}
                    onClick={() => {
                      timer.stopCounting(false)
                    }}
                />
            </div>
        }

        {currentQuestion?.question && renderAnswersSection()}
        {renderHostControlSystem()}
        <div className={styles.blankDiv}></div>
        {getEndGameModal()}

        <LoadingBoard
          loading={loading != null}
          className={"position-fixed top-0 bottom-0 start-0 end-0"}
          loadingTitle={loading ?? ""}
        />
      </div>
    </>
  )
}

export default memo(CommunityAnswerBoard)
