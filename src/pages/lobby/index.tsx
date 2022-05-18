import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import LobbyScreen from '../../components/LobbyScreen/LobbyScreen'
import {get} from '../../libs/api'
import {TApiResponse, TQuiz} from '../../types/types'
import {useGameSession} from "../../hooks/useGameSession/useGameSession";

const LobbyPage: NextPage = () => {
  const router = useRouter()
  const {quizId} = router.query
  const [invitationCode] = useState('')
  const [gameSession, saveGameSession] = useGameSession()

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

  return (
    <>
      {gameSession && (
        <LobbyScreen
          invitationCode={invitationCode}
          isHost={false}
          // players={gameSession.players}
        />
      )}
    </>
  )
}

export default LobbyPage
