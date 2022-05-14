import React from 'react'
import { TStartQuizResponse } from '../../types/types'
import { JsonParse } from '../../utils/helper'
import { useLocalStorage } from '../useLocalStorage/useLocalStorage'

export const useGameSession = (): TStartQuizResponse => {
  const [lsGameSession] = useLocalStorage('game-session', '')

  const [gameSession] = React.useState(() => {
    const gameData: TStartQuizResponse = JsonParse(
      lsGameSession
    ) as TStartQuizResponse
    return gameData
  })

  return gameSession
}
