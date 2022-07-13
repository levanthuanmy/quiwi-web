import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import GameModeScreen from '../../../components/GameModeScreen/GameModeScreen'
import LobbyScreen from '../../../components/LobbyScreen/LobbyScreen'
import {get, post} from '../../../libs/api'
import {
  TApiResponse,
  TGameModeEnum,
  TGamePlayBodyRequest,
  TQuiz,
  TStartQuizRequest,
  TStartQuizResponse,
} from '../../../types/types'
import {TGameLobby, TGameSession, useGameSession} from '../../../hooks/useGameSession/useGameSession'
import {useSound} from '../../../hooks/useSound/useSound'
import {useUser} from "../../../hooks/useUser/useUser";

const HostPage: NextPage = () => {
  const router = useRouter()
  const { quizId } = router.query

  const gameManager = useGameSession()
  const user = useUser()
  const [isShowGameModeScreen, setIsShowGameModeScreen] = useState<boolean>(true)
  const [invitationCode, setInvitationCode] = useState<string>()
  const [gameModeEnum, setGameModeEnum] = useState<TGameModeEnum>()
  const sound = useSound()

  const {
    data: quizResponse,
    isValidating: isFetchingQuiz,
    error: fetchingQuizError,
  } = useSWR<TApiResponse<TQuiz>>(
    quizId ? [`/api/quizzes/quiz/${quizId}`, true] : null,
    get
  )
  useEffect(() => {
    // mới vô màn lobby thì connect trước để có socket id gửi Zlên
    gameManager.connectGameSocket()
    sound?.setGameSoundOn(true)
  }, [])

  useEffect(() => {
    if (gameModeEnum && isShowGameModeScreen) {
      handleStartQuiz(Number(quizId), gameModeEnum, user.id)
    }
  }, [gameModeEnum, isShowGameModeScreen])

  function checkJoinRoom() {
    const quiz = quizResponse?.response
    if (quizId && !isFetchingQuiz && (!quiz || fetchingQuizError)) {
      alert('Không tìm thấy quiz')
    } else {
      if (gameManager.isHost && gameManager.gameSession) {
          setInvitationCode(gameManager.gameSession.invitationCode)
          setGameModeEnum(gameManager.gameSession.mode)
      }
    }
    setIsShowGameModeScreen(gameManager.gameSession == null)
  }

  const handleStartQuiz = async (
    quizId: number,
    mode: TGameModeEnum,
    userId: number
  ) => {
    try {
      if (!gameManager.gameSocket) return
      const msg: TStartQuizRequest = {
        quizId,
        userId,
        mode,
      }

      const body: TGamePlayBodyRequest<TStartQuizRequest> = {
        socketId: gameManager.gameSocket.id,
        data: msg,
      }

      const response: TApiResponse<TGameLobby> = await post(
        'api/games/start-quiz',
        {},
        body,
        true
      )

      if (response.response) {
        gameManager.gameSession = response.response
      }
      checkJoinRoom()
    } catch (error) {
      console.log('handleStartQuiz - error', error)
    }
  }

  return (
    <>
      {isShowGameModeScreen ?
        <GameModeScreen setGameMode={setGameModeEnum} />
        :
        <LobbyScreen/>
      }
    </>
  )
}

export default HostPage
