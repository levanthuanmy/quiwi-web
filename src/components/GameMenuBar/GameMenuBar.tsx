import classNames from 'classnames'
import React, { FC, useState } from 'react'
import { SocketManager } from '../../hooks/useSocket/socketManager'
import { TStartQuizResponse, TUser } from '../../types/types'
import ChatWindow from '../GameComponents/ChatWindow/ChatWindow'
import { MessageProps } from '../GameComponents/ChatWindow/Message'
import PlayerList from '../GameComponents/PlayerList/PlayerList'
import styles from './GameMenuBar.module.css'
import { useToasts } from 'react-toast-notifications'
import _ from 'lodash'

type GameMenuBarProps = {
  gameSession: TStartQuizResponse
  user?: TUser
  isShow: boolean
  isGameEnded: boolean
}
const GameMenuBar: FC<GameMenuBarProps> = ({
  gameSession,
  isShow,
  isGameEnded,
}) => {
  const [chatContent, setChatContent] = useState<MessageProps[]>([])
  const socket = SocketManager().socketOf('GAMES')
  const { addToast } = useToasts()
  const receivedMessage = (message: MessageProps) => {
    if (message) {
      setChatContent([...chatContent, message])
    }
  }
  socket?.off('chat')
  socket?.on('chat', (data: MessageProps) => {
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

  const renderItems = (
    <>
      <PlayerList playerList={gameSession.players} />
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
      {renderItems}
    </div>
  )
}

export default GameMenuBar
