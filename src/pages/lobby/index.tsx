import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import LobbyScreen from '../../components/LobbyScreen/LobbyScreen'
import {get} from '../../libs/api'
import {TApiResponse, TQuiz} from '../../types/types'
import {useGameSession} from "../../hooks/useGameSession/useGameSession";

const LobbyPage: NextPage = () => {
  const {gameSession} = useGameSession()
  return (
    <>
      {gameSession && (
        <LobbyScreen
          invitationCode={gameSession.invitationCode}
          isHost={false}
          // players={gameSession.players}
        />
      )}
    </>
  )
}

export default LobbyPage
