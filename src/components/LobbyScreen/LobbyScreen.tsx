/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash'
import {useRouter} from 'next/router'
import React, {FC, useEffect, useState} from 'react'
import Cookies from 'universal-cookie'
import {useLocalStorage} from '../../hooks/useLocalStorage/useLocalStorage'
import {useSocket} from '../../hooks/useSocket/useSocket'
import {TPlayer, TStartGameRequest, TStartQuizResponse, TUser,} from '../../types/types'
import {JsonParse} from '../../utils/helper'
import MyButton from '../MyButton/MyButton'
import PlayerLobbyList from '../PlayerLobbyList/PlayerLobbyList'
import Head from "next/head";
import styles from "./LobbyScreen.module.css"
import {Modal, Toast, ToastContainer} from "react-bootstrap";
import QRCode from "react-qr-code";
import useIsMobile from "../../hooks/useIsMobile/useIsMobile";

type LobbyScreenProps = {
  invitationCode: string
  gameSession: TStartQuizResponse
  isHost: boolean
  // players: TPlayer[]
}
const LobbyScreen: FC<LobbyScreenProps> = ({
                                             gameSession,
                                             invitationCode,
                                             isHost,
                                             // players,
                                           }) => {
  const [playerList, setPlayerList] = useState<TPlayer[]>([])
  const {socket} = useSocket()
  const [lsGameSession, setLsGameSession] = useLocalStorage('game-session', '')
  const [lsUser] = useLocalStorage('user', '')
  const [user, setUser] = useState<TUser>()
  const router = useRouter()
  const [showToast, setShowToast] = useState<boolean>(false)
  const [showQR, setShowQR] = useState<boolean>(false)
  const isMobile = useIsMobile()
  useEffect(() => {
    if (socket && socket.disconnected) socket.connect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      const gameSession: TStartQuizResponse = JsonParse(lsGameSession)

      const lsPlayers: TPlayer[] = [...gameSession.players]
      setPlayerList(lsPlayers)

      socket.on('new-player', (data) => {
        console.log('new-player', data)

        const newPlayerList: TPlayer[] = [...lsPlayers, data.newPlayer]
        setPlayerList(newPlayerList)
        gameSession.players = newPlayerList
        setLsGameSession(JSON.stringify(gameSession))
      })

      socket.on('player-left', (data) => {
        console.log('player-left', data)

        let _players = [...playerList]
        _.remove(_players, (player) => player.id === data.id)
        setPlayerList(_players)
        gameSession.players = [..._players]
        setLsGameSession(JSON.stringify(gameSession))
      })

      socket.on('host-out', () => {
        localStorage.removeItem('game-session')
        localStorage.removeItem('game-session-player')
        router.push('/')
      })

      socket.on('game-started', (data) => {
        console.log('game started', data)
        router.push(`/game?questionId=0`)
      })

      socket.on('error', (data) => {
        console.log('socket error', data)
      })
    } catch (error) {
      console.log('useEffect - error', error)
    }
  }, [socket, lsGameSession])

  useEffect(() => {
    setUser(JsonParse(lsUser) as TUser)
  }, [])

  const handleLeaveRoom = () => {
    localStorage.removeItem('game-session')
    localStorage.removeItem('game-session-player')
    socket.close()
    router.back()
  }

  const handleStartGame = () => {
    try {
      const cookies = new Cookies()
      const accessToken = cookies.get('access-token')
      useLocalStorage

      if (user) {
        const msg: TStartGameRequest = {
          userId: user.id,
          invitationCode: invitationCode,
          token: accessToken,
        }
        socket.emit('start-game', msg)
      }
    } catch (error) {
      console.log('handleStartGame - error', error)
    }
  }

  const copyInvitationCode = () => {
    navigator.clipboard.writeText(`${window.location.host}/lobby/join?invitationCode=${invitationCode}`)
    setShowToast(true)
  }

  function renderHostName() {
    return <>
      <div className={styles.gameOfHost}>
        Game của{' '}
        <span className="text-primary text-decoration-underline">
          {gameSession.host?.name || gameSession.host?.username}
        </span>
      </div>
      <br/>
    </>;
  }

  return (
    <div
      className="bg-secondary fw-medium bg-opacity-10 min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>
        <link href="https://fonts.googleapis.com/css2?family=Boogaloo&display=swap" rel="stylesheet"/>
      </Head>

      {isMobile ? renderInvitationCode() : renderPcInvitationCode()}

      {/*Game của Thiện*/}
      {renderHostName()}

      {renderPlayerList()}
      {/*Thoát + Bắt đầu*/}
      {functionalButtons()}

      {/*Các view ẩn*/}
      {renderToast()}
      {renderQrModal()}
    </div>
  )

  /*QR code nếu trên màn bự*/
  function renderPcInvitationCode() {
    return <div className={styles.invitationCodeContainer}>
      <>
        {/*QR code*/}
        <div className={"d-flex flex-column align-items-center gap-3"}>
          <div className={styles.qrContainer}>
            <QRCode size={200} fgColor={"#009883"} bgColor={"#F0F1F2"} value="hey"
                    className={styles.qrModal}/>
          </div>
          <div>Quét mã để tham gia</div>
        </div>

        {/*Khoảng cách ở giữa*/}
        <span className={"position-relative text-secondary text-opacity-75 flex-grow-1 align-self-end"}>{" hoặc "}</span>

        {/*Mã phòng và copy link*/}
        <div className={"d-flex flex-column align-items-center gap-3"}>
          {/*Mã mời*/}
          <div className={"d-flex flex-column justify-content-center flex-grow-1"}>
            <span className={styles.code}>{invitationCode}</span>
          </div>
          {/*Copy*/}
          <div>Tham gia bằng
            <span className={styles.joinLink} onClick={copyInvitationCode}>{' link '}<i className={`bi bi-clipboard-plus-fill`}/></span>
          </div>
        </div>
      </>
    </div>;
  }

  function renderInvitationCode() {
    return <>
      <div className={"d-flex gap-3"}>
        <span className={styles.code}>
          {invitationCode}
        </span>
        <i className={`bi bi-qr-code-scan ${styles.copyIcon}`}
           onClick={() => {
             setShowQR(true)
           }}/>
      </div>
      <div className={"pt-12px"}>Copy
        <span className={styles.joinLink} onClick={copyInvitationCode}>{' link vào phòng '}
          <i className={`bi bi-clipboard-plus-fill`}/>
          </span>
      </div>
    </>
  }

  function renderToast() {
    return (<ToastContainer className="p-3" position='bottom-end'>
      <Toast bg={"success"} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Copy thành công</strong>
        </Toast.Header>
        <Toast.Body className={'text-white'}>Gửi link mời cho bạn bè để tham gia!</Toast.Body>
      </Toast>
    </ToastContainer>)
  }

  function renderQrModal() {
    return (
      <Modal
        show={showQR}
        onHide={() => {
          setShowQR(false)
        }}
        // size=""
        aria-labelledby="contained-modal-title-vcenter"
        centered
        // fullscreen="sm-down"
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title id="contained-modal-title-vcenter" className={styles.modalTitle}>
            Quét mã QR để vào phòng
          </Modal.Title>
        </Modal.Header>
        {/*<Modal.Body cl>*/}
        {/*<div className={styles.qrContainer}>*/}
        <QRCode size={200} fgColor={"#009883"} value="hey" className={styles.qrModal}/>
        {/*</div>*/}
        {/*</Modal.Body>*/}
      </Modal>
    );
  }

  function functionalButtons() {
    return <div className="p-12px mb-3">
      <MyButton
        variant="secondary"
        className="w-100 text-white fw-medium bg-secondary"
        onClick={handleLeaveRoom}
      >
        RỜI PHÒNG
      </MyButton>
      <br/>
      <br/>
      {isHost && (
        <MyButton
          className="w-100 text-white fw-medium"
          onClick={handleStartGame}
        >
          BẮT ĐẦU
        </MyButton>
      )}
    </div>;
  }

  function renderPlayerList() {
    return <>
      <div className={styles.playerCount}>{playerList.length} người tham gia!</div>
      <div className=" d-flex position-relative flex-wrap justify-content-center">
        <PlayerLobbyList players={playerList}/>
      </div>
    </>
  }
}

export default LobbyScreen
