import _ from 'lodash'
import {FC, useEffect, useState} from 'react'
import {Image} from 'react-bootstrap'
import {SocketManager} from '../../../hooks/useSocket/socketManager'
import {TPlayer, TUser} from '../../../types/types'
import {MyTooltip} from '../../MyToolTip/MyTooltip'
import styles from './Message.module.css'
import cn from "classnames";

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
  isSameAsPrev: boolean
}

const colors: string[] = [
  '#009883',
  '#E86262',
  // '#22B139',
  '#EF154A',
  '#EF6415',
  '#A9C77E',
  '#B89A61',
  '#AB89A6',
]

const Message: FC<MessageProps> = (props) => {
  const avatar =
    _.get(props, 'user.avatar', _.get(props, 'player.user.avatar')) ||
    '/assets/default-user.png'
  const socket = SocketManager().socketOf("GAMES")
  const [upvote, setUpvote] = useState(0)

  const nickname =
    _.get(props, 'player.nickname') || _.get(props, 'user.name') || 'Ẩn danh'

  useEffect(() => {
    for (const socketId in props.votedByUsers) {
      if (socketId === socket?.id) {
        setUpvote(props.votedByUsers[socketId])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const getColorForString = (id: number) => {
    return colors[id % colors.length]
  }

  function hash(str: string) {
//set variable hash as 0
    let hash = 0;
// if the length of the string is 0, return 0
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }


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
    <div className={cn("d-flex", {"flex-row-reverse" : props.isCurrentUser})}>
      <div className={`d-flex flex-grow-1 ${styles.messageContainer}`}>
        <div className={`d-flex flex-column flex-grow-1 ${styles.message}`}>
          {!props.isSameAsPrev &&
          <div className={cn("d-flex align-items-center ", {"flex-row-reverse" : props.isCurrentUser})}>
            <div
              className={cn('d-flex ' + ' ' + styles.nameBox,{"flex-row-reverse" : props.isCurrentUser})}
              style={{backgroundColor: getColorForString(hash(nickname))}}
            >
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
                {nickname}
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
          </div>}

          {/* nội dung chat */}
          <div className={cn("d-flex ", {"flex-row-reverse" : props.isCurrentUser})}>
          <div
            className={
              `text-white text-start flex-grow-0 ` +
              styles.chatContent
            }
            style={{backgroundColor: getColorForString(hash(nickname))}}
          >
            {props.message ?? `Tin nhắn lỗi!`}
          </div>
          </div>
        </div>
      </div>

      <div className={cn(`d-flex gap-1 ${styles.vote}`, {"flex-row-reverse" : !props.isCurrentUser})}>
        {/*{!props.isCurrentUser &&*/}
            <i
            className={`bi ${
              upvote === 1
                ? 'bi-emoji-heart-eyes-fill  text-primary'
                : 'bi-emoji-heart-eyes'
            } fs-4 ${styles.voteIcon} ${styles.upvote}`}
            onClick={() => handleVote(1)}
        />
        {/*}*/}
        <div className={`fw-bolder ${styles.scoreLabel} ${voteColor}`}>{props.vote}</div>
        {/*{!props.isCurrentUser &&*/}
            <i
            className={`bi ${
              upvote === -1
                ? 'bi-emoji-frown-fill  text-danger'
                : 'bi-emoji-frown'
            } fs-4 ${styles.voteIcon} ${styles.upvote}`}
            // ${styles.rotate}
            onClick={() => handleVote(-1)}
        />
        {/*}*/}
      </div>
    </div>
  )
}

export {Message}
