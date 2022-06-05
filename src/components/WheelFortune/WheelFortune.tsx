import { FC, useState } from 'react'
import { Wheel } from 'react-custom-roulette'
import { SOUND_EFFECT } from '../../utils/constants'
import { playSound } from '../../utils/helper'
import styles from './WheelFortune.module.css'

type ItemShopProps = {

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


const WheelOfFortune: FC<ItemShopProps> = ({ }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

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
          }}
          spinDuration={0.45}
        />
        <button className={styles.btnBuy} onClick={handleSpinClick}>SPIN</button>
      </div>
      <div style={{width:'500px', backgroundColor:'red'}}>

      </div>
    </div>
  )
}

export default WheelOfFortune
