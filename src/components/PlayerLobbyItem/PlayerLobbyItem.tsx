import React, {FC, useEffect, useState} from 'react'
import {Col, Image} from 'react-bootstrap'
import styles from './PlayerLobbyItem.module.css'
import useScreenSize from "../../hooks/useScreenSize/useScreenSize";
import MyModal from "../MyModal/MyModal";
import {TPlayer} from "../../types/types";
import {useGameSession} from "../../hooks/useGameSession/useGameSession";
import {SOUND_EFFECT} from "../../utils/constants";
import {useSound} from "../../hooks/useSound/useSound";
import router from "next/router";

type PlayerLobbyItemProps = {
  displayName: string,
  avatar?: string,
  bgColor: string,
  isHost?: boolean,
  kickable: boolean
}

type KickPlayerType = {
  nickname: string,
  invitationCode: string
}

const PlayerLobbyItem: FC<PlayerLobbyItemProps> = (props: PlayerLobbyItemProps) => {

  const {isMobile} = useScreenSize()
  const [isKick, setIsKick] = useState<boolean>(false)
  const game = useGameSession()

  function getEndGameModal() {
    return (
      <MyModal
        show={isKick}
        onHide={() => (setIsKick(false))}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={() => {
          if (game.gameSession) {
            const msg: KickPlayerType = {
              nickname: props.displayName,
              invitationCode: game.gameSession.invitationCode
            }
            setIsKick(false)
            game.gameSkEmit("kick-player", msg)
          }
        }}
        inActiveButtonCallback={() => setIsKick(false)}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center h3 fw-bolder">Kick người chơi?</div>

        <div className="text-center fw-bold">
          <div className="text-secondary fs-24x">
            {'Kick người chơi '}
            <span className="fw-bolder fs-24x  text-primary">
                  {props.displayName}
                </span>
            {' khỏi phòng? '}
          </div>
          <div className="text-secondary fs-24x text-warning">
            Người chơi bị kick sẽ mất phần thưởng và lịch sử tham dự quiz này
          </div>
        </div>
      </MyModal>
    )
  }


  return (
    <>
      <Col
        className={`d-flex align-items-center m-1 rounded-20px customScrollbar col-auto ${styles.tooltip} ${props.isHost ? styles.isHost : ""}`}
        style={{backgroundColor: props.bgColor}}
      >
        <Image
          src={props.avatar ? props.avatar : "/assets/default-avatar.png"}
          width={isMobile ? 24 : 30}
          height={isMobile ? 24 : 30}
          alt="/assets/default-avatar.png"
          className="rounded-circle"
        />
        <span className="px-1 text-white">{props.displayName}</span>
        {!props.isHost && game.isHost &&
            <i
                className="flex-grow-1 text-end bi bi-x-circle-fill text-danger fs-4 cursor-pointer"
                onClick={() => {
                  setIsKick(true)
                }}
            ></i>
        }
        {getEndGameModal()}
      </Col>
    </>
  )
}

export default PlayerLobbyItem
