/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import _ from 'lodash'
import Head from 'next/head'
import {useRouter} from 'next/router'
import React, {FC, useEffect, useState} from 'react'
import {Container, Image, Modal} from 'react-bootstrap'
import QRCode from 'react-qr-code'
import {useToasts} from 'react-toast-notifications'
import Cookies from 'universal-cookie'
import {useAuth} from '../../hooks/useAuth/useAuth'
import {useGameSession} from '../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../hooks/useScreenSize/useScreenSize'
import * as gtag from '../../libs/gtag'
import {TPlayer, TStartGameRequest} from '../../types/types'
import {GAME_MODE_MAPPING} from '../../utils/constants'
import MyButton from '../MyButton/MyButton'
import PlayerLobbyItem from '../PlayerLobbyItem/PlayerLobbyItem'
import PlayerLobbyList from '../PlayerLobbyList/PlayerLobbyList'
import BackgroundPicker from './BackgroundPicker/BackgroundPicker'
import styles from './LobbyScreen.module.css'
import MyModal from '../MyModal/MyModal'
import { useSound } from '../../hooks/useSound/useSound'
import { useUserSetting } from '../../hooks/useUserSetting/useUserSetting'

type LobbyScreenProps = {}

const LobbyScreen: FC<LobbyScreenProps> = () => {
  const game = useGameSession()
  const isHost = game.isHost
  const invitationCode = game.gameSession?.invitationCode ?? ''

  const [playerList, setPlayerList] = useState<TPlayer[]>([])
  const setting = useUserSetting()
  const router = useRouter()
  const [showQR, setShowQR] = useState<boolean>(false)
  const {isMobile} = useScreenSize()
  const [showBackgroundModal, setShowBackgroundModal] = useState<boolean>(false)

  const { addToast } = useToasts()
  const [currentBackground, setCurrentBackground] = useState<string>(
    setting.gameBackgroundUrl
  )
  const authContext = useAuth()
  const user = authContext.getUser()
  const sound = useSound()
  const [isMute, setIsMute] = useState(sound.isMute)
  const [showAlertOutRoom, setShowAlertOutRoom] = useState<boolean>(false)

  useEffect(() => {
    if (!game.gameSession) return
    setPlayerList(game.gameSession.players)

    game.gameSkOn('new-player', (data: { newPlayer: TPlayer }) => {
      let newPlayerList: TPlayer[] = [...game.players, data.newPlayer]
      setPlayerList(newPlayerList)
      game.players = newPlayerList
      addToast(`${data.newPlayer.nickname} ???? tham gia ph??ng`, {
        appearance: 'success',
        autoDismiss: true,
      })
    })

    game.gameSkOn('player-left', (data) => {
      let _players = [...playerList]
      _.remove(_players, (player) => player.id === data.id)
      setPlayerList(_players)
      game.players = [..._players]

      addToast(`${data?.player?.nickname} ???? r???i ph??ng`, {
        appearance: 'error',
        autoDismiss: true,
      })
    })

    game.gameSkOnce('host-out', () => {
      router.push('/home')
    })

    game.gameSkOnce('loading', (data) => {
      router.push(`/game/play?invitationCode=${invitationCode}`)
    })
  }, [])

  useEffect(() => {
    if (setting.gameBackgroundUrl && setting.gameBackgroundUrl.length) {
      setCurrentBackground(setting.gameBackgroundUrl)
    } else {
      setCurrentBackground('/assets/default-game-bg.svg')
      setting.gameBackgroundUrl = '/assets/default-game-bg.svg'
    }
  }, [])

  useEffect(() => {
    router.beforePopState(({as}) => {
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
        addToast(`C???n c?? ??t nh???t 1 ng?????i tham gia ????? c?? th??? b???t ?????u`, {
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
      setting.gameBackgroundUrl = currentBackground
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
        Copy th??nh c??ng
        <br/>
        G???i link m???i cho b???n b?? ????? tham gia!
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
            displayName={'Ch??? ph??ng: ' + hostName}
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
      <div
        className="bg-dark bg-opacity-50 fw-medium bg-opacity-10 min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
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
                      ????ng nh???p ngay ????? nh???n ph???n th?????ng v?? nhi???u t??nh n??ng kh??c
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
                  T??n quiz: {game.gameSession?.quiz?.title}
                </div>
                <div className="">
                  S??? c??u: {game.gameSession?.quiz?.questions?.length}
                </div>
                <div>
                  Ch??? ????? ch??i:{' '}
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
                  Chi ti???t quiz
                </MyButton>
              )}
            </div>

            {isMobile ? renderInvitationCode() : renderInvitationCodeDesktop()}

            {renderHostName()}

            {/* player list */}
            <div className="p-3 w-100 text-center">
              <div className={styles.playerCount}>
                {playerList?.length || 0} ng?????i tham gia!
              </div>
              <div
                className="d-flex flex-wrap align-items-center justify-content-center bg-white rounded-10px"
                style={{
                  minHeight: 100,
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }}
              >
                <PlayerLobbyList players={playerList}/>
              </div>
            </div>

            {/*Tho??t + B???t ?????u*/}
            {functionalButtons()}
          </div>
        </Container>

        {/*C??c view ???n*/}
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
            <div className=" h3">M?? m???i:</div>
          </div>
          <div className={styles.code}>{invitationCode}</div>
          <div>ho???c B???m</div>
          <MyButton
            className="bi bi-qr-code-scan fs-24px my-2 text-white"
            onClick={() => {
              setShowQR(true)
            }}
          />
          <div className="text-center text-wrap">
            ????? nh???n m?? QR v?? ???????ng d???n v??o ph??ng
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
            <div className="h5">Qu??t m?? QR ????? v??o ph??ng</div>
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
              <div className="h5">M?? m???i</div>
              <div className={styles.code}>{invitationCode}</div>
            </div>

            <div>
              <div className="h5">B???m ????? t???o ???????ng d???n v??o ph??ng</div>
              <div
                className="d-flex w-100 bg-primary bg-opacity-10 rounded-8px p-3 align-items-center gap-3 cursor-pointer"
                onClick={copyInvitationCode}
              >
                <div className="text-truncate w-100">
                  {`http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`}{' '}
                </div>
                <div className={`bi bi-clipboard-plus-fill fs-24px`}/>
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
        header={<Modal.Title>Tham gia ph??ng</Modal.Title>}
      >
        <div className="d-flex justify-content-center flex-column align-items-center gap-3">
          <div className="h5">Qu??t m?? QR ????? v??o ph??ng</div>
          <QRCode
            size={200}
            fgColor={'#009883'}
            value={`http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`}
            className={styles.qrModal}
          />
          <div className="h5 text-secondary pt-3">ho???c</div>
          <div className="h5">B???m ????? t???o ???????ng d???n v??o ph??ng</div>
          <div
            className="d-flex w-100 bg-primary bg-opacity-10 rounded-8px p-3 align-items-center gap-3 cursor-pointer"
            onClick={copyInvitationCode}
          >
            <div className="text-truncate w-100">
              {`http://${window.location.host}/lobby/join?invitationCode=${invitationCode}`}{' '}
            </div>
            <div className={`bi bi-clipboard-plus-fill fs-24px`}/>
          </div>
        </div>
      </MyModal>
    )
  }

  function functionalButtons() {
    const cn = classNames(
      'text-white fw-medium d-flex align-items-center gap-2 w-100',
      {'justify-content-center': isMobile}
    )
    return (
      <div className="d-flex gap-3 px-3 pb-3 flex-wrap w-100">
        <div className="flex-fill">
          <MyButton
            variant="danger"
            className={cn}
            onClick={() => setShowAlertOutRoom(true)}
          >
            <i className="bi bi-box-arrow-left fs-24px" />
            {!isMobile && 'R???I PH??NG'}
          </MyButton>
        </div>

        <div className="flex-fill">
          <MyButton className={cn} onClick={() => setShowBackgroundModal(true)}>
            <i className="bi bi-image fs-24px"/>
            {!isMobile && 'CH???N H??NH N???N'}
          </MyButton>
        </div>

        {isHost && (
          <div className="flex-fill">
            <MyButton className={cn} onClick={handleStartGame}>
              <i className="bi bi-play-fill fs-24px"/>
              B???T ?????U
            </MyButton>
          </div>
        )}

        <MyModal
          show={showAlertOutRoom}
          onHide={() => {
            setShowAlertOutRoom(false)
          }}
          header={<Modal.Title>B???n ??ang r???i kh???i ph??ng ch???</Modal.Title>}
          inActiveButtonTitle="R???i kh???i"
          activeButtonTitle="??? l???i"
          inActiveButtonCallback={handleLeaveRoom}
          activeButtonCallback={() => setShowAlertOutRoom(false)}
        >
          <div className="d-flex justify-content-center flex-column align-items-center gap-3">
            <div className="h5">B???n c?? ch???c ch???n mu???n r???i kh???i ph??ng</div>
          </div>
        </MyModal>
      </div>
    )
  }
}

export default LobbyScreen
