import _ from 'lodash'
import { FC, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { useSocket } from '../../../../hooks/useSocket/useSocket'
import { TPlayer, TUser } from '../../../../types/types'
import { MyTooltip } from '../../../MyToolTip/MyTooltip'
import styles from './Message.module.css'

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
  voteFromHost: number
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
  const [upvote, setUpvote] = useState(0)

  const nickname =
    _.get(props, 'player.nickname') || _.get(props, 'user.name') || 'Ẩn danh'

  useEffect(() => {
    for (const socketId in props.votedByUsers) {
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
  }
  const vote = props.vote 
  const voteColor = vote === 0 ? 'text-secondary' : vote === 1 ? 'text-primary' : 'text-danger'
  return (
    <div className="d-flex">
      <div className={`d-flex flex-grow-1 ${styles.messageContainer}`}>
        <div className={`d-flex flex-column flex-grow-1 ${styles.message}`}>
          <div className="d-flex align-items-center ">
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

              <span className="text-white fw-medium pe-1 my-auto text-start">
                {nickname} {props.isCurrentUser ? '(Bạn)' : null}
              </span>
            </div>
            <div className="ms-3">
              {props.voteFromHost === 1 ? (
                <MyTooltip title="Được xác thực bởi chủ phòng">
                  <Image
                    src="/assets/upvoted-chat.svg"
                    alt="host-upvoted"
                  ></Image>
                </MyTooltip>
              ) : props.voteFromHost === -1 ? (
                <MyTooltip title="Kém tin cậy">
                  <Image
                    src="/assets/downvoted-chat.svg"
                    alt="host-downvoted"
                  ></Image>
                </MyTooltip>
              ) : null}
            </div>
          </div>

          {/* nội dung chat */}
          <div
            className={
              `text-white w-100 text-start ` +
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
          } fs-4 ${styles.voteIcon} ${styles.upvote}`}
          onClick={() => handleVote(1)}
        />
        <span className={`fw-semiBold ${styles.scoreLabel} ${voteColor}`}>{props.vote}</span>
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
