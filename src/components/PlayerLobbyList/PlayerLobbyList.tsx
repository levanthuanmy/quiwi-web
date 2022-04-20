import { FC } from 'react'
import { TPlayer } from '../../types/types'
import PlayerLobbyItem from '../PlayerLobbyItem/PlayerLobbyItem'

const PlayerLobbyList: FC<{ players: TPlayer[] }> = (props) => {
  const players = props.players as TPlayer[]

  const colors: string[] = [
    'bg-primary',
    'bg-red-plume',
    'bg-green',
    'bg-orange',
    'bg-blue',
  ]
  const getRndInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  return (
    <>
      {players.length === 0 ? (
        <div className="bg-secondary text-white p-2 rounded-8px">
          Đang đợi người tham gia...
        </div>
      ) : (
        players.map((player, idx) => {
          const colorIdx = getRndInteger(0, colors.length)
          const color = colors[colorIdx]
          return PlayerLobbyItem({
            key: idx,
            player: player,
            color: color,
          })
        })
      )}
    </>
  )
}

export default PlayerLobbyList
