import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {Form, Image} from 'react-bootstrap'
import Cookies from 'universal-cookie'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import {useLocalStorage} from '../../hooks/useLocalStorage/useLocalStorage'
import {post} from '../../libs/api'
import {TApiResponse, TGamePlayBodyRequest, TJoinQuizResponse, TStartQuizResponse,} from '../../types/types'
import {JsonParse} from '../../utils/helper'
import {useGameSession} from "../../hooks/useGameSession/useGameSession";

type TJoinQuizRequest = {
  userId?: number
  nickname: string
  invitationCode: string
}

const JoiningPage: NextPage = () => {
  const router = useRouter()
  const invitationCode = router.query?.invitationCode?.toString() || ''

  const {saveGameSession, gameSocket, connectGameSocket, gameSkOnce} = useGameSession()

  const [lsPlayer, setLsPlayer] = useLocalStorage('game-session-player', '')
  const [nickname, _setNickName] = useState<string>('')
  const [lsUser] = useLocalStorage('user', '')

  const handleOnClick = async () => {
    if (!nickname) {
      alert('Vui lòng nhập tên hiển thị')
      return
    }
    if (!gameSocket()) {
      connectGameSocket()
      // đợi socket có rồi mới join room
      gameSkOnce("connect", () => {
        joinRoom()
      });

      gameSkOnce("error", (data) => {
        console.log("Lobby/join.tsx socket error", data);
      });
    } else {
      // host đã kết nối socket rồi => join luôn
      joinRoom()
    }
  }


  const joinRoom = async () => {
    const cookies = new Cookies()
    const accessToken: string = cookies.get('access-token')

    let joinRoomRequest: TJoinQuizRequest = {
      nickname,
      invitationCode,
    }

    const body: TGamePlayBodyRequest<TJoinQuizRequest> = {
      socketId: gameSocket()!.id,
      data: joinRoomRequest,
    }

    if (accessToken?.length) {
      // joinRoomRequest.token = accessToken
      joinRoomRequest.userId = JsonParse(lsUser)['id']
    }

    console.log("Join quiz - body", body);
    try {
      const response: TApiResponse<TJoinQuizResponse> = await post(
        'api/games/join-room',
        {},
        body,
        true
      )

      const data = response.response
      console.log("=>(join.tsx:81) data", data);
      // lưu lại nickname của mình để dùng
      const gameSession: TStartQuizResponse = data.gameLobby
      gameSession.nickName = nickname

      saveGameSession(gameSession)
      setLsPlayer(JSON.stringify(data.player))

      router.push(`/lobby?quizId=${data.gameLobby.quizId}`)
    } catch (error) {
      console.log('Join quiz - error', error)
      alert((error as Error).message)
    }
  }


  return (
    <div
      className="bg-secondary fw-medium bg-opacity-25 min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="bg-white px-3 py-5 rounded-20px shadow-sm">
        <div className="mb-5 text-center">
          <Image
            src="/assets/logo-text.png"
            width={133}
            height={39}
            alt="text-logo"
          />
        </div>

        <Form.Label className="mb-3 text-center">
          Nhập tên hiển thị của bạn (tối đa 20 ký tự)
        </Form.Label>

        <MyInput
          onChange={(e) => {
            _setNickName(e.target.value)
          }}
          onSubmit={handleOnClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleOnClick()
            }
          }}
          maxLength={20}
          placeholder="Nhập tên hiển thị"
        />
        <MyButton onClick={handleOnClick} className="mt-3 text-white w-100">
          Vào ngay
        </MyButton>
      </div>
    </div>
  )
}

export default JoiningPage
