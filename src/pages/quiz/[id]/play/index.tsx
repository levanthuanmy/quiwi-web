import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Form, Image, Modal } from 'react-bootstrap'
import CommunityGamePlay from '../../../../components/CommunityGameComponents/CommunityGamePlay/CommunityGamePlay'
import LoadingBoard from '../../../../components/GameComponents/LoadingBoard/LoadingBoard'
import GameModeScreen from '../../../../components/GameModeScreen/GameModeScreen'
import MyButton from '../../../../components/MyButton/MyButton'
import MyInput from '../../../../components/MyInput/MyInput'
import MyModal from '../../../../components/MyModal/MyModal'
import {
  GameManager,
  TGameLobby,
} from '../../../../hooks/useGameSession/useGameSession'
import { useMyleGameSession } from '../../../../hooks/usePracticeGameSession/useMyleGameSession'
import { usePracticeGameSession } from '../../../../hooks/usePracticeGameSession/usePracticeGameSession'
import { useUser } from '../../../../hooks/useUser/useUser'
import { get, post } from '../../../../libs/api'
import {
  TApiResponse,
  TDetailPlayer,
  TExamDeadline,
  TGameModeEnum,
  TGamePlayBodyRequest,
  TPlayer,
  TQuestion,
  TQuiz,
  TStartQuizRequest,
} from '../../../../types/types'
import { TReconnectQuizRequest } from '../../../lobby/join'

const PlayCommunityQuizScreen: NextPage = () => {
  const router = useRouter()
  let id = Number(router.query.id)
  const { invitationCode } = router.query
  const myLeGameManager = useMyleGameSession()
  const practiceGameManager = usePracticeGameSession()
  const [isModeSelecting, setIsModeSelecting] = useState(false)
  const [isNicknameStep, setIsNicknameStep] = useState(false)
  const [gameMode, setMode] = useState<TGameModeEnum | null>(null)
  const user = useUser()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [nickname, _setNickName] = useState<string>(user?.username || '')

  useEffect(() => {
    let gameManager: GameManager | null = null
    if (myLeGameManager.gameSession) gameManager = myLeGameManager
    else if (practiceGameManager.gameSession) gameManager = practiceGameManager

    if (gameManager && gameManager?.gameSession) {
      console.log(
        '=>(index.tsx:53) Kết nối lại phòng ',
        gameManager.gameSession.invitationCode,
        ' Mode ',
        gameManager.gameSession.mode
      )

      // if (gameManager.gameSession.quizId !== id) {
      //   gameManager.clearGameSession()

      //   setLoading('Chưa tham gia phòng chờ nào...')
      // } else {
      setLoading('Đang kết nối lại...')
      if (!gameManager.gameSocket || gameManager.gameSocket.disconnected) {
        gameManager.connectGameSocket()
        gameManager.gameSkOnce('connect', () => {
          joinRoom(gameManager!)
        })
      } else {
        joinRoom(gameManager!)
      }
      // }
    } else {
      setLoading(null)
      setIsNicknameStep(true)
      // setIsModeSelecting(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modeSelected = (mode: TGameModeEnum) => {
    const gameManager =
      mode === '10CLASSIC' ? practiceGameManager : myLeGameManager
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
        nickname,
      }
      if (user?.id) {
        msg.userId = user?.id
        msg.token = user?.token.accessToken
      }

      const quizResponse: TApiResponse<TQuiz> = await get(
        `/api/quizzes/quiz/${Number(id)}`,
        false,
        {
          secretKey: invitationCode,
        }
      )

      const body: TStartQuizRequest = {
        ...msg,
        deadline:
          (quizResponse?.response?.questions?.reduce(
            (a, b) => a + b.duration,
            0
          ) || 0) / 60,
      }
      const gameManager =
        mode === '10CLASSIC' ? practiceGameManager : myLeGameManager
      setMode(mode)
      gameManager.gameSkEmit('start-game', body)
      setIsModeSelecting(false)
    } catch (error) {
      console.log('=>(index.tsx:83) startQuiz error', error)
      setError((error as Error).message)
    }
  }

  const joinRoom = async (gameManager: GameManager) => {
    if (!gameManager.gameSession) return

    let joinRoomRequest: TReconnectQuizRequest = {
      invitationCode: gameManager.gameSession.invitationCode,
    }

    const body: TGamePlayBodyRequest<TReconnectQuizRequest> = {
      socketId: gameManager.gameSocket!.id,
      data: joinRoomRequest,
    }

    if (user?.id) {
      joinRoomRequest.userId = user?.id
    }

    try {
      const response: TApiResponse<{
        deadline: TExamDeadline
        gameLobby: TGameLobby
        player: TPlayer
        question: TQuestion
      }> = await post('/api/games/reconnect-community-game', {}, body, true)

      const data = response.response
      console.log('/api/games/reconnect-community-game response', data)
      gameManager.gameSession = data.gameLobby
      gameManager.currentQuestion = data.question
      gameManager.player = data.player as TDetailPlayer
      gameManager.deadline = data.deadline

      setMode(gameManager.gameSession.mode)
      setIsModeSelecting(false)
      setIsNicknameStep(false)
      setLoading(null)
    } catch (error) {
      console.log('Join quiz - error', error)
      // alert((error as Error).message)
    }
  }
  const handeleSetNickname = async () => {
    if (!nickname) {
      alert('Vui lòng nhập tên hiển thị')
      return
    }

    setIsModeSelecting(true)
    setIsNicknameStep(false)
  }

  const setGameMode = (mode: TGameModeEnum) => {
    modeSelected(mode)
  }
  return (
    <>
      {isNicknameStep && (
        <div className="bg-secondary fw-medium bg-opacity-25 min-vh-100 d-flex flex-column justify-content-center align-items-center">
          <div className="bg-white px-3 py-5 rounded-20px shadow-sm">
            <div
              className="mb-5 text-center cursor-pointer"
              onClick={() => router.push('/home')}
            >
              <Image
                src="/assets/logo-text.png"
                width={133}
                height={39}
                alt="text-logo"
              />
            </div>

            <Form.Label className="mb-3 text-center">
              Nhập tên hiển thị của bạn (tối đa 16 ký tự)
            </Form.Label>

            <MyInput
              onChange={(e) => {
                _setNickName(e.target.value)
              }}
              onSubmit={handeleSetNickname}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handeleSetNickname()
                }
              }}
              defaultValue={nickname}
              maxLength={16}
              placeholder="Nhập tên hiển thị"
            />
            <MyButton
              onClick={handeleSetNickname}
              className="mt-3 text-white w-100"
            >
              Vào ngay
            </MyButton>
          </div>
        </div>
      )}
      {isModeSelecting && <GameModeScreen setGameMode={setGameMode} />}
      {!isModeSelecting && gameMode && <CommunityGamePlay mode={gameMode} />}

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

      <LoadingBoard loadingTitle={loading} />
    </>
  )
}

export default PlayCommunityQuizScreen
