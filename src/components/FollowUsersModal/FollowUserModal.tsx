import { FC } from 'react'
import { Modal } from 'react-bootstrap'

const FollowUserModal: FC<{
  title: string
  show: boolean
  handleClose: () => void
}> = ({ title, show, handleClose, ...props }) => {
  return (
    <Modal
      centered
      show={show}
      onHide={() => {
        handleClose()
      }}
    >
      <Modal.Header className="text-center justify-content-center" closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  )
}

export default FollowUserModal
