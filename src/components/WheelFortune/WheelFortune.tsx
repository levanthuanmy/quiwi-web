import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
// import { Wheel } from 'react-custom-roulette'
import { SOUND_EFFECT } from '../../utils/constants'
import { playSound } from '../../utils/helper'
import styles from './WheelFortune.module.css'
import JackspotModal from '../JackpotModal'
const AnimatedNumbers = dynamic(() => import('react-animated-numbers'), {
  ssr: false
})
// import AnimatedNumbers from 'react-animated-numbers';

export interface WheelData {
  option: string;
  style?: StyleType;
}

export interface StyleType {
  backgroundColor?: string;
  textColor?: string;
}


interface Props {
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: WheelData[];
  onStopSpinning?: () => any;
  backgroundColors?: string[];
  textColors?: string[];
  outerBorderColor?: string;
  outerBorderWidth?: number;
  innerRadius?: number;
  innerBorderColor?: string;
  innerBorderWidth?: number;
  radiusLineColor?: string;
  radiusLineWidth?: number;
  fontSize?: number;
  perpendicularText?: boolean;
  textDistance?: number;
  spinDuration?: number;
}

const Wheel = dynamic<Props>(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false }
)

type WheelProps = {
}

const data = [
  { option: 'Jackspot', style: { backgroundColor: 'darkred', textColor: 'black' } },
  { option: '100' },
  { option: '300' },
  { option: '500' },
  { option: '600' },
  { option: '150' },
  { option: '200' },
  { option: '3000' },
]


const WheelOfFortune: FC<WheelProps> = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [openJackpotModal, setOpenJackpotModal] = useState(false);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
    playSound(SOUND_EFFECT['SPIN_BUTTON']);
  }

  return (
    <div className={styles.containerParent}>
      <div id="wheelOfFortune" className={styles.containerWheel}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          outerBorderColor={"#26a796"}
          outerBorderWidth={3}
          radiusLineColor={"#26a796"}
          radiusLineWidth={2}
          perpendicularText={true}
          innerRadius={10}
          backgroundColors={['lightyellow', 'lightgrey']}
          innerBorderColor='#26a796'
          innerBorderWidth={10}
          onStopSpinning={() => {
            setMustSpin(false);
            setOpenJackpotModal(true);
            playSound(SOUND_EFFECT['JACKPOT_CONGRATULATION']);
          }}
          spinDuration={0.45}
        />
        <button className={styles.btnBuy} onClick={handleSpinClick}>SPIN</button>
      </div>
      <div style={{ width: '500px' }}>
        <div>Số lượng điểm Jackpot</div>
        <div>Tổng số người đã quay thưởng: 0</div>
        <div>
          <AnimatedNumbers
            includeComma
            animateToNumber={10000000}
            fontStyle={{ fontSize: 100 }}
            configs={[{"mass":1,"tension":140,"friction":126},{"mass":1,"tension":130,"friction":114},{"mass":1,"tension":150,"friction":112},{"mass":1,"tension":130,"friction":120}]}
          ></AnimatedNumbers>
        </div>
        <div>Số lượt quay: 0</div>
      </div>
      <JackspotModal
        onHide={() => {
          setOpenJackpotModal(false)
        }}
        showModal={openJackpotModal}
      />
    </div>
  )
}

export default WheelOfFortune
