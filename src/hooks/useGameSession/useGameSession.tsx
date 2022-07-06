import {useEffect, useState} from 'react'
import {Socket} from "socket.io-client";
import {TQuestion, TStartQuizResponse, TUser} from '../../types/types'
import {JsonParse} from '../../utils/helper'
import {useLocalStorage} from '../useLocalStorage/useLocalStorage'
import {SocketManager} from '../useSocket/socketManager'
import {useSound} from "../useSound/useSound";
import {singletonHook} from "react-singleton-hook";

const init = {
  gameSkOnce: (ev: string, listener: (...args: any[]) => void) => null,
  isHost: false,
  getQuestionWithID: (qid: number) => null,
  gameSkOn: (ev: string, listener: (...args: any[]) => void) => null,
  connectGameSocket: () => null,
  clearGameSession: () => null,
  gameSocket: () => null,
  disconnectGameSocket: () => null,
  gameSkEmit: (ev: string, msg: any) => null,
  gameSession: null,
  saveGameSession: (gameSS: TStartQuizResponse) => null
}

export const useGameSession = (): {
  gameSkOnce: (ev: string, listener: (...args: any[]) => void) => void;
  isHost: boolean;
  getQuestionWithID: (qid: number) => (TQuestion | null);
  gameSkOn: (ev: string, listener: (...args: any[]) => void) => void;
  connectGameSocket: () => void;
  clearGameSession: () => void;
  gameSocket: () => (Socket | null);
  disconnectGameSocket: () => void;
  gameSkEmit: (ev: string, msg: any) => void;
  gameSession: TStartQuizResponse | null;
  saveGameSession: (gameSS: TStartQuizResponse) => void
} => {
  const sk = SocketManager()
  const soundManager = useSound()
  const [lsUser] = useLocalStorage('user', '')
  const [isHost, setIsHost] = useState<boolean>(false)
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
      soundManager?.setGameSoundOn(true)
      gameSocket()?.offAny()
      gameSocket()?.onAny(function (event, data) {
        console.log("🌎🌎 Event:", event);
        console.log("🌎🌎 Data:", data);
      });
    }
  }

  const disconnectGameSocket = () => {
    if (gameSocket()?.connected) {
      sk.disconnect("GAMES")
    }
  }

  const gameSkEmit = (ev: string, msg: any) => {
    console.log("📨📨 Event:", ev);
    console.log("📨📨 Message:", msg);
    gameSocket()?.emit(ev, msg)
  }

  const gameSkOn = (ev: string, listener: (...args: any[]) => void) => {
    gameSocket()?.off(ev)
    gameSocket()?.on(ev, listener)
  }

  const gameSkOnce = (ev: string, listener: (...args: any[]) => void) => {
    gameSocket()?.off(ev)
    gameSocket()?.once(ev, listener)
  }

  const clearGameSession = () => {
    try {
      if (deleteCount <= 0)
        console.log('🎯️ ️️GameSession :: Clear')
      if (soundManager)
        soundManager?.setGameSoundOn(false)
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

  useEffect(() => {
    if (!gameSession) setIsHost(false)
    else {
      const user: TUser = JsonParse(lsUser)
      setIsHost(user.id === gameSession.hostId)
    }
  }, [gameSession, lsUser]);

  return (
    {
      gameSession,
      saveGameSession,
      clearGameSession,
      connectGameSocket,
      disconnectGameSocket,
      gameSocket,
      gameSkOn,
      gameSkEmit,
      gameSkOnce,
      getQuestionWithID,
      isHost,
    }
  )
}

