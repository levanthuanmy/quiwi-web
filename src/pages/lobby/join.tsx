import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Image } from 'react-bootstrap'
import MyInput from '../../components/MyInput/MyInput'
import { useLocalStorage } from '../../hooks/use-local-storage/useLocalStorage'
import { TGameLobby, TPlayer } from '../../types/types'

const JoiningPage: NextPage = () => {
  const router = useRouter()

  const { invitationCode } = router.query
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const [lsPlayer, setLsPlayer] = useLocalStorage('game-session-player', '')
  const [nickname, setNickName] = useState('')

  const handleOnClick = () => {
    if (!nickname) {
      console.log('Nhập đi')
      alert('Nhập nickname mày')
      return
    }

    // phần này get socket trả về game lobby và player
    const gameLobby: TGameLobby = {
      hostId: 1,
      invitationCode: (invitationCode as string) ?? 'con chó mỹ',
      quizId: 1,
      time: -1,
      mode: '10CLASSIC',
      players: [],
      status: '00WAITING',
    }

    const p: TPlayer = {
      id: 3,
      gameLobbyId: 1,
      nickname: 'naruto',
      score: 0,
      userId: 1,
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
    }
    gameLobby.players.push(p)
    setLsGameSession(JSON.stringify(gameLobby))
    setLsPlayer(JSON.stringify(p))
    router.push('/lobby?quizId=' + gameLobby.quizId)
  }

  return (
    <div className="bg-secondary fw-medium bg-opacity-25 min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="my-3">
        <Image
          src="/assets/logo-text.png"
          width={133}
          height={39}
          alt="text-logo"
        />
      </div>

      <div className="">
        <div className="mb-2 text-center">Nhập tên hiển thị của bạn (50 ký tự)</div>

        <MyInput
          onChange={(e) => {
            setNickName(e.target.value)
          }}
          maxLength={50}
          placeholder="Nhập tên hiển thị"
        />
      </div>
      <div className="p-12px mb-3">
        <Button
          onClick={handleOnClick}
          className="rounded-20px px-32px py-12px h-50px"
        >
          <span className="text-white fw-medium">VÀO PHÒNG</span>
        </Button>
      </div>
    </div>
  )
}

export default JoiningPage
