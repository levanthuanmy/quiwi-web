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

  return (
    <>
      {
        props.players.map((player, idx) => {
          return <PlayerLobbyItem
            key={idx}
            avatar={player.user?.avatar}
            displayName={player.nickname}
            bgColor={getColorForString(hash(player.nickname))}/>
        })
      }
    </>
  )
}

export default PlayerLobbyList
