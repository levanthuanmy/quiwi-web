import classNames from 'classnames'
import React, {FC, useState} from 'react'
import {SocketManager} from '../../hooks/useSocket/socketManager'
import {TStartQuizResponse, TUser} from '../../types/types'
import ChatWindow from '../GameComponents/ChatWindow/ChatWindow'
import {MessageProps} from '../GameComponents/ChatWindow/Message/Message'
import PlayerList from '../GameComponents/PlayerList/PlayerList'
import styles from './GameMenuBar.module.css'

type GameMenuBarProps = {
  isExpand: boolean
  gameSession: TStartQuizResponse
  user?: TUser
}
const GameMenuBar: FC<GameMenuBarProps> = ({
                                             isExpand,
                                             gameSession,
                                           }) => {
  const [chatContent, setChatContent] = useState<MessageProps[]>([])
  const socket = SocketManager().socketOf("GAMES")

  const receivedMessage = (message: MessageProps) => {
    if (message) {
      setChatContent([...chatContent, message])
    }
  }

  socket?.on('chat', (data: MessageProps) => {
    receivedMessage(data as MessageProps)
  })

  const renderItems = (
    <>
      <PlayerList playerList={gameSession.players}/>
      <div
        className={`${styles.slider} bg-primary`}
        onMouseDown={(e) => {
          let block = document.getElementById('playerList') as HTMLDivElement
          let dragX = e.clientY
          // register a mouse move listener if mouse is down
          document.onmousemove = function onMouseMove(e) {
            // e.clientY will be the position of the mouse as it has moved a bit now
            // offsetHeight is the height of the block-1
            if (block) {
              block.style.height = block.offsetHeight + e.clientY - dragX + 'px'
              // update variable - till this pos, mouse movement has been handled
              dragX = e.clientY
            }
          }
          document.onmouseup = () =>
            (document.onmousemove = document.onmouseup = null)
        }}
      >
        <i className="text-white bi bi-grip-horizontal bg-primary"></i>
      </div>
      <ChatWindow
        gameSession={gameSession}
        chatContent={chatContent}
        setChatContent={setChatContent}
      />
    </>
  )

  return (
    <div
      className={classNames(
        'd-flex flex-column bg-white ',
        styles.container,
        isExpand ? `shadow-lg ${styles.expand}` : '',
        {
          minHeight: '976px',
          right: 0,
        }
      )}
    >
      <div
        className="position-relative cursor-pointer "
        style={{height: 40}}
      >
        <i
          className={classNames(
            'position-absolute d-flex justify-content-center align-items-center ',
            styles.button,
            {
              'bi bi-chevron-double-right': isExpand,
              'bi bi-chevron-double-left': !isExpand,
            }
          )}
        />
      </div>
      {isExpand ? renderItems : null}
    </div>
  )
}

export default GameMenuBar
