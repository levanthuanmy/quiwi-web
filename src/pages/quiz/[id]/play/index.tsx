import { get } from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import useSWR from 'swr'
import CommunityGamePlay from '../../../../components/CommunityGameComponents/CommunityGamePlay/CommunityGamePlay'
import GameModeScreen from '../../../../components/GameModeScreen/GameModeScreen'
import MyModal from '../../../../components/MyModal/MyModal'
import { useCommunitySocket } from '../../../../hooks/useCommunitySocket/useCommunitySocket'
import { useGameSession } from '../../../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../../../hooks/useLocalStorage/useLocalStorage'
import { post } from '../../../../libs/api'
import {
  TApiResponse,
  TGameModeEnum,
  TGamePlayBodyRequest,
  TQuiz,
  TStartQuizRequest,
  TStartQuizResponse,
  TUser
} from '../../../../types/types'
import { JsonParse } from '../../../../utils/helper'

const PlayCommunityQuizScreen: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [lsUser] = useLocalStorage('user', '')
  const { gameSession, saveGameSession, clearGameSession } = useGameSession()
  const [isShowGameModeScreen, setIsShowGameModeScreen] =
    useState<boolean>(true)
  const [invitationCode, setInvitationCode] = useState<string>()
  const [gameModeEnum, setGameModeEnum] = useState<TGameModeEnum>()
  const [isFetchingSocket, setIsFetchingSocket] = useState<boolean>(false)
  const { socket } = useCommunitySocket()
  const [error, setError] = useState('')

  const {
    data: quizResponse,
    isValidating: isFetchingQuiz,
    error: fetchingQuizError,
  } = useSWR<TApiResponse<TQuiz>>(id ? `/api/quizzes/quiz/${id}` : null, get)

  useEffect(() => {
    if (socket && socket.disconnected) socket.connect()
  }, [socket])

  useEffect(() => {
    if (gameModeEnum && isShowGameModeScreen) {
      const user: TUser = JsonParse(lsUser)
      handleStartQuiz(Number(id), gameModeEnum, user.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        quizId: quizId,
        userId,
        mode,
      }

      const body: TGamePlayBodyRequest<TStartQuizRequest> = {
        socketId: socket.id,
        data: msg,
      }
      const response: TApiResponse<TStartQuizResponse> = await post(
        'api/games/start-community-quiz',
        {},
        body,
        true
      )

      if (response.response) {
        saveGameSession(response.response)
      }
    } catch (error) {
      setError((error as Error).message)
      console.log('handleStartQuiz - error', error)
    } finally {
      setIsFetchingSocket(false)
    }
  }
  // Bắt đầu game
  useEffect(() => {
    const quiz = quizResponse?.response

    if (fetchingQuizError) {
      setError(fetchingQuizError)
    }
    if (gameSession) {
      // nếu có game session, hiển thị màn lobby có nút bắt đầu quiz
      setInvitationCode(gameSession.invitationCode)
      setGameModeEnum(gameSession.mode)
    } else {
      // hiện thị chọn game mode rồi tạo game session lưu xuống ls
      setIsShowGameModeScreen(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSession])

  return (
    <>
      {isShowGameModeScreen && <GameModeScreen setGameMode={setGameModeEnum} />}
      {gameSession && invitationCode && (
        // <LobbyScreen
        //   invitationCode={invitationCode}
        //   isHost
        //   // players={gameSession.players}
        // />
        <CommunityGamePlay />
      )}
      <MyModal
        show={error.length > 0}
        onHide={() => setError('')}
        size="sm"
        header={
          <Modal.Title className="text-danger">Đã có lỗi xảy ra</Modal.Title>
        }
        inActiveButtonCallback={() => setError('')}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center">{error}</div>
      </MyModal>
    </>
  )
}

export default PlayCommunityQuizScreen
