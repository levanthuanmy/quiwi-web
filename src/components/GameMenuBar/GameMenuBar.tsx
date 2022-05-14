import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { TStartQuizResponse } from '../../types/types'
import ChatWindow from '../GameComponents/ChatWindow/ChatWindow'
import PlayerList from '../GameComponents/PlayerList/PlayerList'
import ItemMenuBar from '../ItemMenuBar/ItemMenuBar'
import styles from './GameMenuBar.module.css'

type GameMenuBarProps = {
  isExpand: boolean
  setIsExpand: React.Dispatch<React.SetStateAction<boolean>>
  gameSession: TStartQuizResponse
  isFullHeight: boolean
}
const GameMenuBar: FC<GameMenuBarProps> = ({
  isExpand,
  setIsExpand,
  gameSession,
  isFullHeight,
}) => {
  const router = useRouter()

  return (
    <div
      className={classNames(
        'd-flex flex-column border-end  bg-white  ',
        styles.container,
        {
          // "h-100": isFullHeight,
          // height: '100vh',
          minHeight: '976px',
          right: 0,
        }
      )}
      style={{ width: isExpand ? 350 : 48 }}
    >
      <div
        className="position-relative cursor-pointer bg-primary"
        style={{ height: 48 }}
        onClick={() => setIsExpand((prev) => !prev)}
      >
        <i
          className={classNames(
            'fs-18px position-absolute d-flex justify-content-center align-items-center ',
            styles.button,
            {
              'bi bi-chevron-double-right': isExpand,
              'bi bi-chevron-double-left': !isExpand,
            }
          )}
        />
      </div>
      {isExpand ? (
        <>
          <PlayerList playerList={gameSession.players} />
          <hr></hr>
          <ChatWindow gameSession={gameSession} />
        </>
      ) : null}
    </div>
  )
}

export default GameMenuBar
