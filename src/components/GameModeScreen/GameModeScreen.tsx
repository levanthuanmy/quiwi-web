import classNames from 'classnames'
import React, {Dispatch, FC, SetStateAction} from 'react'
import {Image} from 'react-bootstrap'
import {TGameModeEnum} from '../../types/types'
import styles from './GameModeScreen.module.css'
import Slider from "react-slick";
import useScreenSize from "../../hooks/useScreenSize/useScreenSize";

type GameModeScreenProps = {
  //   title: string
  setGameMode: Dispatch<SetStateAction<TGameModeEnum | undefined>>
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
  const modes: TGameModeOption[] = [
    {
      mode: '10CLASSIC',
      name: 'Tốc độ',
      useFor: 'Dùng cho lớp học',
      description: 'Cùng chơi và cạnh tranh với người chơi khác',
      banner: "/assets/trophy.svg"
    },
    {
      mode: '20MRT',
      name: 'Marathon',
      useFor: 'Dùng cho kiểm tra',
      description: 'Người hoàn tất nhanh nhất sẽ chiến thắng',
      banner: "/assets/grade-sheet.svg"
    },
  ]

  const selectGameMode = (idx: number) => {
    const mode = modes[idx]
    // if (mode.mode != '10CLASSIC') return;
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
    className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-secondary bg-opacity-25">
    <div className={styles.modeTitle}>Chọn chế độ chơi</div>
    {isMobile &&
        <Slider {...settings} className={styles.slider}>
          {renderModes}
        </Slider>
    }
    {!isMobile &&
        <div className={styles.web}>
          {renderModes}
        </div>
    }
  </div>
}

export default GameModeScreen
