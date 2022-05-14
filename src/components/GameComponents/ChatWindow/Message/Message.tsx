import React, { FC } from 'react'
import { Image, Row } from 'react-bootstrap'
import styles from './Message.module.css'
import classNames from 'classnames'
import { TPlayer, TUser } from '../../../../types/types'
import _ from 'lodash'

export type SendMessageProps = {
  message: string
  invitationCode: string
}

export type MessageProps = {
  name?: string
  message?: string
  vote: number | 0
  id?: string
  player?: TPlayer
  isVotedByHost: boolean | false
  playerNickName?: string
  socketId: string
  user?: TUser
  userId?: number

  onVoteUpdated?: (voteChange: number) => void
  isCurrentUser: boolean
}

const Message: FC<MessageProps> = (props) => {
  const avatar =
    _.get(props, 'user.avatar', _.get(props, 'player.user.avatar')) ||
    '/assets/default-user.png'

  const nickname = _.get(props, 'user.name', _.get(props, 'player.nickname'))

  return (
    <div className="d-flex">
      <div className={`d-flex flex-grow-1 ${styles.messageContainer}`}>
        <div className={`d-flex flex-column flex-grow-1 ${styles.message}`}>
          {/* name */}
          <div className={'d-flex' + ' ' + styles.nameBox}>
            <div className={styles.avatarContainer}>
              <Image
                src={avatar}
                width={28}
                height={28}
                alt="avatar"
                className={styles.avatarImage}
              />
            </div>

            <span> </span>
            <span className="text-white pe-1 fw-medium my-auto text-start">
              {nickname} {props.isCurrentUser ? '(Bạn)' : null}
            </span>
          </div>
          {/* nội dung chat */}
          <div
            className={
              `text-white w-100 fw-semiBold fs-6 text-start ` +
              styles.chatContent
            }
          >
            {props.message ?? `Tin nhắn lỗi!`}
          </div>
        </div>
      </div>

      <div className={`d-flex flex-column ${styles.vote}`}>
        <i
          className={`bi bi-hand-thumbs-up-fill text-primary fs-4 ${styles.voteIcon}`}
          onClick={() =>
            props.onVoteUpdated ? props.onVoteUpdated(1) : undefined
          }
        />
        <span className={`fw-semiBold ${styles.scoreLabel}`}>{props.vote}</span>
        <i
          className={`bi bi-hand-thumbs-up-fill fs-4 ${styles.voteIcon} ${styles.rotate}`}
          onClick={() =>
            props.onVoteUpdated ? props.onVoteUpdated(-1) : undefined
          }
        />
      </div>
    </div>
  )
}

export { Message }
