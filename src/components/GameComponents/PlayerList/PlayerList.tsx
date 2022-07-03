import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import styles from './PlayerList.module.css'
import classNames from 'classnames'
import { TPlayer } from '../../../types/types'
import PlayerLobbyList from "../../PlayerLobbyList/PlayerLobbyList";

type PlayerListProps = {
  className?: string
  playerList?: Array<TPlayer>
}
const PlayerList: FC<PlayerListProps> = (props) => {
  return (
    <div
      id="playerList"
      className={classNames(
        props.className,
        'bg-white d-flex flex-column w-100 ',
        styles.playerList
      )}
    >
      <div className="text-center fs-16px fw-bold text-primary">Danh sách người chơi</div>
      <div className={`${styles.scrollListContainer}`}>
        {/*<div className={`${styles.scrollList} d-flex flex-wrap`}>*/}
          <div className={`${styles.scrollList}`}>
          <div className={styles.blank} />
          {props.playerList && <PlayerLobbyList players={props.playerList} />}
          {/*{props.playerList &&*/}
          {/*  props.playerList.map((item, index) => {*/}
          {/*    return (*/}
          {/*      <div className={'d-flex w-100 ' + styles.name} key={index}>*/}
          {/*        <div className={styles.avatarContainer}>*/}
          {/*          <Image*/}
          {/*            src={item.user?.avatar ?? '/assets/default-avatar.png'}*/}
          {/*            width={28}*/}
          {/*            height={28}*/}
          {/*            alt="avatar"*/}
          {/*            className={styles.avatarImage}*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*        <span className="text-white pe-1 fw-medium fs-6 my-auto text-start">*/}
          {/*          {item.nickname ?? 'Anonymous'}*/}
          {/*        </span>*/}
          {/*      </div>*/}
          {/*    )*/}
          {/*  })}*/}
          <div className={styles.blank} />
        </div>
      </div>
    </div>
  )
}

export default PlayerList
