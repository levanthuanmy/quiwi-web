import React, { FC, ReactNode } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import MyButton from '../MyButton/MyButton'

type MyModalProps = {
  show: boolean
  onHide: () => void
  header?: ReactNode
  children?: ReactNode
  activeButtonTitle?: string
  inActiveButtonTitle?: string
  activeButtonCallback?: () => void
  inActiveButtonCallback?: () => void
  fullscreen?: boolean
  size?: 'sm' | 'lg' | 'xl'
  footer?: ReactNode
}
const MyModal: FC<MyModalProps> = ({
  show,
  onHide,
  header,
  children,
  activeButtonTitle,
  inActiveButtonTitle,
  activeButtonCallback,
  inActiveButtonCallback,
  fullscreen = false,
  size,
  footer,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="rounded-14px border-0 shadow-lg"
      fullscreen={fullscreen ? 'lg-down' : undefined}
      size={size}
    >
      <Modal.Header closeButton className="border-0">
        {header}
      </Modal.Header>
      <Modal.Body className="py-4">
        {children ?? 'This is children of MyModal'}
      </Modal.Body>
      {inActiveButtonTitle || activeButtonTitle ? (
        <Row className="justify-content-center p-3">
          {inActiveButtonTitle?.length && (
            <Col xs="6">
              <MyButton
                className="text-white w-100"
                variant="secondary"
                onClick={inActiveButtonCallback}
              >
                {inActiveButtonTitle}
              </MyButton>
            </Col>
          )}
          {activeButtonTitle?.length && (
            <Col xs="6">
              <MyButton
                className="text-white w-100"
                onClick={activeButtonCallback}
              >
                {activeButtonTitle}
              </MyButton>
            </Col>
          )}
        </Row>
      ) : null}

      {footer}
    </Modal>
  )
}

export default MyModal
