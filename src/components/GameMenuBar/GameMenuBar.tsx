import classNames from 'classnames'
import React, {FC, useEffect, useState} from 'react'
import { SocketManager } from '../../hooks/useSocket/socketManager'
import {TPlayer, TStartQuizResponse, TUser} from '../../types/types'
import ChatWindow from '../GameComponents/ChatWindow/ChatWindow'
import { MessageProps } from '../GameComponents/ChatWindow/Message'
import PlayerList from '../GameComponents/PlayerList/PlayerList'
import styles from './GameMenuBar.module.css'
import { useToasts } from 'react-toast-notifications'
import _ from 'lodash'
import PlayerLobbyList from "../PlayerLobbyList/PlayerLobbyList";
import {useSound} from "../../hooks/useSound/useSound";
import {SOUND_EFFECT} from "../../utils/constants";
import {useGameSession} from "../../hooks/useGameSession/useGameSession";
import {Button} from "react-bootstrap";
import GameButton from "../GameComponents/GameButton/GameButton";

type GameMenuBarProps = {
  user?: TUser
  isShow: boolean
  isGameEnded: boolean
  closeAction: () => void
}
const GameMenuBar: FC<GameMenuBarProps> = ({
  isShow,
  isGameEnded,
  closeAction
}) => {
  const game = useGameSession()
  const [chatContent, setChatContent] = useState<MessageProps[]>([])
  const { addToast } = useToasts()
  const sound = useSound()
  const receivedMessage = (message: MessageProps) => {
    if (message) {
      setChatContent([...chatContent, message])
    }
  }

  const [players, setPlayers] = useState<Array<TPlayer>>([])

  game.gameSkOn('chat', (data: MessageProps) => {
    sound.playSound(SOUND_EFFECT['NOTIFICATION'])
    receivedMessage(data)
    addToast(
      `${
        _.get(data, 'player.nickname') || _.get(data, 'user.name') || 'Ẩn danh'
      }: ${data.message}`,
      {
        appearance: 'info',
        autoDismiss: true,
      }
    )
  })

  useEffect(() => {
    setPlayers(game.players)
  },[game.players])

  const renderItems = (
    <>
      <PlayerList playerList={players} />
      <div
        className={`${styles.slider} bg-secondary`}
        onMouseDown={(e) => {
          let block = document.getElementById('playerList') as HTMLDivElement
          let blockChat = document.getElementById('chatWindow') as HTMLDivElement
          let dragX = e.clientY
          // register a mouse move listener if mouse is down
          document.onmousemove = function onMouseMove(e) {
            // e.clientY will be the position of the mouse as it has moved a bit now
            // offsetHeight is the height of the block-1
            if (block && blockChat) {
              let fullHeight = blockChat.offsetHeight + block.offsetHeight;
              let tempHeight = block.offsetHeight + e.clientY - dragX
              block.style.height = block.offsetHeight + e.clientY - dragX + 'px'
              let min = 150
              tempHeight = Math.max(tempHeight, min)
              tempHeight = Math.min(tempHeight, fullHeight - min)

                block.style.height = tempHeight + 'px';
              // update variable - till this pos, mouse movement has been handled
              dragX = e.clientY
            }
          }
          document.onmouseup = () =>
            (document.onmousemove = document.onmouseup = null)
        }}
      >
        <i className="text-white bi bi-grip-horizontal "></i>
      </div>
      <ChatWindow
        chatContent={chatContent}
        setChatContent={setChatContent}
        isDisabled={isGameEnded}
      />
    </>
  )

  return (
    <div
      className={classNames(
        'd-flex flex-column bg-white shadow-lg opacity-100 visible',
        styles.container,
        {
          'opacity-0 invisible': !isShow,
        }
      )}
    >
      <div className="position-relative  " style={{ height: 8 }}></div>
      <div
        className={"position-absolute pe-2 d-flex flex-row-reverse w-100 cursor-pointer"}
        onClick={closeAction}
      >
          <i className="text-secondary bi bi-x-circle fs-4"></i>
      </div>

      <div className="text-center fs-16px fw-bold text-primary align-self-center">Danh sách người chơi</div>
      {renderItems}
    </div>
  )
}

export default GameMenuBar
