import { get } from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import GameModeScreen from '../../../../components/GameModeScreen/GameModeScreen'
import { useCommunitySocket } from '../../../../hooks/useCommunitySocket/useCommunitySocket'
import { useGameSession } from '../../../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../../../hooks/useLocalStorage/useLocalStorage'
import { post } from '../../../../libs/api'
import {
    TApiResponse, TGameModeEnum, TGamePlayBodyRequest, TQuiz, TStartQuizRequest, TStartQuizResponse, TUser
} from '../../../../types/types'
import { JsonParse } from '../../../../utils/helper'

const PlayCommunityQuizScreen: NextPage = () => {
  const router = useRouter()
  const { quizId } = router.query
  const [lsUser] = useLocalStorage('user', '')
  const { gameSession, saveGameSession, clearGameSession } = useGameSession()
  const [isShowGameModeScreen, setIsShowGameModeScreen] =
    useState<boolean>(true)
  const [invitationCode, setInvitationCode] = useState<string>()
  const [gameModeEnum, setGameModeEnum] = useState<TGameModeEnum>()
  const [isFetchingSocket, setIsFetchingSocket] = useState<boolean>(false)
  const { socket } = useCommunitySocket()

  const {
    data: quizResponse,
    isValidating: isFetchingQuiz,
    error: fetchingQuizError,
  } = useSWR<TApiResponse<TQuiz>>(
    quizId ? [`/api/quizzes/quiz/${quizId}`] : null,
    get
  )
  useEffect(() => {
    if (socket && socket.disconnected) socket.connect()
  }, [socket])

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
    setIsFetchingSocket(true)
    try {
      if (!socket) return
      const msg: TStartQuizRequest = {
        quizId,
        userId,
        mode,
      }

      const body: TGamePlayBodyRequest<TStartQuizRequest> = {
        socketId: socket.id,
        data: msg,
      }
      console.log('=>(index.tsx:113) socket.id', socket?.id)
      const response: TApiResponse<TStartQuizResponse> = await post(
        'api/games/start-community-quiz',
        {},
        body,
        true
      )
      console.log('==== ~ response', response)

      if (response.response) {
        saveGameSession(response.response)
      }
    } catch (error) {
      console.log('handleStartQuiz - error', error)
    } finally {
      setIsFetchingSocket(false)
    }
  }

  return (
    <>
      {isShowGameModeScreen && <GameModeScreen setGameMode={setGameModeEnum} />}
      {gameSession && invitationCode && (
        // <LobbyScreen
        //   invitationCode={invitationCode}
        //   isHost
        //   // players={gameSession.players}
        // />
        <div>oklah</div>
      )}
    </>
  )
}

export default PlayCommunityQuizScreen
