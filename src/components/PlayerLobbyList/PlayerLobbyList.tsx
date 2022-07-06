import React, {FC, useEffect, useState} from 'react'
import {TPlayer} from '../../types/types'
import PlayerLobbyItem from '../PlayerLobbyItem/PlayerLobbyItem'
import MyModal from "../MyModal/MyModal";
import {SOUND_EFFECT} from "../../utils/constants";
import {useGameSession} from "../../hooks/useGameSession/useGameSession";
import {useSound} from "../../hooks/useSound/useSound";
import router from "next/router";

type PlayerLobbyListProps = {
  className?: string
  players: TPlayer[]
}

const PlayerLobbyList: FC<PlayerLobbyListProps> = (props: PlayerLobbyListProps) => {

  const colors: string[] = [
    '#009883',
    '#E86262',
    // '#22B139',
    '#EF154A',
    '#EF6415',
    '#A9C77E',
    '#B89A61',
    '#AB89A6',
  ]

  const game = useGameSession()
  const sound = useSound()
  const [isKicked, setIsKicked] = useState<boolean>(false)

  useEffect(() => {
    game.gameSkOn('player-kicked', (data) => {
      sound.playSound(SOUND_EFFECT['INCORRECT_BACKGROUND'])
      setIsKicked(true)
      console.log("=>(PlayerLobbyItem.tsx:36) isKicked", isKicked);
    })
  }, []);

  function getKickedModal() {
    return (
      <MyModal
        show={isKicked}
        onHide={() => (setIsKicked(true))}
        activeButtonTitle="ĐÃ HIỂU"
        activeButtonCallback={() => {
          game.clearGameSession()
          router.push('/my-lib')
        }}
      >
        <div className="text-center h3 fw-bolder text-danger">Bạn đã bị kick!</div>
        <div className="text-center fw-bold">
          <div className="text-secondary fs-24x">
              <span className="fw-bolder fs-24x  text-primary">
{'Chủ phòng đã kick bạn'}
                </span>
          </div>
          <div className="text-secondary fs-24x text-warning">
            Bạn sẽ mất phần thưởng và lịch sử tham dự quiz này do bị kick khỏi phòng
          </div>
        </div>
      </MyModal>
    )
  }

  const getColorForString = (id: number) => {
    return colors[id % colors.length]
  }

  function hash(str: string) {
//set variable hash as 0
    let hash = 0;
// if the length of the string is 0, return 0
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  return (
    <>
      {
        props.players.map((player, idx) => {
          return <PlayerLobbyItem
            key={idx}
            avatar={player.user?.avatar}
            displayName={player.nickname}
            bgColor={getColorForString(hash(player.nickname))}
            kickable={true}
          />
        })
      }
      {getKickedModal()}
    </>
  )
}

export default PlayerLobbyList
