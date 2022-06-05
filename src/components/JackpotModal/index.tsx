import React, { FC } from 'react';
import Jackpot from '../Jackpot';
import MyModal from '../MyModal/MyModal';
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'


type JackpotModalProps = {
  showModal: boolean
  onHide: VoidFunction
}

const JackpotModal: FC<JackpotModalProps> = ({ showModal, onHide }) => {
  const { width, height } = useWindowSize()

  return (
    <MyModal
      show={showModal}
      onHide={onHide}
      size="lg"
    >
      <Jackpot
        text="JACKPOT"
        durationInSeconds={5}
        itemHeight={140}
        itemWidth={80}
      />
      <div>Chúc mừng bạn đã chúng thưởng giải đặc biệt 100,000,000 Kiwi</div>
      <Confetti
        width={width}
        height={height}
      />
    </MyModal>
  )
}

export default JackpotModal;
