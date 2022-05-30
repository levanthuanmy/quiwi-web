import {useEffect, useState} from 'react'
import {Socket} from "socket.io-client";
import {TStartQuizResponse} from '../../types/types'
import {JsonParse} from '../../utils/helper'
import {useLocalStorage} from '../useLocalStorage/useLocalStorage'

import {SocketManager} from '../useSocket/socketManager'

export const useGameSession = (): { connectGameSocket: () => void; clearGameSession: () => void; gameSocket: () => (Socket | null); disconnectGameSocket: () => void; gameSession: TStartQuizResponse | null; saveGameSession: (gameSS: TStartQuizResponse) => void } => {
  const sk = SocketManager()


  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const [gameSession, setGameSession] = useState<TStartQuizResponse | null>(
    null
  )

  // cần debug thì in số này ra
  let deleteCount = 0

  useEffect(() => {
    if (lsGameSession && lsGameSession.length > 0) {
      deleteCount = 0
      const gs: TStartQuizResponse = JsonParse(
        lsGameSession
      ) as TStartQuizResponse
      setGameSession(gs)
      console.log('🎯️ GameSession => 💸')
    } else {
      if (deleteCount <= 0) {
        console.log('🎯️ ️GameSession => 🚮')
      }
      deleteCount += 1
      setGameSession(null)
    }
  }, [lsGameSession])

  const saveGameSession = (gameSS: TStartQuizResponse) => {
    console.log('🎯️ ️️GameSession => saveGameSession')
    setLsGameSession(JSON.stringify(gameSS))
    setGameSession(gameSS)
  }

  // alias cho sk.socketOf("GAMES") thôi
  const gameSocket = (): (Socket | null) => {
    sk.connect("GAMES")
    return sk.socketOf("GAMES")
  }

  const connectGameSocket = () => {
    if (!gameSocket() || gameSocket()?.disconnected) {
      sk.connect("GAMES")
    }
  }

  const disconnectGameSocket = () => {
    if (gameSocket()?.connected) {
      sk.disconnect("GAMES")
    }
  }

  const clearGameSession = () => {
    try {
      if (deleteCount <= 0)
        console.log('🎯️ ️️GameSession :: Clear')
      setLsGameSession('')
      setGameSession(null)
      localStorage.removeItem('game-session')
      localStorage.removeItem('game-session-player')
    } catch (error) {
      console.log('🎯️ ️️GameSession => Clear game lỗi', error)
    }
  }

  return ({gameSession, saveGameSession, clearGameSession, connectGameSocket, disconnectGameSocket, gameSocket})
}
