/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import Cookies from 'universal-cookie'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../hooks/useSocket/useSocket'
import {
  TPlayer,
  TStartGameRequest,
  TStartQuizResponse,
  TUser,
} from '../../types/types'
import { JsonParse } from '../../utils/helper'
import MyButton from '../MyButton/MyButton'
import PlayerLobbyList from '../PlayerLobbyList/PlayerLobbyList'

type LobbyScreenProps = {
  invitationCode: string
  gameSession: TStartQuizResponse
  isHost: boolean
  // players: TPlayer[]
}
const LobbyScreen: FC<LobbyScreenProps> = ({
  gameSession,
  invitationCode,
  isHost,
  // players,
}) => {
  const [playerList, setPlayerList] = useState<TPlayer[]>([])
  const { socket } = useSocket()
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const [lsUser] = useLocalStorage('user', '')
  const [user, setUser] = useState<TUser>()
  const router = useRouter()

  useEffect(() => {
    if (socket && socket.disconnected) socket.connect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      const gameSession: TStartQuizResponse = JsonParse(lsGameSession)

      const lsPlayers: TPlayer[] = [...gameSession.players]
      setPlayerList(lsPlayers)

      socket.on('new-player', (data) => {
        console.log('new-player', data)

        const newPlayerList: TPlayer[] = [...lsPlayers, data.newPlayer]
        setPlayerList(newPlayerList)
        gameSession.players = newPlayerList
        setLsGameSession(JSON.stringify(gameSession))
      })

      socket.on('player-left', (data) => {
        console.log('player-left', data)

        let _players = [...playerList]
        _.remove(_players, (player) => player.id === data.id)
        setPlayerList(_players)
        gameSession.players = [..._players]
        setLsGameSession(JSON.stringify(gameSession))
      })

      socket.on('host-out', () => {
        localStorage.removeItem('game-session')
        localStorage.removeItem('game-session-player')
        router.push('/')
      })

      socket.on('game-started', (data) => {
        console.log('game started', data)
        router.push(`/game?questionId=0`)
      })

      socket.on('error', (data) => {
        console.log('socket error', data)
      })
    } catch (error) {
      console.log('useEffect - error', error)
    }
  }, [socket, lsGameSession])

  useEffect(() => {
    setUser(JsonParse(lsUser) as TUser)
  }, [])

  const handleLeaveRoom = () => {
    localStorage.removeItem('game-session')
    localStorage.removeItem('game-session-player')
    socket.close()
    router.back()
  }

  const handleStartGame = () => {
    try {
      const cookies = new Cookies()
      const accessToken = cookies.get('access-token')
      useLocalStorage

      if (user) {
        const msg: TStartGameRequest = {
          userId: user.id,
          invitationCode: invitationCode,
          token: accessToken,
        }
        socket.emit('start-game', msg)
      }
    } catch (error) {
      console.log('handleStartGame - error', error)
    }
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
          <MyButton
            className="w-100 text-white fw-medium"
            onClick={handleStartGame}
          >
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
