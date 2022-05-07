import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import LobbyScreen from '../../components/LobbyScreen/LobbyScreen'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { get } from '../../libs/api'
import { TApiResponse, TQuiz, TStartQuizResponse } from '../../types/types'
import { JsonParse } from '../../utils/helper'

const LobbyPage: NextPage = () => {
  const router = useRouter()
  const { quizId } = router.query
  const [invitationCode, setInvitationCode] = useState('')
  const [lsGameSession] = useLocalStorage('game-session', '')
  const [gameSession, setGameSession] = useState<TStartQuizResponse | null>(
    null
  )

  const {
    data: quizResponse,
    isValidating: isFetchingQuiz,
    error: fetchingQuizError,
  } = useSWR<TApiResponse<TQuiz>>([`/api/quizzes/quiz/${quizId}`], get)

  // Kiểm tra Quiz tồn tại hay không
  useEffect(() => {
    if ((!isFetchingQuiz && !quizResponse?.response) || fetchingQuizError) {
      alert('Không tìm thấy quiz')
      router.back()
    }
  }, [fetchingQuizError, isFetchingQuiz, quizResponse?.response, router])

  useEffect(() => {
    const _gameSession: TStartQuizResponse = JsonParse(lsGameSession)
    setGameSession(_gameSession)
    setInvitationCode(_gameSession.invitationCode)
  }, [lsGameSession])

  return (
    <>
      {gameSession && (
        <LobbyScreen
          gameSession={gameSession}
          invitationCode={invitationCode}
          isHost={false}
        />
      )}
    </>
  )
}

export default LobbyPage
