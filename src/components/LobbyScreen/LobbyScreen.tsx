import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSocket } from '../../hooks/useSocket/useSocket'
import { TPlayer, TStartQuizResponse } from '../../types/types'
import PlayerLobbyList from '../PlayerLobbyList/PlayerLobbyList'

type LobbyScreenProps = {
  invitationCode: string
  gameSession: TStartQuizResponse
  isHost: boolean
  players: TPlayer[]
}
const LobbyScreen: FC<LobbyScreenProps> = ({
  gameSession,
  invitationCode,
  isHost,
  players,
}) => {
  const [playerList, setPlayerList] = useState<TPlayer[]>(players)
  const { socket } = useSocket()

  useEffect(() => {
    try {
      socket.on('new-player', (data) => {
        console.log('new-player', data)
        setPlayerList((prev) => [...prev, data.newPlayer])
      })

      socket.on('player-left', (data) => {
        console.log('player-left', data)
        const _players = [...playerList]
        // _.remove(_players, ()=>)
        // setPlayerList((prev) => )
      })
    } catch (error) {
      console.log('useEffect - error', error)
    }
  }, [socket])

  return (
    <div className="bg-secondary fw-medium bg-opacity-25 min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div>Tham gia với mã mời</div>
      <div className="fs-48px mb-3">{invitationCode}</div>

      <div className="text-secondary ">
        Game của{' '}
        <span className="text-primary">
          {gameSession.host?.name || gameSession.host?.username}
        </span>
      </div>

      <div className="text-secondary">32 người tham gia</div>

      {/* nếu là host thì hiện */}
      <div className="p-12px mb-3">
        <Button
          className="rounded-20px px-32px py-12px h-50px"
          onClick={() => null}
        >
          <span className="text-white fw-medium">
            {isHost ? 'BẮT ĐẦU' : 'RỜI PHÒNG'}
          </span>
        </Button>
      </div>

      <div className=" d-flex position-relative flex-wrap justify-content-center">
        <PlayerLobbyList players={playerList} />
      </div>
    </div>
  )
}

export default LobbyScreen
