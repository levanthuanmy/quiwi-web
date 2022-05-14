import classNames from 'classnames'
import React, { FC } from 'react'
import { TStartQuizResponse } from '../../types/types'
import ChatWindow from '../GameComponents/ChatWindow/ChatWindow'
import PlayerList from '../GameComponents/PlayerList/PlayerList'
import styles from './GameMenuBar.module.css'

type GameMenuBarProps = {
  isExpand: boolean
  setIsExpand: React.Dispatch<React.SetStateAction<boolean>>
  gameSession: TStartQuizResponse
}
const GameMenuBar: FC<GameMenuBarProps> = ({
  isExpand,
  setIsExpand,
  gameSession,
}) => {
  return (
    <div
      className={classNames(
        'd-flex flex-column bg-white rounded-20px ',
        styles.container,
        {
          minHeight: '976px',
          right: 0,
        }
      )}
      style={{ width: isExpand ? 350 : 48 }}
    >
      <div
        className="position-relative cursor-pointer "
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
          <div
            className={`${styles.slider} bg-primary`}
            onMouseDown={(e) => {
              let block = document.getElementById(
                'playerList'
              ) as HTMLDivElement
              let dragX = e.clientY
              // register a mouse move listener if mouse is down
              document.onmousemove = function onMouseMove(e) {
                // e.clientY will be the position of the mouse as it has moved a bit now
                // offsetHeight is the height of the block-1
                if (block) {
                  block.style.height =
                    block.offsetHeight + e.clientY - dragX + 'px'
                  // update variable - till this pos, mouse movement has been handled
                  dragX = e.clientY
                }
              }
              document.onmouseup = () =>
                (document.onmousemove = document.onmouseup = null)
            }}
          >
            <i className="text-white bi bi-grip-horizontal"></i>
          </div>
          <ChatWindow gameSession={gameSession} />
        </>
      ) : null}
    </div>
  )
}

export default GameMenuBar
