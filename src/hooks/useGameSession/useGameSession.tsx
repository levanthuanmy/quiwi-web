import {useEffect, useState} from 'react'
import {Socket} from "socket.io-client";
import {TQuestion, TStartQuizResponse, TUser} from '../../types/types'
import {JsonParse} from '../../utils/helper'
import {useLocalStorage} from '../useLocalStorage/useLocalStorage'
import {SocketManager} from '../useSocket/socketManager'

export const useGameSession = (): { gameSkOnce: (ev: string, listener: (...args: any[]) => void) => void; isHost: () => boolean; getQuestionWithID: (qid: number) => (TQuestion | null); gameSkOn: (ev: string, listener: (...args: any[]) => void) => void; connectGameSocket: () => void; clearGameSession: () => void; gameSocket: () => (Socket | null); disconnectGameSocket: () => void; gameSession: TStartQuizResponse | null; saveGameSession: (gameSS: TStartQuizResponse) => void } => {
  const sk = SocketManager()

  const [lsUser] = useLocalStorage('user', '')
  let _isHost: boolean | null = null
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
    // test xem có cần thiết connect lại trong này ko
    // sk.connect("GAMES")
    return sk.socketOf("GAMES")
  }

  const connectGameSocket = () => {
    if (!gameSocket() || gameSocket()?.disconnected) {
      sk.connect("GAMES")
      gameSocket()?.offAny()
      gameSocket()?.onAny(function(event, data) {
        console.log("🌎🌎 Event:",event);
        console.log("🌎🌎 Data:",data);
      });
    }
  }

  const disconnectGameSocket = () => {
    if (gameSocket()?.connected) {
      sk.disconnect("GAMES")
    }
  }

  const gameSkOn = (ev: string, listener: (...args: any[]) => void) => {
    gameSocket()?.off(ev)
    gameSocket()?.on(ev, listener)
  }

  const gameSkOnce = (ev: string, listener: (...args: any[]) => void) => {
    gameSocket()?.once(ev, listener)
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

  const getQuestionWithID = (qid: number): (TQuestion | null) => {
    return gameSession?.quiz?.questions[qid] || null
  }

  const isHost = ():boolean => {
    if (_isHost == null) {
      if (!gameSession) _isHost = false
      else {
        const user: TUser = JsonParse(lsUser)
        _isHost = (user.id === gameSession.hostId)
      }
    }
    return _isHost
  }

  return (
    {
      gameSession,
      saveGameSession,
      clearGameSession,
      connectGameSocket,
      disconnectGameSocket,
      gameSocket,
      gameSkOn,
      gameSkOnce,
      getQuestionWithID,
      isHost,
    }
  )
}
