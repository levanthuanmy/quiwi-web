import classNames from 'classnames'
import {NextPage} from 'next'
import router from 'next/router'
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
import AnswerBoard from '../../../components/GameComponents/AnswerBoard/AnswerBoard'
import EndGameBoard from '../../../components/GameComponents/EndGameBoard/EndGameBoard'
import {FAB, FABAction} from '../../../components/GameComponents/FAB/FAB'
import FlyingAnimation from '../../../components/GameComponents/FlyingAnimation/FlyingAnimation'
import GameMenuBar from '../../../components/GameMenuBar/GameMenuBar'
import MyModal from '../../../components/MyModal/MyModal'
import UsingItemInGame from '../../../components/UsingItemInGame/UsingItemInGame'
import useExtendQueue from '../../../hooks/useExtendQueue'
import {TGameLobby, useGameSession} from '../../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import {useSound} from '../../../hooks/useSound/useSound'
import {TimerProvider} from '../../../hooks/useTimer/useTimer'
import * as gtag from '../../../libs/gtag'
import {SOUND_EFFECT} from '../../../utils/constants'
import styles from './GamePage.module.css'
import {useUserSetting} from "../../../hooks/useUserSetting/useUserSetting";

export const ExitContext = React.createContext<{
  showEndGameModal: boolean
  setShowEndGameModal: Dispatch<SetStateAction<boolean>>
}>({
  showEndGameModal: false,
  setShowEndGameModal: () => {
  },
})

const GamePage: NextPage = () => {
  const game = useGameSession()
  const [isShowChat, setIsShowChat] = useState<boolean>(false)
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false)
  const [isShowExit, setIsShowExit] = useState<boolean>(false)
  const [isShowItem, setIsShowItem] = useState<boolean>(false)

  const [isShowHostControl, setIsShowHostControl] = useState<boolean>(true)
  const {fromMedium} = useScreenSize()
  const [endGameData, setEndGameData] = useState<TGameLobby>()
  const sound = useSound()

  const {add, size, all} = useExtendQueue()

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
    if (isShowItem) setIsShowItem(false)
    if (isShowHostControl) setIsShowHostControl(false)
  }

  const exitRoom = () => {
    // dùng clear game session là đủ
    game.clearGameSession()
    router.push('/my-lib')
  }

  function getExitModal() {
    return (
      <MyModal
        show={isShowExit}
        onHide={() => setIsShowExit(false)}
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
    game.gameSkOn('game-ended', (data) => {
      sound?.playSound(SOUND_EFFECT['COMPLETE_LEVEL'])
      setEndGameData(data)
      game.gameSession = data
      setIsGameEnded(true)

      gtag.event({
        action: '[game ended]',
        params: {
          quizId: game.gameSession?.quizId,
          invitationCode: game.gameSession?.invitationCode,
        },
      })
    })

    gtag.event({
      action: '[access playing quiz page]',
      params: {
        quizId: game.gameSession?.quizId,
        invitationCode: game.gameSession?.invitationCode,
      },
    })

    game.gameSkOn('use-item', (data) => {
      try {
        const {item} = data?.itemUsing || {}
        switch (item?.itemCategory?.name) {
          case 'Biểu cảm': {
            add(
              <FlyingAnimation key={size + item?.avatar} src={item?.avatar}/>
            )
            break
          }
        }
      } catch (error) {
        console.log('gameSkOn - error', error)
      }
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
          backgroundImage: `url(${useUserSetting().gameBackgroundUrl}`,
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
                  <div className={'bg-white w-100 h -100'}></div>
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

          {game.gameSession && (
            <div>
              <GameMenuBar
                isShow={isShowChat}
                isGameEnded={isGameEnded}
                closeAction={() => {
                  resetAllFAB()
                  setIsShowChat(!isShowChat)
                }}
              />
                {isShowItem &&
                    <UsingItemInGame
                        closeAction={() => {
                          resetAllFAB()
                          setIsShowItem(!isShowItem)
                        }
                        }
                    />
                }
            </div>
          )}
        </div>
        <FAB
          actions={[
            ...fabs,
            !fromMedium && game.isHost ? hostAction : null,
            !endGameData && game.isHost ? endGameAction : exitAction,
          ]}
        />
      </div>
      {getExitModal()}

      <div id="balloon-container">{all}</div>
    </>
  )
}

export default GamePage
