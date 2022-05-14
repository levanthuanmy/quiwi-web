import React, { FC, useEffect, useRef, useState } from 'react'
import styles from './ChatWindow.module.css'
import classNames from 'classnames'
import { Message, MessageProps } from './Message/Message'
import MyInput from '../../MyInput/MyInput'
import { List } from 'lodash'

const ChatWindow: FC = () => {
  const [chatValue, setChatValue] = useState<string>('')
  const [chatContent, setChatContent] = useState<MessageProps[]>([])

  const sendMessage = (message: MessageProps) => {
    if (message.content?.length ?? 0 > 0) {
      setChatContent([...chatContent, message])
      setChatValue('')
    }
  }

  const updateVoteForMessage = (voteChange: number, messageIndex: number) => {
    if (messageIndex < chatContent.length) {
      const cache: MessageProps[] = chatContent
      const updateItem = cache[messageIndex]

      if (updateItem) {
        cache[messageIndex] = {
          avatar: updateItem.avatar,
          name: updateItem.name,
          content: updateItem.content,
          vote: (updateItem.vote ?? 0) + voteChange,
          onVoteUpdated: updateItem.onVoteUpdated,
        }
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
            sendMessage({ content: chatValue, vote: 0 })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage({ content: chatValue, vote: 0 })
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
