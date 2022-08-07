import {NextPage} from 'next'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import CommunityGamePlay from '../../../../components/CommunityGameComponents/CommunityGamePlay/CommunityGamePlay'
import GameModeScreen from '../../../../components/GameModeScreen/GameModeScreen'
import MyModal from '../../../../components/MyModal/MyModal'
import {GameManager, TGameLobby} from '../../../../hooks/useGameSession/useGameSession'
import {useMyleGameSession} from '../../../../hooks/usePracticeGameSession/useMyleGameSession'
import {get, post} from '../../../../libs/api'
import {
  TApiResponse, TDetailPlayer, TExamDeadline,
  TGameModeEnum,
  TGamePlayBodyRequest, TPlayer, TQuestion,
  TQuiz,
  TStartQuizRequest,
} from '../../../../types/types'
import {useUser} from '../../../../hooks/useUser/useUser'
import {
  usePracticeGameSession
} from "../../../../hooks/usePracticeGameSession/usePracticeGameSession";
import Cookies from "universal-cookie";
import {TJoinQuizRequest, TReconnectQuizRequest} from "../../../lobby/join";
import LoadingBoard from "../../../../components/GameComponents/LoadingBoard/LoadingBoard";
import {useTimer} from "../../../../hooks/useTimer/useTimer";

const PlayCommunityQuizScreen: NextPage = () => {
  const router = useRouter()
  let id = Number(router.query.id)
  const myLeGameManager = useMyleGameSession()
  const practiceGameManager = usePracticeGameSession()
  const [isModeSelecting, setIsModeSelecting] = useState(false)
  const [gameMode, setMode] = useState<TGameModeEnum | null>(null)
  const user = useUser()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const timer = useTimer()
  useEffect(() => {
    let gameManager: GameManager | null = null
    if (myLeGameManager.gameSession)
      gameManager = myLeGameManager
    else if (practiceGameManager.gameSession)
      gameManager = practiceGameManager

    if (gameManager && gameManager?.gameSession) {
      console.log("=>(index.tsx:53) Kết nối lại phòng ", gameManager.gameSession.invitationCode, " Mode ", gameManager.gameSession.mode);
      setLoading('Đang kết nối lại...')
      if (!gameManager.gameSocket || gameManager.gameSocket.disconnected) {
        gameManager.connectGameSocket()
        gameManager.gameSkOnce('connect', () => {
          joinRoom(gameManager!)
        })
      } else {
        joinRoom(gameManager!)
      }
    } else {
      setLoading(null)
      setIsModeSelecting(true)
    }
  }, [])

  const modeSelected = (mode: TGameModeEnum) => {
    const gameManager = mode === "10CLASSIC" ? practiceGameManager : myLeGameManager
    if (!gameManager.gameSocket) {
      gameManager.connectGameSocket()
      gameManager.gameSkOnce('connect', () => {
        startQuiz(mode)
      })
    } else {
      startQuiz(mode)
    }
  }

  const startQuiz = async (mode: TGameModeEnum) => {
    try {
      const msg: TStartQuizRequest = {
        quizId: Number(id),
        mode,
      }
      if (user?.id) {
        msg.userId = user?.id
        msg.token = user?.token.accessToken
      }


      const quizResponse: TApiResponse<TQuiz> = await get(
        `/api/quizzes/quiz/${Number(id)}`,
        false
      )

      const body: TStartQuizRequest = {
        ...msg,
        deadline:
          (quizResponse?.response?.questions?.reduce(
            (a, b) => a + b.duration,
            0
          ) || 0) / 60,
      }
      const gameManager = mode === "10CLASSIC" ? practiceGameManager : myLeGameManager
      setMode(mode)
      gameManager.gameSkEmit("start-game", body)
      setIsModeSelecting(false)
    } catch (error) {
      console.log('=>(index.tsx:83) startQuiz error', error)
      setError((error as Error).message)
    }
  }

  const joinRoom = async (gameManager: GameManager) => {
    if (!gameManager.gameSession) return
    const cookies = new Cookies()
    const accessToken: string = cookies.get('access-token')
    let joinRoomRequest: TReconnectQuizRequest = {
      invitationCode: gameManager.gameSession.invitationCode,
    }

    const body: TGamePlayBodyRequest<TReconnectQuizRequest> = {
      socketId: gameManager.gameSocket!.id,
      data: joinRoomRequest,
    }

    if (user?.id) {
      // joinRoomRequest.token = accessToken
      joinRoomRequest.userId = user?.id
    }

    try {
      const response: TApiResponse<{
        deadline: TExamDeadline
        gameLobby: TGameLobby
        player: TPlayer
        question: TQuestion
      }> = await post(
        '/api/games/reconnect-community-game',
        {},
        body,
        true
      )

      const data = response.response
      console.log("/api/games/reconnect-community-game response", data);
      gameManager.gameSession = data.gameLobby
      gameManager.currentQuestion = data.question
      gameManager.player = data.player as TDetailPlayer
      gameManager.deadline = data.deadline

      setMode(gameManager.gameSession.mode)
      setIsModeSelecting(false)
      setLoading(null)
    } catch (error) {
      console.log('Join quiz - error', error)
      // alert((error as Error).message)
    }
  }

  const setGameMode = (mode: TGameModeEnum) => {
    modeSelected(mode)
  }
  return (
    <>
      {isModeSelecting && <GameModeScreen setGameMode={setGameMode}/>}
      {!isModeSelecting && gameMode &&
          <CommunityGamePlay mode={gameMode}/>
      }

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

      <LoadingBoard loadingTitle={loading}/>
    </>
  )
}

export default PlayCommunityQuizScreen
