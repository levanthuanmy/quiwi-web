import classNames from 'classnames'
import {NextPage} from 'next'
import React, {useEffect, useState} from 'react'
import AnswerBoard from '../../../components/GameComponents/AnswerBoard/AnswerBoard'
import GameMenuBar from '../../../components/GameMenuBar/GameMenuBar'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import styles from './GamePage.module.css'
import {FAB, FABAction} from "../../../components/GameComponents/FAB/FAB";
import {TUser} from "../../../types/types";
import {JsonParse} from "../../../utils/helper";
import {useLocalStorage} from "../../../hooks/useLocalStorage/useLocalStorage";
import useScreenSize from "../../../hooks/useScreenSize/useScreenSize";


const GamePage: NextPage = () => {
  const {gameSession} = useGameSession()
  const [isShowChat, setIsShowChat] = useState<boolean>(false)
  const [isShowHostControl, setIsShowHostControl] = useState<boolean>(false)
  const [isHost, setIsHost] = useState<boolean>(false)
  const {fromMedium} = useScreenSize()
  const fabs: FABAction[] = [{
    label: "Khung chat",
    icon: "bi bi-chat-dots-fill",
    onClick: () => {
      setIsShowChat(!isShowChat)
    },
  }]

  const hostAction: FABAction = {
    label: "Hiện bảng điều khiển",
    icon: "bi bi-dpad-fill",
    onClick: () => {
      setIsShowHostControl(!isShowHostControl)
    }
  }

  const [lsUser] = useLocalStorage('user', '')

  useEffect(() => {
    if (!gameSession) return
    const user: TUser = JsonParse(lsUser)
    setIsHost(user.id === gameSession.hostId)
  }, [gameSession])

  return (<>
      <div className={classNames(styles.gameBackground, 'bg-black customScrollbar')}>
        <div
          className={classNames(
            styles.gameView,
            'd-flex flex-column justify-content-center align-items-center position-relative'
          )}
        >
          <div className={classNames(styles.answerBoard)}>
            <AnswerBoard
              className="flex-grow-1"
              isShowHostControl={isShowHostControl}
            />
            {/*<EndGameBoard className="flex-grow-1"/>*/}
            {/* <EmojiBar className={styles.emojiBar} />
            <EmojiBar className={styles.emojiBar} /> */}
          </div>

          {gameSession && isShowChat && (
            <GameMenuBar
              isExpand={true}
              gameSession={gameSession}
            />
          )}
          <FAB
            actions={[...fabs, !fromMedium ? (isHost ? hostAction : null) : null]}
          />
        </div>
      </div>
    </>
  )
}

export default GamePage
