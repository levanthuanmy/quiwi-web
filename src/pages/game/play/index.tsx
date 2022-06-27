import classNames from 'classnames'
import {NextPage} from 'next'
import router from 'next/router'
import React, {Dispatch, SetStateAction, useEffect, useState,} from 'react'
import {Fade} from 'react-bootstrap'
import AnswerBoard from '../../../components/GameComponents/AnswerBoard/AnswerBoard'
import EndGameBoard from '../../../components/GameComponents/EndGameBoard/EndGameBoard'
import {FAB, FABAction} from '../../../components/GameComponents/FAB/FAB'
import GameMenuBar from '../../../components/GameMenuBar/GameMenuBar'
import MyModal from '../../../components/MyModal/MyModal'
import UsingItemInGame from '../../../components/UsingItemInGame/UsingItemInGame'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import {TStartQuizResponse} from '../../../types/types'
import styles from './GamePage.module.css'
import * as gtag from '../../../libs/gtag'
import {TimerProvider} from "../../../hooks/useTimer/useTimer";
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'

export const ExitContext = React.createContext<{
  showEndGameModal: boolean
  setShowEndGameModal: Dispatch<SetStateAction<boolean>>
}>({
  showEndGameModal: false,
  setShowEndGameModal: () => {
  },
})

const GamePage: NextPage = () => {
  const {gameSession, isHost, gameSkOn, saveGameSession, clearGameSession} =
    useGameSession()
  const [isShowChat, setIsShowChat] = useState<boolean>(false)
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false)
  const [isShowExit, setIsShowExit] = useState<boolean>(false)
  const [isShowItem, setIsShowItem] = useState<boolean>(false)

  const [isShowHostControl, setIsShowHostControl] = useState<boolean>(true)
  const {fromMedium} = useScreenSize()
  const [endGameData, setEndGameData] = useState<TStartQuizResponse>()
  const [lsBg] = useLocalStorage('bg', '')
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
        params: {quizId: gameSession?.quizId, invitationCode: gameSession?.invitationCode},
      })
    })

    gtag.event({
      action: '[access playing quiz page]',
      params: {quizId: gameSession?.quizId, invitationCode: gameSession?.invitationCode},
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
        style={{
          backgroundImage: `url(${lsBg}`,
          // backgroundSize: 'auto 100vh',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
        }}
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
              <EndGameBoard className="flex-grow-1"/>
            ) : (
              <ExitContext.Provider
                value={{
                  showEndGameModal: exitModal,
                  setShowEndGameModal: setExitModal,
                }}
              >
                <TimerProvider>
                  <div className={"bg-white w-100 h -100"}></div>
                  <AnswerBoard
                    className="flex-grow-1"
                    isShowHostControl={isShowHostControl}
                  />
                </TimerProvider>
              </ExitContext.Provider>
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
                    <UsingItemInGame/>
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
