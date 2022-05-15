import React, { FC, useEffect, useState } from 'react'
import { Image, Row } from 'react-bootstrap'
import styles from './Message.module.css'
import classNames from 'classnames'
import { TPlayer, TUser } from '../../../../types/types'
import _ from 'lodash'
import { useSocket } from '../../../../hooks/useSocket/useSocket'

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
  votedByUsers: Record<string, number>

  onVoteUpdated?: (voteChange: number) => void
  isCurrentUser: boolean
}

const Message: FC<MessageProps> = (props) => {
  const avatar =
    _.get(props, 'user.avatar', _.get(props, 'player.user.avatar')) ||
    '/assets/default-user.png'
  const { socket } = useSocket()
  const nickname = _.get(props, 'user.name', _.get(props, 'player.nickname'))
  const [upvote, setUpvote] = useState(0)

  useEffect(() => {
    for (const socketId in props.votedByUsers) {
      console.log('==== ~ handleVote ~ socketId', socketId)
      if (socketId === socket.id) {
        setUpvote(props.votedByUsers[socketId])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
  const handleVote = (vote: number) => {
    let newUpVote = vote
    if (upvote === vote) {
      newUpVote = 0
    } else {
      newUpVote = vote
    }
    props.onVoteUpdated ? props.onVoteUpdated(newUpVote) : undefined

    // console.log('==== ~ handleVote ~ props.votedByUsers', props.votedByUsers)
    // for (const socketId in props.votedByUsers) {
    //   console.log('==== ~ handleVote ~ socketId', socketId)
    //   if (socketId === socket.id) {
    //     setUpvote(newUpVote)
    //   }
    // }
  }
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
          className={`bi ${
            upvote === 1
              ? 'bi-hand-thumbs-up-fill  text-primary'
              : 'bi-hand-thumbs-up'
          } fs-4 ${styles.voteIcon}`}
          onClick={() => handleVote(1)}
        />
        <span className={`fw-semiBold ${styles.scoreLabel}`}>{props.vote}</span>
        <i
          className={`bi ${
            upvote === -1
              ? 'bi-hand-thumbs-up-fill  text-danger'
              : 'bi-hand-thumbs-up'
          } fs-4 ${styles.voteIcon} ${styles.rotate}`}
          onClick={() => handleVote(-1)}
        />
      </div>
    </div>
  )
}

export { Message }
