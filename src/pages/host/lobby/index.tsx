import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import GameModeScreen from '../../../components/GameModeScreen/GameModeScreen'
import LobbyScreen from '../../../components/LobbyScreen/LobbyScreen'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { get, post } from '../../../libs/api'
import {
  TApiResponse,
  TGameModeEnum,
  TGamePlayBodyRequest,
  TQuiz,
  TStartQuizRequest,
  TStartQuizResponse,
  TUser,
} from '../../../types/types'
import { JsonParse } from '../../../utils/helper'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import { useSound } from '../../../hooks/useSound/useSound'

const HostPage: NextPage = () => {
  const router = useRouter()
  const { quizId } = router.query
  const [lsUser] = useLocalStorage('user', '')
  const { gameSession, saveGameSession, connectGameSocket, gameSocket } =
    useGameSession()
  const [isShowGameModeScreen, setIsShowGameModeScreen] =
    useState<boolean>(true)
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
    connectGameSocket()
    sound?.setGameSoundOn(true)
  }, [])

  useEffect(() => {
    const quiz = quizResponse?.response
    if (quizId && !isFetchingQuiz && (!quiz || fetchingQuizError)) {
      alert('Không tìm thấy quiz')
      // router.back()
    } else {
      const user: TUser = JsonParse(lsUser)
      const isHost = user.id === quiz?.userId
      if (isHost) {
        if (gameSession) {
          // nếu có game session, hiển thị màn lobby có nút bắt đầu quiz
          setInvitationCode(gameSession.invitationCode)
          setGameModeEnum(gameSession.mode)
        } else {
          // hiện thị chọn game mode rồi tạo game session lưu xuống ls
          setIsShowGameModeScreen(true)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSession])

  useEffect(() => {
    if (gameModeEnum && isShowGameModeScreen) {
      const user: TUser = JsonParse(lsUser)
      handleStartQuiz(Number(quizId), gameModeEnum, user.id)
    }
  }, [gameModeEnum, isShowGameModeScreen])

  useEffect(() => {
    if (gameSession) {
      setIsShowGameModeScreen(false)
    }
  }, [gameSession])

  const handleStartQuiz = async (
    quizId: number,
    mode: TGameModeEnum,
    userId: number
  ) => {
    try {
      if (!gameSocket()) return
      const msg: TStartQuizRequest = {
        quizId,
        userId,
        mode,
      }

      const body: TGamePlayBodyRequest<TStartQuizRequest> = {
        socketId: gameSocket()!.id,
        data: msg,
      }
      console.log('=>Màn lobby socket.id', gameSocket()?.id)
      const response: TApiResponse<TStartQuizResponse> = await post(
        'api/games/start-quiz',
        {},
        body,
        true
      )

      if (response.response) {
        saveGameSession(response.response)
      }
    } catch (error) {
      console.log('handleStartQuiz - error', error)
    }
  }

  return (
    <>
      {isShowGameModeScreen && <GameModeScreen setGameMode={setGameModeEnum} />}
      {gameSession && invitationCode && (
        <LobbyScreen
          invitationCode={invitationCode}
          isHost
          // players={gameSession.players}
        />
      )}
    </>
  )
}

export default HostPage
