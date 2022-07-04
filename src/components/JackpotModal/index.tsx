import React, { FC } from 'react'
import Jackpot from '../Jackpot'
import MyModal from '../MyModal/MyModal'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import styles from './JackpotModal.module.css'
import { Image } from 'react-bootstrap'
import { SOUND_EFFECT } from '../../utils/constants'
import { useSound } from '../../hooks/useSound/useSound'

type JackpotModalProps = {
  showModal: boolean
  onHide: VoidFunction
  score: number
}

const JackpotModal: FC<JackpotModalProps> = ({ showModal, onHide, score }) => {
  const { width, height } = useWindowSize()
  const { playSound } = useSound()
  if (showModal) {
    playSound(SOUND_EFFECT['JACKPOT_CONGRATULATION'])
  }

  return (
    <MyModal show={showModal} onHide={onHide} size="lg">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Jackpot
          text="JACKPOT"
          durationInSeconds={5}
          itemHeight={140}
          itemWidth={80}
        />
        <h2 style={{ textAlign: 'center', marginTop: '10px' }}>
          Chúc mừng bạn!
        </h2>
        <div className="d-flex rounded-20px align-items-center p-2 fw-medium fs-18px">
          <div className="ps-3">Bạn đã trúng thưởng {score}</div>
          <Image
            alt="avatar"
            src="/assets/quiwi-coin.png"
            width="32"
            height="32"
            style={{ marginLeft: '5px' }}
          ></Image>
        </div>
        <button className={styles.btn_hover} onClick={onHide}>
          Tiếp tục
        </button>
        <Confetti width={width} height={height} />
      </div>
    </MyModal>
  )
}

export default JackpotModal
