import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import AnswerBoard from '../../../components/GameComponents/AnswerBoard/AnswerBoard'
import EndGameBoard from '../../../components/GameComponents/EndGameBoard/EndGameBoard'
import { FAB, FABAction } from '../../../components/GameComponents/FAB/FAB'
import GameMenuBar from '../../../components/GameMenuBar/GameMenuBar'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { TStartQuizResponse } from '../../../types/types'
import styles from './GamePage.module.css'
import router from "next/router";
import {Collapse, Fade} from "react-bootstrap";
import UsingItemInGame from '../../../components/UsingItemInGame/UsingItemInGame'

const GamePage: NextPage = () => {
  const { gameSession, isHost, gameSkOn, saveGameSession, clearGameSession } = useGameSession()
  const [isShowChat, setIsShowChat] = useState<boolean>(false)
  const [isShowItem, setIsShowItem] = useState<boolean>(false)
  const [isShowHostControl, setIsShowHostControl] = useState<boolean>(true)
  const { fromMedium } = useScreenSize()
  const [endGameData, setEndGameData] = useState<TStartQuizResponse>()

  const fabs: FABAction[] = [
    {
      label: 'Khung chat',
      icon: 'bi bi-chat-dots-fill',
      onClick: () => {
        resetAllFAB()
        setIsShowChat(!isShowChat)
      },
    },
    {
      label: "Kho đồ",
      icon: "bi bi-basket-fill",
      onClick: () => {
        resetAllFAB()
        setIsShowItem(!isShowItem)
      },
    }
  ]

  const hostAction: FABAction = {
    label: 'Hiện bảng điều khiển',
    icon: 'bi bi-dpad-fill',
    onClick: () => {
      resetAllFAB()
      setIsShowHostControl(!isShowHostControl)
    },
  }

  const resetAllFAB = () => {
    if (isShowChat) setIsShowChat(false)
    if (isShowHostControl) setIsShowHostControl(false)
  }

  // const { gameSession,  } = useGameSession()

  useEffect(() => {
    gameSkOn('game-ended', (data) => {
      setEndGameData(data)
      saveGameSession(data)
      console.log('gameSkOn - data', data)
    })
  }, [])

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
            'd-flex flex-column justify-content-center align-items-center position-relative'
          )}
        >
          <div className={classNames(styles.answerBoard)}>
            {endGameData ? (
              <EndGameBoard className="flex-grow-1" />
            ) : (
              <AnswerBoard
                className="flex-grow-1"
                isShowHostControl={isShowHostControl}
              />
            )}
            {/* <EmojiBar className={styles.emojiBar} /> */}
            {/* <EmojiBar className={styles.emojiBar} /> */}
          </div>

          {gameSession && (

            <div>
              <Fade
              in={isShowChat}
            >
              {isShowChat ?
                <div>
                  <GameMenuBar gameSession={gameSession} />
                </div>
               : (
                <></>
              )}
            </Fade>
            
              <Fade
              in={isShowItem}
            >
              {isShowItem ?
                <div>
                  <UsingItemInGame
                  />
                </div> : <></>}
            </Fade>
            </div>
            
          )}
          <FAB
            actions={[
              ...fabs,
              !fromMedium ? (isHost() ? hostAction : null) : null,
              {
                label: 'Thoát phòng',
                icon: 'bi bi-box-arrow-left',
                onClick: () => {
                  // dùng clear game session là đủ
                  clearGameSession()
                  router.push('/')
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  )
}

export default GamePage
