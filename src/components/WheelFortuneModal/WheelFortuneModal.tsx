import { FC } from 'react'
import { Modal } from 'react-bootstrap'
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
  return (
    <MyModal
      show={showModal}
      onHide={onHide}
      size="xl"
      header={
        <Modal.Title className="text-primary">Vòng quay man mắn</Modal.Title>
      }
    >
      <div>
        <div><WheelOfFortune/></div>
      </div>
    </MyModal>
  )
}

export { WheelFortuneModal }

