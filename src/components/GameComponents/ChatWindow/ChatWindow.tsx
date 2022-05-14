import classNames from 'classnames'
import { FC, useEffect, useRef, useState } from 'react'
import { useSocket } from '../../../hooks/useSocket/useSocket'
import { TStartQuizResponse, TUser } from '../../../types/types'
import MyInput from '../../MyInput/MyInput'
import styles from './ChatWindow.module.css'
import { Message, MessageProps, SendMessageProps } from './Message/Message'

const ChatWindow: FC<{
  gameSession: TStartQuizResponse
  user: TUser
}> = ({ gameSession, user }) => {
  const [chatValue, setChatValue] = useState<string>('')
  const [chatContent, setChatContent] = useState<MessageProps[]>([])
  const { socket } = useSocket()

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
  socket?.on('chat', (data) => {
    receivedMessage(data as MessageProps)
  })

  const updateVoteForMessage = (voteChange: number, messageIndex: number) => {
    if (messageIndex < chatContent.length) {
      const cache: MessageProps[] = chatContent
      const updateItem = cache[messageIndex]

      if (updateItem) {
        Object.assign(cache[messageIndex], updateItem)

        cache[messageIndex].vote = (updateItem.vote ?? 0) + voteChange
      }
      console.log(cache)
      setChatContent([...cache])
    }
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    return scrollToBottom()
  }, [chatContent])

  return (
    <div className={classNames(styles.chatWindow)}>
      <div className={styles.chatBox}>
        <div className={`d-flex flex-column gap-2 ${styles.chatList} `}>
          {chatContent.map((item, index) => (
            <Message
              key={index}
              {...item}
              isCurrentUser={item.userId === user.id || item.player?.userId === user.id}
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
