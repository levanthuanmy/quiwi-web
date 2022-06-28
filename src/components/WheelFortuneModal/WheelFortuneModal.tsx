import { FC, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { get } from '../../libs/api'
import { TApiResponse, TItemCategory, TUserWheelFortune, TWheelFortune } from '../../types/types'
import MyModal from '../MyModal/MyModal'
import WheelOfFortune from '../WheelFortune/WheelFortune'

type WheelModalProps = {
  userSpinningNumber: number
  showModal: boolean
  onHide: VoidFunction
}
const WheelFortuneModal: FC<WheelModalProps> = ({
  showModal,
  onHide,
}) => {
  const [wheelFortuneResponse, setWheelFortuneResponse] = useState<TWheelFortune>()
  const [userWheelFortuneResponse, setUserWheelFortuneResponse] = useState<TUserWheelFortune>()
  const [isHide, setIsHide] = useState(true);

  useEffect(() => {
    const getWheelFortune = async () => {
      try {
        const res: TApiResponse<TWheelFortune> = await get(
          `/api/wheel-fortune`,
          true
        )
        if (res.response) {
          setWheelFortuneResponse(res.response)
        }
      } catch (error) {
        // alert('Có lỗi nè')
        console.log(error)
      }
    }
    const getUserWheelFortune = async () => {
      try {
        const res: TApiResponse<TUserWheelFortune> = await get(
          `/api/wheel-fortune/user-wheel`,
          true
        )
        if (res.response) {
          setUserWheelFortuneResponse(res.response)
        }
      } catch (error) {
        // alert('Có lỗi nè')
        console.log(error)
      }
    }
    getWheelFortune();
    getUserWheelFortune();
  }, [showModal]);

  return (
    <MyModal
      show={showModal}
      onHide={isHide ? onHide : () => { setIsHide(false) }}
      size="xl"
      header={
        <Modal.Title className="text-primary">Vòng quay may mắn</Modal.Title>
      }
    >
      <WheelOfFortune
        data={wheelFortuneResponse?.wheelSetting}
        jackpotTotalScore={wheelFortuneResponse?.jackpotTotalScore}
        numberPlayerJoin={wheelFortuneResponse?.numberPlayerJoin}
        userNumSpin={userWheelFortuneResponse?.numberSpin}
        onHide={() => setIsHide(true)}
        onShow={() => setIsHide(false)} />
    </MyModal>
  )
}

export { WheelFortuneModal }

