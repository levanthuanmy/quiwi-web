import classNames from 'classnames'
import _ from 'lodash'
import { FC, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../../hooks/useSocket/useSocket'
import { TPlayer, TStartQuizResponse, TUser } from '../../../types/types'
import { JsonParse } from '../../../utils/helper'
import MyInput from '../../MyInput/MyInput'
import styles from './ChatWindow.module.css'
import { Message, MessageProps, SendMessageProps } from './Message/Message'

const ChatWindow: FC<{
  gameSession: TStartQuizResponse
  chatContent: MessageProps[]
  setChatContent: Function
}> = ({ gameSession, chatContent, setChatContent }) => {
  const [chatValue, setChatValue] = useState<string>('')
  const { socket } = useSocket()
  const [lsPlayer, setLsPlayer] = useLocalStorage('game-session-player', '')
  const [player, setPLayer] = useState<TPlayer>()
  const authContext = useAuth()
  const user = authContext.getUser()

  useEffect(() => {
    if (lsPlayer) {
      setPLayer(JsonParse(lsPlayer))
    }
  }, [lsPlayer])

  const sendMessage = (message: SendMessageProps) => {
    if (message.message?.length ?? 0 > 0) {
      setChatValue('')
      socket?.emit('chat', message)
    }
  }

  const receivedMessage = (message: MessageProps) => {
    if (message) {
      setChatContent([...chatContent, message])
    }
  }

  const showError = (error: Error) => {
    alert(JSON.stringify(error))
  }

  const handleSocketListener = () => {
    socket?.on('chat', (data) => {
      receivedMessage(data as MessageProps)
    })

    socket?.on('vote', (data: MessageProps) => {
      const cache: MessageProps[] = chatContent
      for (const chat of cache) {
        if (chat.id === data.id) {
          Object.assign(chat, data)
        }
      }
      setChatContent([...cache])
    })

    // socket?.on("error", (error: Error) =>{
    //   showError(error)
    // })
  }
  const updateVoteForMessage = (voteChange: number, messageIndex: number) => {
    if (messageIndex < chatContent.length) {
      socket.emit('vote', {
        invitationCode: gameSession.invitationCode,
        vote: voteChange,
        chatId: chatContent[messageIndex].id,
      })
    }

    return true
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    return scrollToBottom()
  }, [chatContent])

  handleSocketListener()
  return (
    <div className={classNames(styles.chatWindow)}>
      <div className={styles.chatBox}>
        <div className={`d-flex flex-column gap-2 ${styles.chatList} `}>
          {chatContent.map((item, index) => (
            <Message
              key={index}
              {...item}
              isCurrentUser={
                item.userId === user?.id ||
                (user?.id && item.player?.userId === user?.id) ||
                (_.get(item, 'playerNickName.length', 0) > 0 &&
                  item.playerNickName === player?.nickname)
              }
              onVoteUpdated={(voteChange: number) => {
                updateVoteForMessage(voteChange, index)
              }}
            />
          ))}
          <div ref={messagesEndRef} />
          <br></br>
        </div>
      </div>
      <div className={styles.chatInput}>
        <MyInput
          placeholder="Nhập để chat"
          iconClassName="bi bi-send-fill"
          onChange={(e) => setChatValue(e.target.value)}
          onIconClick={() => {
            sendMessage({
              message: chatValue,
              invitationCode: gameSession.invitationCode,
            })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage({
                message: chatValue,
                invitationCode: gameSession.invitationCode,
              })
              e.preventDefault()
            }
          }}
          // className={styles.chatInput}
          value={chatValue}
        />
      </div>
    </div>
  )
}

export default ChatWindow
