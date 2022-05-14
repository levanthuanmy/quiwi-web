import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import styles from './PlayerList.module.css'
import classNames from 'classnames'
import { TPlayer } from '../../../types/types'

type PlayerListProps = {
  className?: string
  playerList?: Array<TPlayer>
}
const PlayerList: FC<PlayerListProps> = (props) => {
  return (
    <div
      className={classNames(
        props.className,
        'rounded-20px bg-white d-flex flex-column w-100 ',
        styles.playerList
      )}
    >
      <div className="d-flex align-items-center">
        <i
          className={`bi bi-arrow-up-circle-fill flex-grow-1 text-primary fs-3 ${styles.buttonScroll}`}
        />
      </div>
      <div className={`${styles.scrollListContainer}`}>
        <div className={`${styles.scrollList}`}>
          <div className={styles.blank} />
          {props.playerList &&
            props.playerList.map((item, index) => {
              return (
                <div className={'d-flex w-100 ' + styles.name} key={index}>
                  <div className={styles.avatarContainer}>
                    <Image
                      src={item.user?.avatar ?? '/assets/default-user.png'}
                      width={28}
                      height={28}
                      alt="avatar"
                      className={styles.avatarImage}
                    />
                  </div>
                  <span className="text-white pe-1 fw-medium fs-6 my-auto text-start">
                    {item.nickname ?? 'Anonymous'}
                  </span>
                </div>
              )
            })}
          <div className={styles.blank} />
        </div>
      </div>
      <div className="d-flex align-items-center">
        <i
          className={`bi bi-arrow-down-circle-fill flex-grow-1 text-primary fs-3 ${styles.buttonScroll}`}
        />
      </div>
    </div>
  )
}

export default PlayerList
