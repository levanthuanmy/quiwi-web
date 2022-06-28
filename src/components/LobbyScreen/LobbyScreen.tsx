/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import QRCode from 'react-qr-code'
import { useToasts } from 'react-toast-notifications'
import Cookies from 'universal-cookie'
import { useGameSession } from '../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import useScreenSize from '../../hooks/useScreenSize/useScreenSize'
import * as gtag from '../../libs/gtag'
import { TPlayer, TStartGameRequest, TUser } from '../../types/types'
import { JsonParse } from '../../utils/helper'
import MyButton from '../MyButton/MyButton'
import MyModal from '../MyModal/MyModal'
import PlayerLobbyItem from '../PlayerLobbyItem/PlayerLobbyItem'
import PlayerLobbyList from '../PlayerLobbyList/PlayerLobbyList'
import BackgroundPicker from './BackgroundPicker/BackgroundPicker'
import styles from './LobbyScreen.module.css'
import { playSound, playSoundWithLoop } from '../../utils/helper';
import { SOUND_EFFECT } from '../../utils/constants';
import { Howl } from 'howler'

type LobbyScreenProps = {
  invitationCode: string
  isHost: boolean
}
const LobbyScreen: FC<LobbyScreenProps> = ({ invitationCode, isHost }) => {
  const [playerList, setPlayerList] = useState<TPlayer[]>([])
  const [lsUser] = useLocalStorage('user', '')
  const [lsBg, saveLsBg] = useLocalStorage('bg', '')
  const [user, setUser] = useState<TUser>()
  const router = useRouter()
  const [showQR, setShowQR] = useState<boolean>(false)
  const { isMobile } = useScreenSize()
  const [showBackgroundModal, setShowBackgroundModal] = useState<boolean>(false)
  const {
    gameSession,
    saveGameSession,
    clearGameSession,
    gameSocket,
    gameSkOn,
    gameSkEmit,
    gameSkOnce,
  } = useGameSession()
  const { addToast } = useToasts()
  const [currentBackground, setCurrentBackground] = useState<string>(lsBg)
  const [sound, setSound] = useState<Howl>(
    new Howl({
      src: SOUND_EFFECT['GAME_WATING'],
      html5: true,
      loop: true
    })
  );

  useEffect(() => {
    if (!gameSession) return
    const lsPlayers: TPlayer[] = [...gameSession.players]
    setPlayerList(lsPlayers)

    gameSkOn('new-player', (data: { newPlayer: TPlayer }) => {
      let newPlayerList: TPlayer[] = [...lsPlayers, data.newPlayer]
      // for (let i =0; i < 100; i++) {
      //   newPlayerList = [...newPlayerList, data.newPlayer]
      // }
      setPlayerList(newPlayerList)
      gameSession.players = newPlayerList
      saveGameSession(gameSession)
      addToast(`${data.newPlayer.nickname} đã tham gia phòng`, {
        appearance: 'success',
        autoDismiss: true,
      })
    })

    gameSkOn('player-left', (data) => {
      let _players = [...playerList]
      _.remove(_players, (player) => player.id === data.id)
      setPlayerList(_players)
      gameSession.players = [..._players]
      saveGameSession(gameSession)
      addToast(`${data?.player?.nickname} đã rời phòng`, {
        appearance: 'error',
        autoDismiss: true,
      })
    })

    gameSkOnce('host-out', () => {
      sound.stop();
      router.push('/')
    })

    gameSkOnce('loading', (data) => {
      // console.log('game started', data)
      sound.stop();
      router.push(`/game/play`)
    })

    gameSkOn('error', (data) => {
      sound.stop();
      console.log('LobbyScreen.tsx - error', data)
    })
  }, [gameSession])

  useEffect(() => {
    sound.play();
    if (lsUser) setUser(JsonParse(lsUser) as TUser)
    if(lsBg && lsBg.length) {
      setCurrentBackground(lsBg)
    }
    else {
      setCurrentBackground('/assets/default-game-bg.svg')
      saveLsBg('/assets/default-game-bg.svg')
    }
  }, [])

  useEffect(() => {
    router.beforePopState(({ as }) => {
        if (as !== router.asPath) {
            // Will run when leaving the current page; on back/forward actions
            // Add your logic here, like toggling the modal state
            sound.stop();
        }
        return true;
    });

    return () => {
        router.beforePopState(() => true);
    };
}, [router]);

  const handleLeaveRoom = () => {
    clearGameSession()
    router.back()
  }

  const handleStartGame = () => {
    try {
      if (!gameSession?.players?.length) {
        addToast(`Cần có ít nhất 1 người tham gia để có thể bắt đầu`, {
          appearance: 'error',
          autoDismiss: true,
        })
        return
      }
      const cookies = new Cookies()
      const accessToken = cookies.get('access-token')

      if (user) {
        const msg: TStartGameRequest = {
          userId: user.id,
          invitationCode: invitationCode,
          token: accessToken,
        }
        gameSkEmit('start-game', msg)
        gtag.event({
          action: '[start game]',
          params: {
            quizId: gameSession?.quizId,
            invitationCode: gameSession?.invitationCode,
          },
        })
      }
      saveLsBg(currentBackground)
    } catch (error) {
      console.log('handleStartGame - error', error)
    }
  }

  const copyInvitationCode = () => {
    navigator?.clipboard?.writeText(
      `http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`
    )
    console.log(
      'copyInvitationCode - ',
      `${window.location.host}/lobby/join?invitationCode=${invitationCode}`
    )
    addToast(
      <>
        Copy thành công
        <br />
        Gửi link mời cho bạn bè để tham gia!
      </>,
      {
        autoDismiss: true,
        appearance: 'success',
      }
    )
  }

  function renderHostName() {
    if (!gameSession) return
    let hostName = gameSession.host.name
    if (hostName.length == 0) hostName = gameSession.host.username
    return (
      <>
        <div className={styles.gameOfHost}>
          <PlayerLobbyItem
            isHost={true}
            displayName={'Chủ phòng: ' + hostName}
            bgColor={'#009883'}
          />
        </div>
      </>
    )
  }

  return (
    <div
      style={{
        backgroundImage: `url(${currentBackground}`,
        // backgroundSize: 'auto 100vh',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }}
      className="bg-dark"
    >
      <div
        className="bg-dark bg-opacity-50 fw-medium bg-opacity-10 min-vh-100 d-flex flex-column justify-content-center align-items-center"
        // style={{ backdropFilter: 'blur(3px)' }}
      >
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin={'true'}
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Boogaloo&display=swap"
            rel="stylesheet"
          />
        </Head>

        {isMobile ? renderInvitationCode() : renderPcInvitationCode()}

        {renderHostName()}

        {renderPlayerList()}
        {/*Thoát + Bắt đầu*/}
        {functionalButtons()}

        {/*Các view ẩn*/}
        {renderQrModal()}

        <BackgroundPicker
          show={showBackgroundModal}
          onHide={() => setShowBackgroundModal(false)}
          setCurrentBackground={setCurrentBackground}
        />
      </div>
    </div>
  )

  /*QR code nếu trên màn bự*/
  function renderPcInvitationCode() {
    return (
      <div className={styles.invitationCodeContainer}>
        <>
          {/*QR code*/}
          <div className={'d-flex flex-column align-items-center gap-3'}>
            <div className={styles.qrContainer}>
              <QRCode
                size={200}
                fgColor={'#009883'}
                bgColor={'#F0F1F2'}
                value={`http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`}
                className={styles.qrModal}
              />
            </div>
            <div>Quét mã để tham gia</div>
          </div>

          {/*Khoảng cách ở giữa*/}
          <span
            className={
              'position-relative text-secondary text-opacity-75 flex-grow-1 align-self-end'
            }
          >
            {' hoặc '}
          </span>

          {/*Mã phòng và copy link*/}
          <div className={'d-flex flex-column align-items-center gap-3'}>
            {/*Mã mời*/}
            <div
              className={
                'd-flex flex-column justify-content-center flex-grow-1'
              }
            >
              <span className={styles.code}>{invitationCode}</span>
            </div>
            {/*Copy*/}
            <div>
              Tham gia bằng
              <span className={styles.joinLink} onClick={copyInvitationCode}>
                {' link '}
                <i className={`bi bi-clipboard-plus-fill`} />
              </span>
            </div>
          </div>
        </>
      </div>
    )
  }

  function renderInvitationCode() {
    return (
      <>
        <div className={'d-flex gap-3'}>
          <span className={styles.code}>{invitationCode}</span>
          <i
            className={`bi bi-qr-code-scan ${styles.copyIcon}`}
            onClick={() => {
              setShowQR(true)
            }}
          />
        </div>
        <div className={'pt-12px'}>
          Copy
          <span className={styles.joinLink} onClick={copyInvitationCode}>
            {' link vào phòng '}
            <i className={`bi bi-clipboard-plus-fill`} />
          </span>
        </div>
      </>
    )
  }

  function renderQrModal() {
    return (
      <Modal
        show={showQR}
        onHide={() => {
          setShowQR(false)
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className={styles.modalTitle}
          >
            Quét mã QR để vào phòng
          </Modal.Title>
        </Modal.Header>
        <QRCode
          size={200}
          fgColor={'#009883'}
          value="hey"
          className={styles.qrModal}
        />
      </Modal>
    )
  }

  function functionalButtons() {
    return (
      <div className="d-flex gap-3 p-12px flex-wrap">
        <MyButton
          variant="danger"
          className="fw-medium d-flex align-items-center gap-2"
          onClick={handleLeaveRoom}
        >
          <i className="bi bi-door-open fs-24px" />
          RỜI PHÒNG
        </MyButton>
        <MyButton
          className="text-white fw-medium d-flex align-items-center gap-2"
          onClick={() => setShowBackgroundModal(true)}
        >
          <i className="bi bi-image fs-24px" />
          CHỌN ẢNH NỀN
        </MyButton>
        {isHost && (
          <MyButton
            className="text-white fw-medium d-flex align-items-center gap-2"
            onClick={handleStartGame}
          >
            <i className="bi bi-play-fill fs-24px" />
            BẮT ĐẦU
          </MyButton>
        )}
      </div>
    )
  }

  function renderPlayerList() {
    return (
      <>
        <div className={styles.playerCount}>
          {playerList.length} người tham gia!
        </div>
        <div className={`d-flex flex-wrap ${styles.playerList}`}>
          <PlayerLobbyList players={playerList} />
        </div>
      </>
    )
  }
}

export default LobbyScreen
