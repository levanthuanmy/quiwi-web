import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import LobbyScreen from '../../components/LobbyScreen/LobbyScreen'
import {get} from '../../libs/api'
import {TApiResponse, TQuiz} from '../../types/types'
import {useGameSession} from "../../hooks/useGameSession/useGameSession";

const LobbyPage: NextPage = () => {
  const game = useGameSession()
  return (
    <>
      {game.gameSession && (
        <LobbyScreen/>
      )}
    </>
  )
}

export default LobbyPage
