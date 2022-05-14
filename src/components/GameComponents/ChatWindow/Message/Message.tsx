import React, { FC } from 'react'
import { Image, Row } from 'react-bootstrap'
import styles from './Message.module.css'
import classNames from 'classnames'

export type MessageProps = {
  avatar?: string
  name?: string  
  content?: string
  vote: number | 0
  onVoteUpdated?: (voteChange: number) => void
}

const Message: FC<MessageProps> = (props) => {
  return (
    <div className="d-flex">
      <div className={`d-flex flex-grow-1 ${styles.messageContainer}`}>
      <div className={`d-flex flex-column flex-grow-1 ${styles.message}`}>
        {/* name */}
        <div className={'d-flex' + ' ' + styles.nameBox}>
          <div className={styles.avatarContainer}>
            <Image
              src={props.avatar ?? '/assets/default-user.png'}
              width={28}
              height={28}
              alt="avatar"
              className={styles.avatarImage}
            />
          </div>
          <span className="text-white pe-1 fw-medium my-auto text-start">
            Tên người chơi
          </span>
        </div>
        {/* nội dung chat */}
        <div
          className={
            `text-white w-100 fw-semiBold fs-6 text-start ` + styles.chatContent
          }
        > 
        {props.content ?? `Tin nhắn lỗi!`}
          
        </div>
      </div>
      </div>
      

      <div className={`d-flex flex-column ${styles.vote}`}>
        <i
          className={`bi bi-hand-thumbs-up-fill text-primary fs-4 ${styles.voteIcon}`}
          onClick={() =>  props.onVoteUpdated? props.onVoteUpdated(1) : undefined}
        />
        <span className={`fw-semiBold ${styles.scoreLabel}`}>{props.vote}</span>
        <i        
          className={`bi bi-hand-thumbs-up-fill fs-4 ${styles.voteIcon} ${styles.rotate}`}
          onClick={() => props.onVoteUpdated? props.onVoteUpdated(-1) : undefined}
        />
      </div>
    </div>
  )
}

export {Message}
