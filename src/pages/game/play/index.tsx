import classNames from 'classnames'
import { NextPage } from 'next'
import router from 'next/router'
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Fade } from 'react-bootstrap'
import AnswerBoard from '../../../components/GameComponents/AnswerBoard/AnswerBoard'
import EndGameBoard from '../../../components/GameComponents/EndGameBoard/EndGameBoard'
import { FAB, FABAction } from '../../../components/GameComponents/FAB/FAB'
import GameMenuBar from '../../../components/GameMenuBar/GameMenuBar'
import MyModal from '../../../components/MyModal/MyModal'
import UsingItemInGame from '../../../components/UsingItemInGame/UsingItemInGame'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { TStartQuizResponse } from '../../../types/types'
import styles from './GamePage.module.css'
import { JsonParse } from '../../../utils/helper'
import { useEffectOnce } from 'react-use'
import * as gtag from '../../../libs/gtag'

export const ExitContext = React.createContext<{
  showEndGameModal: boolean
  setShowEndGameModal: Dispatch<SetStateAction<boolean>>
}>({
  showEndGameModal: false,
  setShowEndGameModal: () => {},
})

export const TimerContext = React.createContext<{
  isCounting: boolean
  isSubmittable: boolean
  isShowSkeleton: boolean
  isShowAnswer: boolean
  setIsSubmittable: Dispatch<SetStateAction<boolean>>
  setIsShowSkeleton: Dispatch<SetStateAction<boolean>>
  setIsShowAnswer: Dispatch<SetStateAction<boolean>>
  countDown: number
  duration:number
  setDefaultCountDown: (duration: number) => void
  stopCounting: (xxx: boolean) => void
  startCounting: (duration: number) => void
}>({
  isCounting: false,
  isSubmittable: false,
  isShowSkeleton: false,
  isShowAnswer:false,
  setIsSubmittable: () => {},
  setIsShowSkeleton: () => {},
  setIsShowAnswer: () => {},
  countDown: 0,
  duration: 0,
  setDefaultCountDown: (duration: number) => {},
  stopCounting: (xxx: boolean) => {},
  startCounting: (duration: number) => {},
})

const GamePage: NextPage = () => {
  const { gameSession, isHost, gameSkOn, saveGameSession, clearGameSession } =
    useGameSession()
  const [isShowChat, setIsShowChat] = useState<boolean>(false)
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false)
  const [isShowExit, setIsShowExit] = useState<boolean>(false)
  const [isShowItem, setIsShowItem] = useState<boolean>(false)
  const [isShowSkeleton, setIsShowSkeleton] = useState<boolean>(false)

  const [isShowHostControl, setIsShowHostControl] = useState<boolean>(true)
  const { fromMedium } = useScreenSize()
  const [endGameData, setEndGameData] = useState<TStartQuizResponse>()

  const [isTimeOut, setIsTimeOut] = useState<boolean>(false)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const [isShowAnswer, setIsShowAnswer] = useState<boolean>(true)
  const [isSubmittable, setIsSubmittable] = useState<boolean>(false)
  const [countDown, setCountDown] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timer | null>(null)

  const stopCounting = (stopUI: boolean) => {
    console.log("=>(index.tsx:127) stopCounting");
    if (intervalRef && intervalRef.current) {
      if (stopUI) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsShowAnswer(true)
      }
      setIsCounting(false)

      setTimeout(() => {
        setIsSubmittable(false)
      }, 500)
    }
  }

  const startCounting = (duration: number) => {
    console.log("=>(index.tsx:127) duration", duration);
    if (duration > 0) {
      let endDate = new Date()
      endDate.setSeconds(endDate.getSeconds() + duration)
      let endTime = Math.round(endDate.getTime())
      setEndTime(endTime)
      setDuration(duration)
      setCountDown(duration)
      setTimeout(() => {
        setIsCounting(true)
        setIsShowSkeleton(false)
        setIsShowAnswer(false)
      },100)

      setTimeout(() => {
        setIsSubmittable(true)
      }, 500)

      intervalRef.current = setInterval(() => {
        let curr = Math.round(new Date().getTime())
        let _countDown = Math.ceil((endTime - curr) / 1000)
        setCountDown(_countDown)
        if (_countDown <= 0) {
          stopCounting(true)
        }
      }, 100)
    }
  }


  const fabs: FABAction[] = [
    {
      label: 'Khung chat',
      icon: 'bi bi-chat-dots-fill text-white',
      onClick: () => {
        resetAllFAB()
        setIsShowChat(!isShowChat)
      },
    },
    {
      label: 'Kho đồ',
      icon: 'bi bi-basket-fill text-white',
      onClick: () => {
        resetAllFAB()
        setIsShowItem(!isShowItem)
      },
    },
  ]

  const hostAction: FABAction = {
    label: 'Hiện bảng điều khiển',
    icon: 'bi bi-dpad-fill text-white',
    onClick: () => {
      resetAllFAB()
      setIsShowHostControl(!isShowHostControl)
    },
  }

  const endGameAction: FABAction = {
    label: 'Kết thúc!',
    icon: 'bi bi-x-octagon-fill text-danger',
    onClick: () => {
      setExitModal(true)
    },
  }

  const exitAction: FABAction = {
    label: 'Thoát phòng!',
    icon: 'bi bi-box-arrow-left text-warning',
    onClick: () => {
      setIsShowExit(true)
    },
  }

  const resetAllFAB = () => {
    if (isShowChat) setIsShowChat(false)
    if (isShowHostControl) setIsShowHostControl(false)
  }

  const exitRoom = () => {
    // dùng clear game session là đủ
    clearGameSession()
    router.push('/my-lib')
  }

  function getExitModal() {
    return (
      <MyModal
        show={isShowExit}
        onHide={() => setIsShowExit(true)}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={exitRoom}
        inActiveButtonCallback={() => setIsShowExit(false)}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center h3 fw-bolder">Thoát phòng</div>

        <div className="text-center fw-bold">
          <div className="text-secondary fs-24x text-warning">
            Bạn có chắc muốn thoát phòng?
          </div>
        </div>
      </MyModal>
    )
  }

  useEffect(() => {
    gameSkOn('game-ended', (data) => {
      setEndGameData(data)
      saveGameSession(data)
      setIsGameEnded(true)

      gtag.event({
        action: '[game ended]',
        params: { quizId: gameSession?.quizId, invitationCode: gameSession?.invitationCode},
      })
    })

    gtag.event({
      action: '[access playing quiz page]',
      params: { quizId: gameSession?.quizId, invitationCode: gameSession?.invitationCode},
    })
  }, [])

  const [exitModal, setExitModal] = useState(false)
  return (
    <>
      <div
        className={classNames(
          styles.gameBackground,
          'bg-black customScrollbar'
        )}
      >
        <div
          className={classNames(
            styles.gameView,
            'd-flex flex-column customScrollbar'
          )}
        >
          {/*<div className={classNames("")}>*/}
          <div className={classNames(styles.answerBoard, '')}>
            {endGameData ? (
              <EndGameBoard className="flex-grow-1" />
            ) : (
              <TimerContext.Provider
                value={{
                  isCounting,
                  isSubmittable,
                  isShowSkeleton,
                  isShowAnswer,
                  setIsSubmittable,
                  setIsShowSkeleton,
                  setIsShowAnswer,
                  countDown,
                  duration,
                  setDefaultCountDown: setDuration,
                  stopCounting,
                  startCounting,
                }}
              >
                <ExitContext.Provider
                  value={{
                    showEndGameModal: exitModal,
                    setShowEndGameModal: setExitModal,
                  }}
                >
                  <div className={"bg-white w-100 h -100"}></div>
                  <AnswerBoard
                    className="flex-grow-1"
                    isShowHostControl={isShowHostControl}
                  />
                </ExitContext.Provider>
              </TimerContext.Provider>
            )}
            {/* <EmojiBar className={styles.emojiBar} /> */}
            {/* <EmojiBar className={styles.emojiBar} /> */}
          </div>
          {/*</div>*/}

          {gameSession && (
            <div>
              <GameMenuBar gameSession={gameSession} isShow={isShowChat} isGameEnded={isGameEnded}/>
              <Fade in={isShowItem}>
                {isShowItem ? (
                  <div>
                    <UsingItemInGame />
                  </div>
                ) : (
                  <></>
                )}
              </Fade>
            </div>
          )}
        </div>
        <FAB
          actions={[
            ...fabs,
            !fromMedium && isHost() ? hostAction : null,
            !endGameData && isHost() ? endGameAction : exitAction,
          ]}
        />
      </div>
      {getExitModal()}
    </>
  )
}

export default GamePage
