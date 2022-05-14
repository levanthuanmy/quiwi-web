import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import ChatWindow from '../GameComponents/ChatWindow/ChatWindow'
import PlayerList from '../GameComponents/PlayerList/PlayerList'
import ItemMenuBar from '../ItemMenuBar/ItemMenuBar'
import styles from './GameMenuBar.module.css'

type GameMenuBarProps = {
  isExpand: boolean
  setIsExpand: React.Dispatch<React.SetStateAction<boolean>>

  isFullHeight: boolean
}
const GameMenuBar: FC<GameMenuBarProps> = ({
  isExpand,
  setIsExpand,
  isFullHeight,
}) => {
  const router = useRouter()

  return (
    <div
      className={classNames('border-end  bg-white  ', styles.container, {
        // "h-100": isFullHeight,
        height: '100vh',
        right: 0,
      })}
      style={{ width: isExpand ? 350 : 48 }}
    >
      <div
        className="position-relative cursor-pointer"
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
      <div className="d-flex flex-column justify-content-between h-100">
        <PlayerList
          playerList={[
            {
              nickname: ' kul',
              gameLobbyId: 1,
              score: 100,
              id: 1
            },
          ]}
        />
        <hr></hr>
        <ChatWindow />
      </div>

      {/* {menuOptions.map((item, key) => (
        <ItemMenuBar key={key} {...item} />
      ))} */}
    </div>
  )
}

export default GameMenuBar
