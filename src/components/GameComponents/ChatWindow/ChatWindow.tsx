import classNames from 'classnames'
import _ from 'lodash'
import {FC, useEffect, useRef, useState} from 'react'
import {useAuth} from '../../../hooks/useAuth/useAuth'
import {useLocalStorage} from '../../../hooks/useLocalStorage/useLocalStorage'
import {SocketManager} from '../../../hooks/useSocket/socketManager'
import {TPlayer, TStartQuizResponse, TUser} from '../../../types/types'
import {JsonParse} from '../../../utils/helper'
import MyInput from '../../MyInput/MyInput'
import styles from './ChatWindow.module.css'
import {Message, MessageProps, SendMessageProps} from './Message'
import cn from "classnames";
import {useGameSession} from "../../../hooks/useGameSession/useGameSession";
import {FacebookSelector, GithubCounter, ReactionBarSelector} from '@charkour/react-reactions';

const ChatWindow: FC<{
  chatContent: MessageProps[]
  setChatContent: Function
  isDisabled: boolean
}> = ({chatContent, setChatContent, isDisabled}) => {
  const [chatValue, setChatValue] = useState<string>('')
  const game = useGameSession()
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
      game.gameSkEmit('chat', message)
    }
  }

  const showError = (error: Error) => {
    alert(JSON.stringify(error))
  }

  const handleSocketListener = () => {
    game.gameSkOn('vote', (data: MessageProps) => {
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
      game.gameSkEmit('vote', {
        invitationCode: game.gameSession?.invitationCode ?? "",
        vote: voteChange,
        chatId: chatContent[messageIndex].id,
      })
    }

    return true
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'auto'})
  }

  useEffect(() => {
    return scrollToBottom()
  }, [chatContent])

  handleSocketListener()
  return (
    <div className={classNames(styles.chatWindow)}>
      <div className={styles.chatBox}>
        <div className={`d-flex flex-column gap-1 ${styles.chatList} `}>
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
              isSameAsPrev={
                index > 0 && item.userId === chatContent[index-1]?.userId
              }
              onVoteUpdated={(voteChange: number) => {
                updateVoteForMessage(voteChange, index)
              }}
            />
          ))}
          <div ref={messagesEndRef}/>
          <br></br>
        </div>
      </div>
      <div
        className={"d-flex justify-content-center"}
      >
        <FacebookSelector
          iconSize={50}
          onSelect={(e => {
            const path =  `/` + `${e}`
            sendMessage({
              message:path,
              invitationCode: game.gameSession?.invitationCode ?? "",
            })
          })}
        />

      </div>

      <div className={styles.chatInput}>
        {!isDisabled && <MyInput
          disabled={isDisabled}
          className={cn({"opacity-25" : isDisabled})}
          placeholder="Nhập để chat"
          iconClassName="bi bi-send-fill"
          onChange={(e) => setChatValue(e.target.value)}
          handleIconClick={() => {
            sendMessage({
              message: chatValue,
              invitationCode: game.gameSession?.invitationCode ?? "",
            })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage({
                message: chatValue,
                invitationCode: game.gameSession?.invitationCode ?? "",
              })
              e.preventDefault()
            }
          }}
          // className={styles.chatInput}
          value={chatValue}
        />}
      </div>
    </div>
  )
}

export default ChatWindow
