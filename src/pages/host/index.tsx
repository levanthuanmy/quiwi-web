import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import Cookies from 'universal-cookie'
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
    if (gameModeEnum && isShowGameModeScreen) {
      const user: TUser = JsonParse(lsUser)

      handleStartQuiz(Number(quizId), gameModeEnum, user.id)

      setIsShowGameModeScreen(false)
    }
  }, [gameModeEnum, isShowGameModeScreen])

  const handleStartQuiz = async (
    quizId: number,
    mode: TGameModeEnum,
    userId: number
  ) => {
    setIsFetchingSocket(true)
    try {
      const cookies = new Cookies()
      const accessToken = cookies.get('access-token')

      const msg: TStartQuizRequest = {
        quizId,
        userId,
        mode,
        token: accessToken,
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

      // socket.emit('start-quiz', msg)

      // socket.on('start-quiz', (data: TStartQuizResponse) => {
      //   console.log('socket.on - data', data)

      //   setLsGameSession(JSON.stringify(data))
      //   setGameSession(data)
      //   setInvitationCode(data.invitationCode)
      // })
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
