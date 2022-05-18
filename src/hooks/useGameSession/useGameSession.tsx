import React, {useEffect, useState} from 'react'
import {TStartQuizResponse} from '../../types/types'
import {JsonParse} from '../../utils/helper'
import {useLocalStorage} from '../useLocalStorage/useLocalStorage'
import {globalSocket, useSocket} from "../useSocket/useSocket";

export const useGameSession = (): [(TStartQuizResponse | null), ((gameSS: TStartQuizResponse) => void), (() => void)] => {
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const [gameSession, setGameSession] = useState<TStartQuizResponse | null>(null)
  const skProps = useSocket()

  useEffect(() => {
      if (lsGameSession && lsGameSession.length > 0) {
        console.log("🎯️ GameSession => Cập nhật");
        setGameSession(JsonParse(
          lsGameSession
        ) as TStartQuizResponse)
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
      console.log("🎯️ ️️GameSession ::  Socket => Kết nối");
      globalSocket.connect()
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
        console.log("🎯️ ️️GameSession :: Socket => Ngắt kết nối");
      }
    } catch (error) {
      console.log("🎯️ ️️GameSession => Clear game lỗi", error);
    }
  }


  return [gameSession, saveGameSession, clearGameSession]
}
