import React, { FC, useState } from 'react'
import styles from './ChatWindow.module.css'
import classNames from 'classnames'
import Message from './Message/Message'
import MyInput from '../../MyInput/MyInput'

const ChatWindow: FC = () => {
  const [chatValue, setChatValue] = useState<string>('')

  const sendMessage = (messageContent: string) => {
    // gửi tin nhắn ở đây
    // if success

    setChatValue('')
    console.log(chatValue)
  }

  return (
    <div className={classNames(styles.chatWindow)}>      
      <div className={styles.chatBox}>
      <div
        className={`d-flex flex-column gap-2 ${styles.chatList} `}
      >
        <Message content='Lorem ipsum dolor, sit amet'></Message>
        <Message content='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab perferendis'></Message>
        <Message content='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab perferendis alias dignissimos voluptates vero '></Message>
        <Message></Message>
        <Message></Message>
        <Message content='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab perferendis alias dignissimos voluptates vero '></Message>
        <Message content='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab perferendis'></Message>
        <Message></Message>
        <br></br>
      </div>
      </div>
      <div className={styles.chatInput}>
        <MyInput
          placeholder="Nhập mã tham gia"
          iconClassName="bi bi-send-fill"
          onChange={(e) => setChatValue(e.target.value)}
          onIconClick={() => {
            sendMessage(chatValue)
          }}
          // className={styles.chatInput}
          value={chatValue}
        />
      </div>
    </div>
  )
}

export default ChatWindow
