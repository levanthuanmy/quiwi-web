import classNames from 'classnames'
import { NextPage } from 'next'
import router from 'next/router'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import AnswerBoard from '../../../components/GameComponents/AnswerBoard/AnswerBoard'
import EndGameBoard from '../../../components/GameComponents/EndGameBoard/EndGameBoard'
import { FAB, FABAction } from '../../../components/GameComponents/FAB/FAB'
import FlyingAnimation from '../../../components/GameComponents/FlyingAnimation/FlyingAnimation'
import GameMenuBar from '../../../components/GameMenuBar/GameMenuBar'
import MyModal from '../../../components/MyModal/MyModal'
import UsingItemInGame from '../../../components/UsingItemInGame/UsingItemInGame'
import useExtendQueue from '../../../hooks/useExtendQueue'
import {
  TGameLobby,
  useGameSession,
} from '../../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { useSound } from '../../../hooks/useSound/useSound'
import { TimerProvider, useTimer } from '../../../hooks/useTimer/useTimer'
import { useUser } from '../../../hooks/useUser/useUser'
import { useUserSetting } from '../../../hooks/useUserSetting/useUserSetting'
import { post } from '../../../libs/api'
import * as gtag from '../../../libs/gtag'
import {
  TApiResponse,
  TDetailPlayer,
  TGamePlayBodyRequest,
  TItem,
  TPlayer,
  TUsingItems,
} from '../../../types/types'
import { SOUND_EFFECT } from '../../../utils/constants'
import { TJoinQuizRequest } from '../../lobby/join'
import styles from './GamePage.module.css'

export const ExitContext = React.createContext<{
  showEndGameModal: boolean
  setShowEndGameModal: Dispatch<SetStateAction<boolean>>
}>({
  showEndGameModal: false,
  setShowEndGameModal: () => {},
})

const GamePage: NextPage = () => {
  const game = useGameSession()
  const user = useUser()
  const timer = useTimer()
  const [isShowChat, setIsShowChat] = useState<boolean>(false)
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false)
  const [isShowExit, setIsShowExit] = useState<boolean>(false)
  const [isShowItem, setIsShowItem] = useState<boolean>(false)

  const [isShowHostControl, setIsShowHostControl] = useState<boolean>(true)
  const screenSize = useScreenSize()
  const { fromMedium } = useScreenSize()
  const [endGameData, setEndGameData] = useState<TGameLobby>()
  const sound = useSound()
  const [showUsingItem, setShowUsingItem] = useState<boolean>(false)
  const [currentUsingItem, setCurrentUsingItem] = useState<TItem>()
  const { add, size, all } = useExtendQueue()

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
    router.push('/home')
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
    if (!game.gameSocket || !game.gameSocket.connected) {
      game.connectGameSocket()
      game.gameSkOnce('connect', () => {
        joinRoom()
      })
    }

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
        const { item, player }: TUsingItems = data?.itemUsing || {}
        switch (item?.itemCategory?.name) {
          case 'Biểu cảm': {
            add(
              <FlyingAnimation key={size + item?.avatar} src={item?.avatar} />
            )
            break
          }
          case 'Đạo cụ': {
            if (player.nickname === game.nickName) {
              setCurrentUsingItem(item)
              setShowUsingItem(true)
            }
            break
          }
        }
      } catch (error) {
        console.log('gameSkOn - error', error)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const joinRoom = async () => {
    if (!game || !game.gameSession) return
    const cookies = new Cookies()
    const accessToken: string = cookies.get('access-token')
    let joinRoomRequest: TJoinQuizRequest = {
      nickname: game.nickName,
      invitationCode: game.gameSession.invitationCode,
    }

    const body: TGamePlayBodyRequest<TJoinQuizRequest> = {
      socketId: game.gameSocket!.id,
      data: joinRoomRequest,
    }

    if (user?.id) {
      // joinRoomRequest.token = accessToken
      joinRoomRequest.userId = user?.id
    }

    try {
      const response: TApiResponse<{
        gameLobby: TGameLobby
        player: TPlayer
      }> = await post('api/games/join-room', {}, body, true)
      const data = response.response

      game.gameSession = data.gameLobby
      game.player = data.player as TDetailPlayer
    } catch (error) {
      console.log('Join quiz - error', error)
      alert((error as Error).message)
    }
  }

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
              <EndGameBoard className="flex-grow-1" />
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
                    onNextQuestionCallback={() => {
                      setShowUsingItem(false)
                      setIsShowChat(false)
                    }}
                    currentUsingItem={currentUsingItem}
                    showUsingItem={showUsingItem}
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
              {isShowItem && (
                <UsingItemInGame
                  closeAction={() => {
                    resetAllFAB()
                    setIsShowItem(!isShowItem)
                  }}
                />
              )}
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
