import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import GameModeScreen from '../../components/GameModeScreen/GameModeScreen'
import LobbyScreen from '../../components/LobbyScreen/LobbyScreen'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../hooks/useSocket/useSocket'
import { get, post } from '../../libs/api'
import {
  TApiResponse,
  TGameModeEnum,
  TGamePlayBodyRequest,
  TQuiz,
  TStartQuizRequest,
  TStartQuizResponse,
  TUser,
} from '../../types/types'
import { JsonParse } from '../../utils/helper'

const HostPage: NextPage = () => {
  const router = useRouter()
  const { quizId } = router.query
  const [lsUser] = useLocalStorage('user', '')
  const [gameSession, setGameSession] = useState<TStartQuizResponse | null>(
    null
  )
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const [isShowGameModeScreen, setIsShowGameModeScreen] =
    useState<boolean>(false)
  const [invitationCode, setInvitationCode] = useState<string>('')
  const [gameModeEnum, setGameModeEnum] = useState<TGameModeEnum>()
  const [isFetchingSocket, setIsFetchingSocket] = useState<boolean>(false)
  const { socket } = useSocket()

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
        const _gameSession: TStartQuizResponse = JsonParse(lsGameSession)
        const hasGameSession = !_.isEmpty(_gameSession)

        if (hasGameSession) {
          // nếu có game session, hiển thị màn lobby có nút bắt đầu quiz
          setInvitationCode(_gameSession.invitationCode)
          setGameSession(_gameSession)
          setGameModeEnum(_gameSession.mode)
        }
        if (!hasGameSession) {
          // hiện thị chọn game mode rồi tạo game session lưu xuống ls
          setIsShowGameModeScreen(true)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    quizId,
    quizResponse,
    isFetchingQuiz,
    fetchingQuizError,
    lsUser,
    lsGameSession,
  ])

  useEffect(() => {
    console.log('useEffect - isShowGameModeScreen', isShowGameModeScreen)
    console.log('useEffect - gameModeEnum', gameModeEnum)
    if (gameModeEnum && isShowGameModeScreen) {
      const user: TUser = JsonParse(lsUser)
      handleStartQuiz(Number(quizId), gameModeEnum, user.id)
    }
  }, [gameModeEnum, isShowGameModeScreen])

  useEffect(() => {
    if (gameSession) setIsShowGameModeScreen(false)
    console.log('useEffect - gameSession', gameSession)
  }, [gameSession])

  const handleStartQuiz = async (
    quizId: number,
    mode: TGameModeEnum,
    userId: number
  ) => {
    setIsFetchingSocket(true)
    try {
      const msg: TStartQuizRequest = {
        quizId,
        userId,
        mode,
      }

      const body: TGamePlayBodyRequest<TStartQuizRequest> = {
        socketId: socket.id,
        data: msg,
      }

      const response: TApiResponse<TStartQuizResponse> = await post(
        'api/games/start-quiz',
        {},
        body,
        true
      )

      const quiz = response.response
      setLsGameSession(JSON.stringify(quiz))
      setGameSession(quiz)
      setInvitationCode(quiz.invitationCode)
    } catch (error) {
      console.log('handleStartQuiz - error', error)
    } finally {
      setIsFetchingSocket(false)
    }
  }

  return (
    <>
      {isShowGameModeScreen && <GameModeScreen setGameMode={setGameModeEnum} />}
      {gameSession && (
        <LobbyScreen
          gameSession={gameSession}
          invitationCode={invitationCode}
          isHost
          // players={gameSession.players}
        />
      )}
    </>
  )
}

export default HostPage
