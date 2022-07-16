import {default as classNames, default as cn} from 'classnames'
import {useRouter} from 'next/router'
import React, {FC, memo, useContext, useEffect, useRef, useState} from 'react'
import {Fade, Image} from 'react-bootstrap'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import {useSound} from '../../../hooks/useSound/useSound'
import {useTimer} from '../../../hooks/useTimer/useTimer'
import {TQuestion, TViewResult} from '../../../types/types'
import {SOUND_EFFECT} from '../../../utils/constants'
import {
  AnswerSectionFactory,
  QuestionTypeDescription,
} from '../../GameComponents/AnswerQuestionComponent/AnswerSectionFactory/AnswerSectionFactory'
import GameButton from '../../GameComponents/GameButton/GameButton'
import LoadingBoard from '../../GameComponents/LoadingBoard/LoadingBoard'
import {QuestionMedia} from '../../GameComponents/QuestionMedia/QuestionMedia'
import MyModal from '../../MyModal/MyModal'
import {ExitContext} from '../CommunityGamePlay/CommunityGamePlay'
import styles from './CommunityAnswerBoard.module.css'
import {useMyleGameSession} from "../../../hooks/usePracticeGameSession/useMyleGameSession";

type CommunityAnswerBoardProps = {
  className?: string
  isShowHostControl: boolean
  setIsShowHostControl: React.Dispatch<React.SetStateAction<boolean>>
}

const CommunityAnswerBoard: FC<CommunityAnswerBoardProps> = ({
                                                               className,
                                                               isShowHostControl,
                                                               setIsShowHostControl,
                                                             }) => {

  const game = useMyleGameSession()
  const sound = useSound()
  const exitContext = useContext(ExitContext)
  const timer = useTimer()
  const DEFAULT_NEXT_TIMER = 3
  const router = useRouter()
  const [isShowNext, setIsShowNext] = useState<boolean>(false)
  const [autoNextCountDown, setAutoNextCountDown] =
    useState<number>(DEFAULT_NEXT_TIMER)
  const [isShowEndGame, setIsShowEndGame] = useState<boolean>(false)

  const [autoNext, setAutoNext] = useState<boolean>(false)
  const [submit, setSubmit] = useState<boolean>(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [viewResultData, setViewResultData] = useState<TViewResult>()
  const [numSubmission, setNumSubmission] = useState<number>(1)
  const {fromMedium} = useScreenSize()

  let answerSectionFactory: AnswerSectionFactory

  useEffect(() => {
    handleSocket()
    resetState()
  }, [])

  function checkEndGame() {
    if (!game.currentQuestion) return
    if (game.gameSession?.quiz?.questions?.length) {
      setIsShowEndGame(game.currentQuestion?.orderPosition == game.gameSession?.quiz?.questions?.length - 1 && !timer.isCounting)
    }
  }

  const displayFirstQuestion = () => {
    if (!game.currentQuestion || !game.gameSession) return
    if (game.currentQuestion.orderPosition != 0) {
      // game.submittedAnswer
    } else {
      timer.setDefaultDuration(game.currentQuestion.duration)
    }
  }

  function resetState() {
    if (!game.currentQuestion) {
      setLoading('Chuẩn bị!')
      sound.playSound(SOUND_EFFECT['READY'])
    } else setLoading(null)

    setLoading(null)
    timer.setIsShowSkeleton(true)
    setIsShowNext(false)
    setIsNextEmitted(false)

    displayFirstQuestion()
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
      if (game.currentQuestion?.orderPosition ?? 0 >= (game.gameSession?.quiz.questions.length ?? 0) - 1) {
        setIsShowHostControl(true)
      }
      if (autoNext) {
        for (let i = 0; i <= DEFAULT_NEXT_TIMER; i++) {
          setTimeout(() => {
            setAutoNextCountDown(DEFAULT_NEXT_TIMER - i)
          }, i * 1000)
        }
        intervalRef.current = setInterval(() => {
          if (autoNext) {
            goToNextQuestion()
          }
        }, DEFAULT_NEXT_TIMER * 1000)
      } else {
        setIsShowHostControl(true)
      }
      setSubmit(false)
    }
  }, [submit])

  const handleSocket = () => {
    if (!game.gameSocket) return
    game.gameSkOnce('game-started', (data) => {
      setAutoNextCountDown(DEFAULT_NEXT_TIMER)
      setIsNextEmitted(false)
      timer.startCounting(data.question?.duration ?? 0)
      setIsShowHostControl(false)
      setLoading(null)
    })

    game.gameSkOn('next-question', (data) => {
      setAutoNextCountDown(DEFAULT_NEXT_TIMER)
      setIsNextEmitted(false)
      timer.startCounting(data.question?.duration ?? 0)
      setIsShowHostControl(false)
      setLoading(null)
    })

    game.gameSkOn('view-result', (data: TViewResult) => {
      timer.countDown >= 0 ? setLoading('Đã trả lời!') : setLoading('Hết giờ!')
      setTimeout(() => {
        setLoading(null)
      }, 1000)
      timer.stopCounting(true)
      timer.stopCountingSound(true)
      setViewResultData(data)
      setIsShowNext(true)
      game.player = data?.player ?? null
      if (data?.player && typeof window !== 'undefined') {
        const curStreak = data.player.currentStreak ?? 0
        if (curStreak > 0) {
          sound?.playRandomCorrectAnswerSound()
        } else {
          sound?.playSound(SOUND_EFFECT['INCORRECT_BACKGROUND'])
          sound?.playSound(SOUND_EFFECT['INCORRECT_ANSWER'])
        }
      }
      setSubmit(true)
      checkEndGame()
    })

    game.gameSkOn('loading', (data) => {
      if (data?.question?.question) {
        timer.setIsShowSkeleton(true)
        setIsShowNext(false)
        setIsNextEmitted(true)

        const newQuestion = data.question.question as TQuestion

        timer.setDefaultDuration(newQuestion.duration)
        setLoading('Chuẩn bị!')
        sound.playSound(SOUND_EFFECT['READY'])
        game.submittedAnswer = null
      }
      if (data?.loading) {
        setLoading(data.loading)
        sound.playSound(SOUND_EFFECT['BELL'])
      }
    })
  }

  const handleSubmitAnswer = (answer: any) => {
    if (!game.gameSession) return
    if (!timer.isSubmittable) return

    let msg = {
      invitationCode: game.gameSession.invitationCode,
      nickname: game.gameSession.nickName,
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
    if (game.currentQuestion && game.currentQuestion.type != '22POLL')
      timer.setIsSubmittable(false)
    if (msg.answer || msg.answerIds) game.gameSkEmit('submit-answer', msg)
  }

  const renderAnswersSection = () => {
    if (!game.currentQuestion) return
    if (!answerSectionFactory)
      answerSectionFactory = new AnswerSectionFactory(
        false,
        styles.answerLayout
      )
    return answerSectionFactory.initAnswerSectionForType(
      game.currentQuestion.type,
      game.currentQuestion,
      handleSubmitAnswer
    )
  }

  const [isNextEmitted, setIsNextEmitted] = useState<boolean>(false)

  const goToNextQuestion = () => {
    console.log("=>(CommunityAnswerBoard.tsx:232) game", game);
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (!game.gameSession) return
    const msg = {invitationCode: game.gameSession.invitationCode}
    game.gameSkEmit('next-question', msg)
  }

  function endGame() {
    if (game.gameSession && game.gameSocket != null) {
      const msg = {invitationCode: game.gameSession.invitationCode}
      game.gameSkEmit('game-ended', msg)
      game.clearGameSession()
      router.push('/')
    }
  }

  function getEndGameModal() {
    return (
      <MyModal
        show={exitContext.showEndGameModal}
        onHide={() => exitContext.setShowEndGameModal(false)}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={endGame}
        inActiveButtonCallback={() => exitContext.setShowEndGameModal(false)}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center h3 fw-bolder">Kết thúc game?</div>

        <div className="text-center fw-bold">
          <div className="text-secondary fs-24x">
            {(game.currentQuestion?.orderPosition ?? 0) + 1 < (game.gameSession?.quiz?.questions?.length ?? 0) ? (
              <>
                {'Quiz mới hoàn thành '}
                <span className="fw-bolder fs-24x  text-primary">
                  {(game.currentQuestion?.orderPosition ?? 0) + 1}
                </span>
                {' câu, còn '}
                <span className="fw-bolder fs-24x  text-primary">
                  {game.gameSession?.quiz?.questions?.length}
                </span>
                {' câu chưa hoàn thành!'}
              </>
            ) : (
              <>
                {'Quiz đã hoàn thành tất cả '}
                <span className="fw-bolder fs-24x  text-primary">
                  {(game.currentQuestion?.orderPosition ?? 0) + 1}
                </span>
                {' câu trên '}
                <span className="fw-bolder fs-24x  text-primary">
                  {game.gameSession?.quiz?.questions?.length}
                </span>
                {' câu!'}
              </>
            )}
          </div>
          <div className="text-secondary fs-24x text-warning">
            Các thành viên trong phòng sẽ không thể chat với nhau nữa, bạn có
            chắc chắn muốn kết thúc phòng?
          </div>
        </div>
      </MyModal>
    )
  }

  const renderHostControlSystem = () => {
    return (
      <Fade in={isShowHostControl || fromMedium}>
        {isShowHostControl || fromMedium ? (
          <div className={cn(styles.hostControl, 'px-2 py-2 flex-end bg-dark bg-opacity-50')}>
            {!isShowEndGame && (
              <GameButton
                isEnable={true}
                iconClassName={cn('bi', {
                  'bi-pause-circle-fill': !autoNext,
                  'bi-play-circle': autoNext,
                })}
                className={classNames('text-white fw-medium', {
                  'bg-secondary': !autoNext,
                })}
                title={
                  autoNext
                    ? `Tự qua câu sau ${autoNextCountDown} giây`
                    : 'Bật tự qua câu'
                }
                onClick={() => setAutoNext(!autoNext)}
              />
            )}
            {!isShowEndGame &&
            (!timer.isSubmittable) ?
              (
                <GameButton
                  isEnable={true}
                  iconClassName="bi bi-arrow-right-circle-fill"
                  className={classNames('text-white fw-medium')}
                  title="Câu sau"
                  onClick={() => {goToNextQuestion()}}
                /> )
              : (<GameButton
                isEnable={true}
                iconClassName="bi bi-check-circle-fill"
                className={classNames('text-white fw-medium bg-warning')}
                title={'Trả lời'}
                onClick={() => {
                  timer.stopCounting(false)
                }}
              />)
            }
            {isShowEndGame && (
              <GameButton
                isEnable={true}
                iconClassName="bi bi-x-octagon-fill"
                className={classNames('text-white fw-medium bg-danger')}
                title="Kết thúc game"
                onClick={() => {
                  exitContext.setShowEndGameModal(true)
                }}
              />
            )}
          </div>
        ) : (
          <></>
        )}
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
        {game.currentQuestion?.question && (
          <div
            className={classNames(
              'd-flex flex-column bg-dark bg-opacity-50 rounded-10px shadow mb-2'
            )}
          >
            <div className="pt-2 px-2 d-flex align-items-center gap-3">
              <Image
                src="/assets/default-avatar.png"
                width={40}
                height={40}
                className="rounded-circle"
                alt=""
              />
              <div className="fw-medium fs-20px text-white">
                {game.gameSession?.host?.name ?? 'Ẩn danh'}
              </div>
            </div>
            <div className="px-2 pb-2 text-white d-flex gap-3 align-items-center justify-content-between">
              {/*câu hỏi hiện tại*/}
              <div className="fw-medium fs-32px text-primary">
                {(game.currentQuestion?.orderPosition ?? 0) + 1}/
                <span className="text-secondary fs-24px">
                  {game.gameSession?.quiz?.questions?.length}
                </span>
              </div>

              {/*streak hiện tại*/}
              <div className={'fs-32px'}>
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
          media={game.currentQuestion?.media ?? null}
          numStreak={0}
          numSubmission={numSubmission}
          key={(game.currentQuestion?.orderPosition ?? 0)}
          className={styles.questionMedia}
        />

        <div
          className={classNames(
            'shadow px-3 pt-2 bg-white mb-2',
            styles.questionTitle,
            {'rounded-10px': fromMedium}
          )}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: game.currentQuestion?.question ?? '',
            }}
          />
        </div>
        {game.currentQuestion && (
          <div
            className={classNames(
              'noselect px-2 py-2 fs-4 fw-bold text-white mb-2 bg-dark bg-opacity-50 d-flex justify-content-between align-items-center',
              {'rounded-10px': fromMedium}
            )}
          >
            <div className={''}>
              <i
                className={cn(
                  'fs-20px text-white me-2',
                  QuestionTypeDescription[game.currentQuestion.type].icon
                )}
              />
              {QuestionTypeDescription[game.currentQuestion.type].title}
            </div>
          </div>
        )}

        {game.currentQuestion?.question && renderAnswersSection()}
        {renderHostControlSystem()}
        <div className={styles.blankDiv}></div>
        {getEndGameModal()}

        <LoadingBoard
          loading={loading != null}
          className={'position-fixed top-0 bottom-0 start-0 end-0'}
          loadingTitle={loading ?? ''}
        />
      </div>
    </>
  )
}

export default memo(CommunityAnswerBoard)
