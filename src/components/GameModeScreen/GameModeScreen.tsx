import classNames from 'classnames'
import cn from 'classnames'
import React, {FC, useEffect, useState} from 'react'
import {Image} from 'react-bootstrap'
import {TApiResponse, TGameModeEnum, TQuiz} from '../../types/types'
import styles from './GameModeScreen.module.css'
import Slider from 'react-slick'
import useScreenSize from '../../hooks/useScreenSize/useScreenSize'
import {useUserSetting} from '../../hooks/useUserSetting/useUserSetting'
import MyButton from '../MyButton/MyButton'
import BackgroundPicker from '../LobbyScreen/BackgroundPicker/BackgroundPicker'
import {useGameSession} from '../../hooks/useGameSession/useGameSession'
import {useRouter} from 'next/router'
import useSWR from 'swr'
import {get} from '../../libs/api'
import {useToasts} from 'react-toast-notifications'

type GameModeScreenProps = {
  setGameMode: (mode: TGameModeEnum) => void
}

type TGameModeOption = {
  mode: TGameModeEnum
  name: string
  useFor: string
  description: string
  banner: string
}

const GameModeScreen: FC<GameModeScreenProps> = ({setGameMode}) => {
  const game = useGameSession()
  const router = useRouter()
  const query = router.query
  const {id} = query
  const {quizId} = query
  const {isMobile, fromMedium} = useScreenSize();
  const setting = useUserSetting();
  const [bg, setBg] = useState<string>("");
  const [showBackgroundModal, setShowBackgroundModal] = useState<boolean>(false)
  const {addToast} = useToasts()

  useEffect(() => {
    if (setting.gameBackgroundUrl && setting.gameBackgroundUrl.length) {
      setBg(setting.gameBackgroundUrl)
    } else {
      setBg('/assets/default-game-bg.svg')
      setting.gameBackgroundUrl = '/assets/default-game-bg.svg'
    }
  }, [])

  const {data, isValidating, error} = useSWR<TApiResponse<TQuiz>>(
    id || quizId
      ? [
        `/api/quizzes/${quizId ? 'my-quizzes' : 'quiz'}/${quizId ?? id}`,
        quizId ? true : false,
      ]
      : null,
    get,
    {
      revalidateOnFocus: false,
    }
  )

  const modes: TGameModeOption[] = [
    {
      mode: '10CLASSIC',
      name: 'Tốc độ',
      useFor: 'Dùng cho lớp học',
      description: 'Cùng chơi và cạnh tranh với người chơi khác',
      banner: '/assets/trophy.svg',
    },
    {
      mode: '30EXAM',
      name: 'Kiểm tra',
      useFor: 'Dùng cho kiểm tra',
      description: 'Kiểm tra lại kiến thức của bản thân',
      banner: '/assets/grade-sheet.svg',
    },
  ]

  useEffect(() => {
    setBg(setting.gameBackgroundUrl)
  }, [])

  useEffect(() => {
    if (bg.length) setting.gameBackgroundUrl = bg
  }, [bg])

  const selectGameMode = (idx: number) => {
    const mode = modes[idx]
    setGameMode(mode.mode)
  }

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '100px',
    arrows: true,
  }

  const renderModes = modes.map((mode, idx) => (
    <div key={idx} className={cn(styles.modeItemContainer, 'p-3')}>
      <div
        onClick={() => {
          selectGameMode(idx)
        }}
        className={classNames(styles.modeItem, `fw-bold shadow-sm text-center`)}
      >
        {/*quiz thường dùng để làm gì*/}
        <div className={styles.modeHeader}>{mode.useFor}</div>

        {/*ảnh minh hoạ*/}
        <div className={styles.modeBanner}>
          <Image
            src={mode.banner}
            width={80}
            height={isMobile ? 120 : 160}
            alt=""
          />
        </div>

        {/*tên*/}
        <div className={styles.modeName}>{mode.name}</div>

        {/*mô tả*/}
        <div className={styles.modeDescription}>*{mode.description}</div>
      </div>
    </div>
  ))

  const handleLeaveRoom = () => {
    game.clearGameSession()
    if (quizId) router.push(`/quiz/creator/${quizId}`)
    else router.push(`/quiz/${id}`)
  }

  const cln = classNames(
    'text-white fw-medium d-flex align-items-center gap-2 w-100',
    {'justify-content-center': isMobile}
  )

  const copyInvitationCode = () => {
    navigator?.clipboard?.writeText(
      `http://${window.location.host}/quiz/${id}/play`
    )

    addToast(
      <>
        Copy thành công
        <br/>
        Gửi link mời cho bạn bè để tham gia!
      </>,
      {
        autoDismiss: true,
        appearance: 'success',
      }
    )
  }

  function renderInvitationCodeDesktop() {
    return (
      <>
        {/*<div className="text-white p-3 d-flex justify-content-center gap-4 w-100 flex-wrap">*/}
        {/*  <div className="d-flex flex-column gap-3 text-center align-items-center justify-content-center">*/}
        {fromMedium ?
          <>
            <div className={cn("fw-light  fst-italic opacity-50", {"mt-3 fs-4": fromMedium, "fs-5": isMobile})}>
              Chia sẻ Quiz này với bạn bè qua đường dẫn:
            </div>
            <div
              className="d-flex mt-2 w-100 bg-primary opacity-75 bg-opacity-10 rounded-8px p-3 align-items-center gap-3 cursor-pointer"
              onClick={copyInvitationCode}
            >
              <div className="text-truncate w-100">
                {`http://${window.location.host}/quiz/${id}/play`}{' '}
              </div>
              <div className={`bi bi-clipboard-plus-fill fs-24px`}/>
            </div>
          </>
          :
          <>
            <>
              <div
                className={cn("d-flex justify-content-center align-items-center fs-5 mt-1 bg-primary opacity-75 bg-opacity-10 rounded-8px p-2 gap-3 cursor-pointer")}
                onClick={copyInvitationCode}
              >
                Copy đường dẫn làm quiz
                <div className={`bi bi-clipboard-plus-fill fs-5`}/>
              </div>
            </>
          </>
        }
        {/*  </div>*/}
        {/*</div>*/}
      </>
    )
  }

  return <div
    className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-dark"
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'auto auto',
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
    }}
  >
    <div className={"d-flex flex-column justify-content-center align-items-center bg-dark rounded-10px pb-3 m-3"}>
      <div
        className={cn(styles.modeTitle, `text-center bg-dark text-white ms-3 me-3 ${isMobile ? "mt-1 mb-1 fs-3 " : " mt-3 mb-3 fs-1 "}`)}>
        {quizId ? "Tạo phòng chờ" : "Chọn chế độ cho phòng tự luyện tập"}
      </div>

      <div
        className={cn(`text-white d-flex w-100 align-items-center gap-3 bg-black bg-opacity-50 fs-4 ${isMobile ? "mb-1 p-2" : "mb-3  p-4"}`)}>
        <div className={`w-100 ${isMobile ? "fs-5" : "fs-3"}`}>
          <div className="text-truncate">
            Tên quiz: {data?.response?.title}
          </div>
          <div className="">
            Số câu: {data?.response?.questions?.length}
          </div>
        </div>
      </div>
        {isMobile && (
          <Slider {...settings} className={cn(styles.slider, '')}>
            {renderModes}
          </Slider>
        )}
        {!isMobile && (
          <div className={cn(styles.web, 'd-flex p-1 mx-64px gap-5')}>
            {renderModes}
          </div>
        )}
        <div className="d-flex gap-4 px-4 flex-wrap w-100 mt-4 mb-2">
          <div className="flex-fill">
            <MyButton
              variant="danger"
              className={cln}
              onClick={handleLeaveRoom}
            >
              <i className="bi bi-box-arrow-left fs-24px"/>
              {!isMobile && 'TRỞ VỀ BỘ ĐỀ'}
            </MyButton>
          </div>

          <div className="flex-fill">
            <MyButton
              className={cln}
              onClick={() => setShowBackgroundModal(true)}
            >
              <i className="bi bi-image fs-24px"/>
              {!isMobile && 'CHỌN HÌNH NỀN'}
            </MyButton>
          </div>
        </div>
      </div>

      <BackgroundPicker
        show={showBackgroundModal}
        onHide={() => setShowBackgroundModal(false)}
        setCurrentBackground={setBg}
      />
    </div>
}

export default GameModeScreen
