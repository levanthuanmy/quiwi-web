import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import CommunityGamePlay from '../../../../components/CommunityGameComponents/CommunityGamePlay/CommunityGamePlay'
import GameModeScreen from '../../../../components/GameModeScreen/GameModeScreen'
import MyModal from '../../../../components/MyModal/MyModal'
import { TGameLobby } from '../../../../hooks/useGameSession/useGameSession'
import { useMyleGameSession } from '../../../../hooks/usePracticeGameSession/useMyleGameSession'
import { get, post } from '../../../../libs/api'
import {
  TApiResponse,
  TGameModeEnum,
  TGamePlayBodyRequest,
  TQuiz,
  TStartQuizRequest,
} from '../../../../types/types'
import { useUser } from '../../../../hooks/useUser/useUser'

const PlayCommunityQuizScreen: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const myleGameSession = useMyleGameSession()
  const [isModeSelecting, setIsModeSelecting] = useState(true)
  const user = useUser()
  const [error, setError] = useState('')

  useEffect(() => {
    if (myleGameSession.gameSession) setIsModeSelecting(false)
  }, [])

  const modeSelected = (mode: TGameModeEnum) => {
    if (!myleGameSession.gameSocket) {
      myleGameSession.connectGameSocket()
      myleGameSession.gameSkOnce('connect', () => {
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
      }

      const quizResponse: TApiResponse<TQuiz> = await get(
        `/api/quizzes/quiz/${Number(id)}`,
        false
      )

      const body: TGamePlayBodyRequest<TStartQuizRequest> = {
        socketId: myleGameSession.gameSocket!.id,
        data: {
          ...msg,
          deadline:
            (quizResponse?.response?.questions?.reduce(
              (a, b) => a + b.duration,
              0
            ) || 0) / 60,
        },
      }

      const response: TApiResponse<TGameLobby> = await post(
        'api/games/start-community-quiz',
        {},
        body,
        true
      )

      if (response.response) {
        myleGameSession.gameSession = response.response
        setIsModeSelecting(false)
      }
    } catch (error) {
      console.log('=>(index.tsx:83) error', error)
      setError((error as Error).message)
    }
  }

  const setGameMode = (mode: TGameModeEnum) => {
    modeSelected(mode)
  }
  return (
    <>
      {isModeSelecting && <GameModeScreen setGameMode={setGameMode} />}
      {!isModeSelecting && <CommunityGamePlay />}
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
