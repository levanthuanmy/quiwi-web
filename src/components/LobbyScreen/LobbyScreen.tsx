import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../hooks/useSocket/useSocket'
import { TPlayer, TStartQuizResponse } from '../../types/types'
import { JsonParse } from '../../utils/helper'
import MyButton from '../MyButton/MyButton'
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
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const router = useRouter()

  useEffect(() => {
    try {
      const gameSession: TStartQuizResponse = JsonParse(lsGameSession)

      socket.on('new-player', (data) => {
        console.log('new-player', data)
        setPlayerList((prev) => [...prev, data.newPlayer])
        gameSession.players = [...playerList, data.newPlayer]
        setLsGameSession(JSON.stringify(gameSession))
      })

      socket.on('player-left', (data) => {
        console.log('player-left', data)
        let _players = [...playerList]
        _.remove(_players, (player) => player.id === data.id)
        setPlayerList(_players)
        gameSession.players = _players
        setLsGameSession(JSON.stringify(gameSession))
      })
    } catch (error) {
      console.log('useEffect - error', error)
    }
  }, [socket])

  const handleLeaveRoom = () => {
    localStorage.removeItem('game-session')
    localStorage.removeItem('game-session-player')
    socket.close()
    router.back()
  }

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

      <div className="text-secondary">{playerList.length} người tham gia</div>

      <div className="p-12px mb-3">
        <MyButton
          variant="secondary"
          className="w-100 text-white fw-medium bg-secondary"
          onClick={handleLeaveRoom}
        >
          RỜI PHÒNG
        </MyButton>
        <br />
        <br />
        {isHost && (
          <MyButton className="w-100 text-white fw-medium" onClick={() => null}>
            BẮT ĐẦU
          </MyButton>
        )}
      </div>

      <div className=" d-flex position-relative flex-wrap justify-content-center">
        <PlayerLobbyList players={playerList} />
      </div>
    </div>
  )
}

export default LobbyScreen
