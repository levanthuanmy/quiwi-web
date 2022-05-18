import React, {useEffect, useState} from 'react'
import {TStartQuizResponse} from '../../types/types'
import {JsonParse} from '../../utils/helper'
import {useLocalStorage} from '../useLocalStorage/useLocalStorage'
import {globalSocket} from "../useSocket/useSocket";

export const useGameSession = (): [(TStartQuizResponse | null), ((gameSS: TStartQuizResponse) => void), (() => void)] => {
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const [gameSession, setGameSession] = useState<TStartQuizResponse | null>(null)

  useEffect(() => {
      if (lsGameSession && lsGameSession.length > 0) {
        const gs:TStartQuizResponse = JsonParse(
          lsGameSession
        ) as TStartQuizResponse
        setGameSession(gs)
        console.log("🎯️ GameSession => Cập nhật", gs);
      } else {
        console.log("🎯️ ️GameSession => null");
        setGameSession(null)
      }
    }, [lsGameSession]
  )

  const saveGameSession = (gameSS: TStartQuizResponse) => {
    console.log("🎯️ ️️GameSession => Lưu");
    setLsGameSession(JSON.stringify(gameSS))
    if (globalSocket.disconnected) {
      globalSocket.connect()
      console.log("🎯️ ️️GameSession ::  Socket => Kết nối", globalSocket);
    }
  }

  const clearGameSession = () => {
    try {
      console.log("🎯️ ️️GameSession :: Clear");
      setLsGameSession("")
      setGameSession(null)
      localStorage.removeItem('game-session')
      localStorage.removeItem('game-session-player')

      if (globalSocket.connected) {
        globalSocket.disconnect()
        console.log("🎯️ ️️GameSession :: Socket => Ngắt kết nối", globalSocket);
      }
    } catch (error) {
      console.log("🎯️ ️️GameSession => Clear game lỗi", error);
    }
  }


  return [gameSession, saveGameSession, clearGameSession]
}
