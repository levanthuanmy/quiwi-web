import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import useSWR from 'swr'
import GameModeScreen from '../../components/GameModeScreen/GameModeScreen'
import LobbyScreen from '../../components/LobbyScreen/LobbyScreen'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TGameModeEnum,
  TPlayer,
  TQuiz,
  TStartQuizResponse,
  TUser,
} from '../../types/types'
import { API_URL } from '../../utils/constants'
import { JsonParse } from '../../utils/helper'

const players: TPlayer[] = [
  {
    id: 1,
    gameLobbyId: 1,
    nickname: 'hello',
    score: 0,
    userId: 1,
    user: {
      avatar:
        'https://s3-alpha-sig.figma.com/img/6930/d03e/8e80566f92d08cfcbc8d47879b183d48?Expires=1650844800&Signature=MiCqrZeF7D4aLNzKUdw1cQgKxVa~y41C9V5p0Ju98-j4vOZ~n9Y7LKrnRcOXscxY6LFnIyLTs8qeg7zQoN50CQklhwgqKAtM6Tkdc1EjT~XhKjtcQR9~fRO8rbXeVQPD8EzWfJdR8cZsBDN7u7HMY7h2ncrMYFzKr33-oXdrQs8XGlV96zE7hKFE1lhzcmD4fx9piYdXLgB1Tl6f~IngSWakwNC2EuV5fibnD3q0nvE7cpNz0wsOuyegbg4JQgqmWmh4bilbWiHfScNB53oRWN9JtIivSEJb0IGedgdRGy8FbewCQtXRdvsdGAl4AG3oLAaRB5G9B3Q0szzW5-Mxfg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA',
      id: 1,
      name: 'Con chó Mỹ',
      username: 'conchomy',
      role: 'user',
      isBanned: false,
      isLocked: false,
      isVerified: false,
      coin: 0,
      token: {
        expiredIn: 'string',
        refreshToken: 'string',
        accessToken: 'string',
      },
    },
  },
  {
    id: 2,
    gameLobbyId: 1,
    nickname: 'hello 1',
    score: 0,
    user: {
      avatar:
        'https://i1.sndcdn.com/artworks-Lccpqw8Th6KTMqud-LzgNgg-t500x500.jpg',
      id: 1,
      name: 'Con chó Mỹ',
      username: 'conchomy',
      role: 'user',
      isBanned: false,
      isLocked: false,
      isVerified: false,
      coin: 0,
      token: {
        expiredIn: 'string',
        refreshToken: 'string',
        accessToken: 'string',
      },
    },
  },
  {
    id: 3,
    gameLobbyId: 1,
    nickname: 'naruto',
    score: 0,
    user: {
      avatar:
        'https://www.pngitem.com/pimgs/m/650-6502360_8-bit-naruto-pixel-art-hd-png-download.png',
      id: 1,
      name: 'Con chó Mỹ',
      username: 'conchomy',
      role: 'user',
      isBanned: false,
      isLocked: false,
      isVerified: false,
      coin: 0,
      token: {
        expiredIn: 'string',
        refreshToken: 'string',
        accessToken: 'string',
      },
    },
  },
  {
    id: 4,
    gameLobbyId: 1,
    nickname: 'sasuke',
    score: 0,
    user: {
      avatar:
        'data:image/png;base64,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',
      id: 1,
      name: 'Con chó Mỹ',
      username: 'conchomy',
      role: 'user',
      isBanned: false,
      isLocked: false,
      isVerified: false,
      coin: 0,
      token: {
        expiredIn: 'string',
        refreshToken: 'string',
        accessToken: 'string',
      },
    },
  },
  {
    id: 4,
    gameLobbyId: 1,
    nickname: 'hello 3',
    score: 0,
  },
  {
    id: 4,
    gameLobbyId: 1,
    nickname: 'hello 3',
    score: 0,
  },
  {
    id: 4,
    gameLobbyId: 1,
    nickname: 'con chó thiện',
    score: 0,
  },
  {
    id: 4,
    gameLobbyId: 1,
    nickname: 'con chó mỹ',
    score: 0,
  },
  {
    id: 4,
    gameLobbyId: 1,
    nickname:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis laborum impedit rem nesciunt sunt assumenda rerum. Nemo, voluptatibus quae maxime doloremque quas doloribus error eligendi ea fuga voluptates similique quasi.',
    score: 0,
  },
]
const socket = io(`${API_URL}/games`, { transports: ['websocket'] })

const LobbyPage: NextPage = () => {
  const router = useRouter()
  const { quizId } = router.query
  const [invitationCode, setInvitationCode] = useState('')
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const [lsUser] = useLocalStorage('user', '')
  const [gameSession, setGameSession] = useState<TStartQuizResponse | null>(
    null
  )
  const [gameMode, setGameMode] = useState<TGameModeEnum>()
  const [isHost, setIsHost] = useState<boolean>()
  const [isShowGameModeScreen, setIsShowGameModeScreen] =
    useState<boolean>(false)

  const {
    data: quizResponse,
    isValidating: isFetchingQuiz,
    error: fetchingQuizError,
  } = useSWR<TApiResponse<TQuiz>>([`/api/quizzes/quiz/${quizId}`], get)

  // Kiểm tra Quiz tồn tại hay không
  useEffect(() => {
    if ((!isFetchingQuiz && !quizResponse?.response) || fetchingQuizError) {
      alert('Không tìm thấy quiz')
      router.back()
    } else {
      const user: TUser = JsonParse(lsUser)
      const quiz = quizResponse?.response

      setIsHost(user.id === quiz?.userId)

      const isHost = user.id === quiz?.userId
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    quizResponse,
    isFetchingQuiz,
    fetchingQuizError,
    lsUser,
    router,
    lsGameSession,
    quizId,
    invitationCode,
  ])

  useEffect(() => {
    if (gameMode) {
      const user: TUser = JsonParse(lsUser)

      const gameLobby: TGameLobby = {
        hostId: user.id,
        host: user,
        invitationCode: '123456',
        mode: gameMode,
        players: [],
        quizId: Number(quizId),
        time: -1,
        status: '00WAITING',
      }
      setLsGameSession(JSON.stringify(gameLobby))
      setGameSession(gameLobby)

      setIsShowGameModeScreen(false)
    }
  }, [gameMode])

  return (
    <>
      {isShowGameModeScreen && <GameModeScreen setGameMode={setGameMode} />}
      {gameSession && (
        <LobbyScreen
          gameSession={gameSession}
          invitationCode={invitationCode}
          isHost={isHost}
          players={players}
        />
      )}
    </>
  )
}

export default LobbyPage
