import React, {FC} from 'react'
import {TPlayer} from '../../types/types'
import PlayerLobbyItem from '../PlayerLobbyItem/PlayerLobbyItem'

type PlayerLobbyListProps = {
  className?: string
  players: TPlayer[]
}

const PlayerLobbyList: FC<PlayerLobbyListProps> = (props: PlayerLobbyListProps) => {

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

  const getColorForString = (id: number) => {
    return colors[id % colors.length]
  }

  return (
    <>
      {props.players.length === 0 ? (
        <div className="bg-secondary text-white p-2 rounded-8px">
          Đang đợi người tham gia...
        </div>
      ) : (
        props.players.map((player, idx) => {
          return <PlayerLobbyItem
            key={idx}
            avatar={player.user?.avatar}
            displayName={player.nickname}
            bgColor={getColorForString(player.id)}/>
        })
      )
      }
    </>
  )
}

export default PlayerLobbyList
