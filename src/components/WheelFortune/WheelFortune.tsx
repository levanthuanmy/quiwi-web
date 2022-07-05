import dynamic from 'next/dynamic'
import {FC, useState} from 'react'
// import { Wheel } from 'react-custom-roulette'
import {SOUND_EFFECT} from '../../utils/constants'
import styles from './WheelFortune.module.css'
import JackspotModal from '../JackpotModal'
import {Image} from 'react-bootstrap'
import {TApiResponse, TResultWheelFortune} from '../../types/types'
import {get} from '../../libs/api'
import {useSound} from "../../hooks/useSound/useSound";

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
  data: any
  jackpotTotalScore?: number
  numberPlayerJoin?: number
  userNumSpin?: number
  onHide: VoidFunction
  onShow: VoidFunction
}


const WheelOfFortune: FC<WheelProps> = ({ data, jackpotTotalScore, numberPlayerJoin, userNumSpin, onHide, onShow }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [openJackpotModal, setOpenJackpotModal] = useState(false);
  const [resultSpinning, setResultSpinning] = useState<TResultWheelFortune>();
  const [jscore, setJscore] = useState(jackpotTotalScore ?? 0);
  const [totalSpinning, setTotalSpinning] = useState(userNumSpin ?? 0);
  const [totalJoinSpinning, setTotalJoinSpinning] = useState(numberPlayerJoin ?? 0);
  const [totalScore, setTotalScore] = useState(0);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const sound = useSound()
  // console.log(data);

  const handleSpinClick = () => {
    if (mustSpin) return;
    const getResultOfSpinning = async () => {
      try {
        const res: TApiResponse<TResultWheelFortune> = await get(
          `/api/wheel-fortune/spin-wheel`,
          true
        )
        if (res.response) {
          setPrizeNumber(res.response.prizeNumber);
          setJscore(res.response.jackpotScore);
          setTotalSpinning(res.response.numberSpin);
          setTotalJoinSpinning(res.response.numberJoinSpinning);
          setTotalScore(res.response.score);
          setResultSpinning(res.response);
          setMustSpin(true)
          sound?.playSound(SOUND_EFFECT['SPIN_BUTTON']);
          onShow();
        }
      } catch (error) {
        alert('Không đủ số lượng quay')
        console.log(error)
      }
    }
    getResultOfSpinning();
    console.log(prizeNumber);
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
            onHide();
            setOpenJackpotModal(resultSpinning?.isJackpot ?? false);
          }}
          spinDuration={0.45}
        />
        <button className={styles.btnBuy} onClick={handleSpinClick}>SPIN</button>
      </div>
      <div style={{ width: '500px', display: 'flex', flexDirection:'column', justifyContent:'space-evenly' }}>
        <Image src="/assets/jackpot.png"
          alt="avatar"
          width="400"
          height="170"></Image>
        <h3>Tổng số đã quay thưởng: {totalJoinSpinning}</h3>
        <h4>Số lượng điểm Jackpot</h4>
        <div className='d-flex rounded-20px align-items-center p-2 fw-medium fs-18px' style={{ display: 'flex', justifyContent: 'center' }} >
          <AnimatedNumbers
            includeComma
            animateToNumber={jscore}
            fontStyle={{ fontSize: 80 }}
            configs={[{ "mass": 1, "tension": 140, "friction": 126 }, { "mass": 1, "tension": 130, "friction": 114 }, { "mass": 1, "tension": 150, "friction": 112 }, { "mass": 1, "tension": 130, "friction": 120 }]}
          ></AnimatedNumbers>
          <Image
            alt="avatar"
            src="/assets/quiwi-coin.png"
            width="70"
            height="70"
            style={{ marginLeft: '5px' }}
          ></Image>
        </div>
        <div style={{ fontSize: '20px' }}>Số lượt quay: {totalSpinning}</div>
      </div>
      <JackspotModal
        onHide={() => {
          setOpenJackpotModal(false)
        }}
        showModal={openJackpotModal}
        score={totalScore}
      />
    </div>
  )
}

export default WheelOfFortune
