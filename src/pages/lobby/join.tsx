import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Form, Image } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import { number } from 'yup'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../hooks/useSocket/useSocket'
import { post } from '../../libs/api'
import {
  TApiResponse,
  TGamePlayBodyRequest,
  TJoinQuizResponse,
} from '../../types/types'
import { JsonParse } from '../../utils/helper'

type TJoinQuizRequest = {
  userId?: number
  nickname: string
  invitationCode: string
}

const JoiningPage: NextPage = () => {
  const router = useRouter()

  const invitationCode = router.query?.invitationCode?.toString() || ''
  // eslint-disable-next-line no-unused-vars
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  // eslint-disable-next-line no-unused-vars
  const [lsPlayer, setLsPlayer] = useLocalStorage('game-session-player', '')
  const [nickname, setNickName] = useState<string>('')
  const [lsUser] = useLocalStorage('user', '')
  const { socket } = useSocket()

  const handleOnClick = async () => {
    try {
      if (!nickname) {
        alert('Nhập nickname mày')
        return
      }

      const cookies = new Cookies()
      const accessToken: string = cookies.get('access-token')

      let joinRoomRequest: TJoinQuizRequest = {
        nickname,
        invitationCode,
      }

      const body: TGamePlayBodyRequest<TJoinQuizRequest> = {
        socketId: socket.id,
        data: joinRoomRequest,
      }

      if (accessToken?.length) {
        const userId: number = JsonParse(lsUser)['id']
        // joinRoomRequest.token = accessToken
        joinRoomRequest.userId = userId
      }

      socket.connect()

      const response: TApiResponse<TJoinQuizResponse> = await post(
        'api/games/join-room',
        {},
        body,
        true
      )

      const data = response.response
      setLsGameSession(JSON.stringify(data.gameLobby))
      setLsPlayer(JSON.stringify(data.player))
      router.push(`/lobby?quizId=${data.gameLobby.quizId}`)

      // socket.emit('join-room', joinRoomRequest)
      // console.log('==== ~ handleOnClick ~ joinRoomRequest', joinRoomRequest)

      // socket.on('joined-quiz', (data: TJoinQuizResponse) => {
      //   console.log('socket.on - data', data)

      //   setLsGameSession(JSON.stringify(data.gameLobby))
      //   setLsPlayer(JSON.stringify(data.player))

      //   router.push(`/lobby?quizId=${data.gameLobby.quizId}`)
      // })
    } catch (error) {
      console.log('Join quiz - error', error)
      alert((error as Error).message)
    }
  }

  return (
    <div className="bg-secondary fw-medium bg-opacity-25 min-vh-100 d-flex flex-column justify-content-center align-items-center">
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
          Nhập tên hiển thị của bạn (tối đa 50 ký tự)
        </Form.Label>

        <MyInput
          onChange={(e) => {
            setNickName(e.target.value)
          }}
          maxLength={50}
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
