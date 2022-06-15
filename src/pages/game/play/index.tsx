import classNames from 'classnames'
import { NextPage } from 'next'
import router from 'next/router'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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

export const ExitContext = React.createContext<{
  showEndGameModal: boolean
  setShowEndGameModal: Dispatch<SetStateAction<boolean>>
}>({ showEndGameModal: false, setShowEndGameModal: () => {} })

const GamePage: NextPage = () => {
  const { gameSession, isHost, gameSkOn, saveGameSession, clearGameSession } =
    useGameSession()
  const [isShowChat, setIsShowChat] = useState<boolean>(false)
  const [isShowExit, setIsShowExit] = useState<boolean>(false)
  const [isShowItem, setIsShowItem] = useState<boolean>(false)
  const [isShowHostControl, setIsShowHostControl] = useState<boolean>(true)
  const { fromMedium } = useScreenSize()
  const [endGameData, setEndGameData] = useState<TStartQuizResponse>()

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
      console.log('gameSkOn - data', data)
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
            'd-flex flex-column align-items-center position-relative py-0 py-md-3'
          )}
        >
          <div className={classNames(styles.answerBoard)}>
            {endGameData ? (
              <EndGameBoard className="flex-grow-1" />
            ) : (
              <ExitContext.Provider
                value={{
                  showEndGameModal: exitModal,
                  setShowEndGameModal: setExitModal,
                }}
              >
                <AnswerBoard
                  className="flex-grow-1"
                  isShowHostControl={isShowHostControl}
                />
              </ExitContext.Provider>
            )}
            {/* <EmojiBar className={styles.emojiBar} /> */}
            {/* <EmojiBar className={styles.emojiBar} /> */}
          </div>

          {gameSession && (
            <div>
              <Fade in={isShowChat}>
                <div>
                  <GameMenuBar gameSession={gameSession} />
                </div>
              </Fade>

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
          <FAB
            actions={[
              ...fabs,
              !fromMedium && isHost() ? hostAction : null,
              !endGameData && isHost() ? endGameAction : exitAction,
            ]}
          />
        </div>
      </div>
      {getExitModal()}
    </>
  )
}

export default GamePage
