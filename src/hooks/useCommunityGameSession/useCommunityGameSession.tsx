import { useEffect, useState } from 'react'
import { TStartCommunityQuizResponse } from '../../types/types'
import { JsonParse } from '../../utils/helper'
import { communityGlobalSocket } from '../useCommunitySocket/useCommunitySocket'
import { useLocalStorage } from '../useLocalStorage/useLocalStorage'

export const useGameSession = (): {
  clearGameSession: () => void
  gameSession: TStartCommunityQuizResponse | null
  saveGameSession: (gameSS: TStartCommunityQuizResponse) => void
} => {
  const [lsGameSession, setLsGameSession] = useLocalStorage(
    'community-game-session',
    ''
  )
  const [gameSession, setGameSession] =
    useState<TStartCommunityQuizResponse | null>(null)

  useEffect(() => {
    if (lsGameSession && lsGameSession.length > 0) {
      const gs: TStartCommunityQuizResponse = JsonParse(
        lsGameSession
      ) as TStartCommunityQuizResponse
      setGameSession(gs)
      console.log('🎯️ Community GameSession => Cập nhật', gs)
    } else {
      console.log('🎯️ ️Community GameSession => null')
      setGameSession(null)
    }
  }, [lsGameSession])

  const saveGameSession = (gameSS: TStartCommunityQuizResponse) => {
    setLsGameSession(JSON.stringify(gameSS))
    setGameSession(gameSS)

    if (communityGlobalSocket.disconnected) {
      communityGlobalSocket.connect()
      console.log(
        '🎯️ ️️️Community GameSession ::  Socket => Kết nối',
        communityGlobalSocket
      )
    }
  }

  const clearGameSession = () => {
    try {
      console.log('🎯️ ️️️️️Community GameSession :: Clear')
      setLsGameSession('')
      setGameSession(null)
      localStorage.removeItem('community-game-session')
      localStorage.removeItem('game-session-player')

      if (communityGlobalSocket.connected) {
        communityGlobalSocket.disconnect()
        console.log(
          '🎯️ ️️GameSession :: Socket => Ngắt kết nối',
          communityGlobalSocket
        )
      }
    } catch (error) {
      console.log('🎯️ ️️️️️Community GameSession => Clear game lỗi', error)
    }
  }

  return { gameSession, saveGameSession, clearGameSession }
}
