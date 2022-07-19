import classNames from 'classnames'
import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react'
import {Image} from 'react-bootstrap'
import {TGameModeEnum} from '../../types/types'
import styles from './GameModeScreen.module.css'
import Slider from "react-slick";
import useScreenSize from "../../hooks/useScreenSize/useScreenSize";
import {useUserSetting} from "../../hooks/useUserSetting/useUserSetting";
import cn from "classnames";

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
  const {isMobile} = useScreenSize();
  const [bg, setBg] = useState<string>("");
  const setting = useUserSetting();
  const modes: TGameModeOption[] = [
    {
      mode: '10CLASSIC',
      name: 'Tốc độ',
      useFor: 'Dùng cho lớp học',
      description: 'Cùng chơi và cạnh tranh với người chơi khác',
      banner: "/assets/trophy.svg"
    },
    // {
    //   mode: '30EXAM',
    //   name: 'Kiểm tra',
    //   useFor: 'Dùng cho kiểm tra',
    //   description: 'Kiểm tra lại kiến thức của bản thân',
    //   banner: "/assets/grade-sheet.svg"
    // },
  ]

  useEffect(() => {
    setBg(setting.gameBackgroundUrl)

  }, [])

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
  };

  const renderModes = modes.map((mode, idx) => (
    <div key={idx} className={styles.modeItemContainer}>
      <div
        onClick={() => {
          selectGameMode(idx)
        }}
        className={classNames(styles.modeItem, `fw-bold shadow-sm text-center`)}
      >
        {/*quiz thường dùng để làm gì*/}
        <div className={styles.modeHeader}>
          {mode.useFor}
        </div>

        {/*ảnh minh hoạ*/}
        <div className={styles.modeBanner}>
          <Image
            src={mode.banner}
            width={80}
            height={160}
            alt=""
          />
        </div>

        {/*tên*/}
        <div className={styles.modeName}>
          {mode.name}
        </div>

        {/*mô tả*/}
        <div className={styles.modeDescription}>
          *{mode.description}
        </div>

      </div>
    </div>
  ))

  return <div
    className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-dark"
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'auto auto',
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
    }}
  >
    <div className={"d-flex flex-column justify-content-center align-items-center bg-dark rounded-10px pb-3"}>
      {/*<div className={"d-flex flex-column justify-content-center align-items-center"}>*/}
        <div className={cn(styles.modeTitle,"bg-dark text-white m-4", "fs-1")}>Chọn chế độ chơi</div>
      {/*</div>*/}

      {isMobile &&
          <Slider {...settings} className={cn(styles.slider, "")}>
            {renderModes}
          </Slider>
      }
      {!isMobile &&
          <div className={styles.web}>
            {renderModes}
          </div>
      }
    </div>
  </div>
}

export default GameModeScreen
