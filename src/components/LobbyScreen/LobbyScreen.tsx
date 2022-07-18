/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import _ from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { Container, Image, Modal } from 'react-bootstrap'
import QRCode from 'react-qr-code'
import { useToasts } from 'react-toast-notifications'
import Cookies from 'universal-cookie'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { useGameSession } from '../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import useScreenSize from '../../hooks/useScreenSize/useScreenSize'
import * as gtag from '../../libs/gtag'
import { TPlayer, TStartGameRequest } from '../../types/types'
import { GAME_MODE_MAPPING } from '../../utils/constants'
import MyButton from '../MyButton/MyButton'
import PlayerLobbyItem from '../PlayerLobbyItem/PlayerLobbyItem'
import PlayerLobbyList from '../PlayerLobbyList/PlayerLobbyList'
import BackgroundPicker from './BackgroundPicker/BackgroundPicker'
import styles from './LobbyScreen.module.css'
import MyModal from '../MyModal/MyModal'
import { useSound } from '../../hooks/useSound/useSound'

type LobbyScreenProps = {}

const LobbyScreen: FC<LobbyScreenProps> = () => {
  const game = useGameSession()
  const isHost = game.isHost
  const invitationCode = game.gameSession?.invitationCode ?? ''

  const [playerList, setPlayerList] = useState<TPlayer[]>([])
  const [lsBg, saveLsBg] = useLocalStorage('bg', '')
  const router = useRouter()
  const [showQR, setShowQR] = useState<boolean>(false)
  const { isMobile } = useScreenSize()
  const [showBackgroundModal, setShowBackgroundModal] = useState<boolean>(false)

  const { addToast } = useToasts()
  const [currentBackground, setCurrentBackground] = useState<string>(lsBg)
  const authContext = useAuth()
  const user = authContext.getUser()
  const sound = useSound()
  const [isMute, setIsMute] = useState(sound.isMute)

  useEffect(() => {
    if (!game.gameSession) return
    setPlayerList(game.gameSession.players)

    game.gameSkOn('new-player', (data: { newPlayer: TPlayer }) => {
      let newPlayerList: TPlayer[] = [...game.players, data.newPlayer]
      setPlayerList(newPlayerList)
      game.players = newPlayerList
      addToast(`${data.newPlayer.nickname} đã tham gia phòng`, {
        appearance: 'success',
        autoDismiss: true,
      })
    })

    game.gameSkOn('player-left', (data) => {
      let _players = [...playerList]
      _.remove(_players, (player) => player.id === data.id)
      setPlayerList(_players)
      game.players = [..._players]

      addToast(`${data?.player?.nickname} đã rời phòng`, {
        appearance: 'error',
        autoDismiss: true,
      })
    })

    game.gameSkOnce('host-out', () => {
      router.push('/home')
    })

    game.gameSkOnce('loading', (data) => {
      router.push(`/game/play`)
    })
  }, [])

  useEffect(() => {
    if (lsBg && lsBg.length) {
      setCurrentBackground(lsBg)
    } else {
      setCurrentBackground('/assets/default-game-bg.svg')
      saveLsBg('/assets/default-game-bg.svg')
    }
  }, [])

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        // Will run when leaving the current page; on back/forward actions
        // Add your logic here, like toggling the modal state
      }
      return true
    })

    return () => {
      router.beforePopState(() => true)
    }
  }, [router])

  const handleLeaveRoom = () => {
    game.clearGameSession()
    router.back()
  }

  const handleStartGame = () => {
    try {
      if (!game.gameSession?.players.length) {
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
        game.gameSkEmit('start-game', msg)
        gtag.event({
          action: '[start game]',
          params: {
            quizId: game.gameSession?.quizId,
            invitationCode: game.gameSession?.invitationCode,
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
    if (!game.gameSession) return
    let hostName = game.gameSession.host.name
    if (hostName.length == 0) hostName = game.gameSession.host.username
    return (
      <>
        <div className={styles.gameOfHost}>
          <PlayerLobbyItem
            avatar={game.gameSession?.host?.avatar}
            isHost={true}
            displayName={'Chủ phòng: ' + hostName}
            bgColor={'#009883'}
            kickable={false}
          />
        </div>
      </>
    )
  }

  return (
    <div
      style={{
        backgroundImage: `url(${currentBackground}`,
        backgroundSize: 'auto auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }}
      className="bg-dark"
    >
      <div className="bg-dark bg-opacity-50 fw-medium bg-opacity-10 min-vh-100 d-flex flex-column justify-content-center align-items-center">
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

        <Container fluid="md" className="p-3 px-md-5">
          <div className="bg-dark d-flex flex-column justify-content-center align-items-center rounded-10px">
            <div className="d-flex w-100 align-items-center gap-3 p-3">
              <Image
                src={
                  authContext.isAuth && user?.avatar
                    ? user?.avatar
                    : '/assets/default-avatar.png'
                }
                width="60"
                height="60"
                roundedCircle
                alt="avatar"
              />
              <div className="text-white h3 text-truncate">
                <div>
                  {isHost
                    ? user?.name
                    : `${game.gameSession?.nickName} ${
                        authContext.isAuth ? `(${user?.name})` : ''
                      }`}
                </div>
                <div className="fs-14px text-primary text-wrap">
                  {!authContext.isAuth && (
                    <span
                      onClick={() => authContext.setSignInModalHandler(true)}
                    >
                      Đăng nhập ngay để nhận phần thưởng và nhiều tính năng khác
                    </span>
                  )}
                </div>
              </div>
              <div className={`flex-grow-1 d-flex justify-content-end`}>
                <i
                  className={`text-end bg-white rounded-10px px-2 bi ${
                    !isMute ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'
                  }  text-secondary fs-1 cursor-pointer`}
                  onClick={() => {
                    sound.turnSound(!sound.isMute)
                    setIsMute(sound.isMute)
                  }}
                ></i>
              </div>
            </div>

            <div className="text-white d-flex w-100 align-items-center gap-3 bg-black bg-opacity-50 p-3">
              <div className="w-100">
                <div className="text-truncate">
                  Tên quiz: {game.gameSession?.quiz?.title}
                </div>
                <div className="">
                  Số câu: {game.gameSession?.quiz?.questions?.length}
                </div>
                <div>
                  Chế độ chơi:{' '}
                  {GAME_MODE_MAPPING[game.gameSession?.mode || '10CLASSIC']}
                </div>
              </div>
              {isHost && (
                <MyButton
                  size="sm"
                  className="text-white text-nowrap"
                  onClick={() => {
                    window.open(
                      `http://${window.location.host}/quiz/creator/${game.gameSession?.quizId}`,
                      'Quiwi',
                      'left=100,top=100,width=620,height=820'
                    )
                  }}
                >
                  Chi tiết quiz
                </MyButton>
              )}
            </div>

            {isMobile ? renderInvitationCode() : renderInvitationCodeDesktop()}

            {renderHostName()}

            {/* player list */}
            <div className="p-3 w-100 text-center">
              <div className={styles.playerCount}>
                {playerList?.length || 0} người tham gia!
              </div>
              <div
                className="d-flex flex-wrap align-items-center justify-content-center bg-white rounded-10px"
                style={{
                  minHeight: 100,
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }}
              >
                <PlayerLobbyList players={playerList} />
              </div>
            </div>

            {/*Thoát + Bắt đầu*/}
            {functionalButtons()}
          </div>
        </Container>

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

  function renderInvitationCode() {
    return (
      <>
        <div className="text-white p-3 w-100 d-flex justify-content-center align-items-center flex-column">
          <div>
            <div className=" h3">Mã mời:</div>
          </div>
          <div className={styles.code}>{invitationCode}</div>
          <div>hoặc Bấm </div>
          <MyButton
            className="bi bi-qr-code-scan fs-24px my-2 text-white"
            onClick={() => {
              setShowQR(true)
            }}
          />
          <div className="text-center text-wrap">
            để nhận mã QR và đường dẫn vào phòng
          </div>
        </div>
      </>
    )
  }

  function renderInvitationCodeDesktop() {
    return (
      <>
        <div className="text-white p-3 d-flex justify-content-center gap-4 w-100 flex-wrap">
          <div className="d-flex flex-column h-100">
            <div className="h5">Quét mã QR để vào phòng</div>
            <div className="bg-white p-2 text-center rounded-6px">
              <QRCode
                size={200}
                fgColor={'#009883'}
                value={`http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`}
                className={styles.qrModal}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-3 text-center">
            <div>
              <div className="h5">Mã mời</div>
              <div className={styles.code}>{invitationCode}</div>
            </div>

            <div>
              <div className="h5">Bấm để tạo đường dẫn vào phòng</div>
              <div
                className="d-flex w-100 bg-primary bg-opacity-10 rounded-8px p-3 align-items-center gap-3 cursor-pointer"
                onClick={copyInvitationCode}
              >
                <div className="text-truncate w-100">
                  {`http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`}{' '}
                </div>
                <div className={`bi bi-clipboard-plus-fill fs-24px`} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  function renderQrModal() {
    return (
      <MyModal
        show={showQR}
        onHide={() => {
          setShowQR(false)
        }}
        header={<Modal.Title>Tham gia phòng</Modal.Title>}
      >
        <div className="d-flex justify-content-center flex-column align-items-center gap-3">
          <div className="h5">Quét mã QR để vào phòng</div>
          <QRCode
            size={200}
            fgColor={'#009883'}
            value={`http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`}
            className={styles.qrModal}
          />
          <div className="h5 text-secondary pt-3">hoặc</div>
          <div className="h5">Bấm để tạo đường dẫn vào phòng</div>
          <div
            className="d-flex w-100 bg-primary bg-opacity-10 rounded-8px p-3 align-items-center gap-3 cursor-pointer"
            onClick={copyInvitationCode}
          >
            <div className="text-truncate w-100">
              {`http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`}{' '}
            </div>
            <div className={`bi bi-clipboard-plus-fill fs-24px`} />
          </div>
        </div>
      </MyModal>
    )
  }

  function functionalButtons() {
    const cn = classNames(
      'text-white fw-medium d-flex align-items-center gap-2 w-100',
      { 'justify-content-center': isMobile }
    )
    return (
      <div className="d-flex gap-3 px-3 pb-3 flex-wrap w-100">
        <div className="flex-fill">
          <MyButton variant="danger" className={cn} onClick={handleLeaveRoom}>
            <i className="bi bi-box-arrow-left fs-24px" />
            {!isMobile && 'RỜI PHÒNG'}
          </MyButton>
        </div>

        <div className="flex-fill">
          <MyButton className={cn} onClick={() => setShowBackgroundModal(true)}>
            <i className="bi bi-image fs-24px" />
            {!isMobile && 'CHỌN HÌNH NỀN'}
          </MyButton>
        </div>

        {isHost && (
          <div className="flex-fill">
            <MyButton className={cn} onClick={handleStartGame}>
              <i className="bi bi-play-fill fs-24px" />
              BẮT ĐẦU
            </MyButton>
          </div>
        )}
      </div>
    )
  }
}

export default LobbyScreen
