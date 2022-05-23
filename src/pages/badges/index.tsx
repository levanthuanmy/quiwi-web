import { NextPage } from 'next'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import CardBadge from '../../components/CardBadge/CardBadge'
import ModalBadge from '../../components/ModalBadge/ModalBadge'

const BadgesPage: NextPage = () => {
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <div className="w-100">
        <Row>
          <Col xs="12" sm="6" md="4" lg="6" xl="4" className="pb-4">
            <CardBadge
              onClick={handleShow}
              image={
                'https://img.freepik.com/free-vector/knight-shield-cartoon-sticker_1308-66058.jpg'
              }
              title={'Khiêng chúa'}
              description={'Dùng khiêng bảo hộ 100 lần'}
              progress={'100'}
            />
          </Col>

          <Col xs="12" sm="6" md="4" lg="6" xl="4" className="pb-4">
            <CardBadge
              onClick={handleShow}
              image={
                'https://cdn.imgbin.com/22/1/23/imgbin-police-officer-cartoon-police-badge-material-yellow-police-badge-art-z25Etc1QUL7BnaGV70qy0HWBv.jpg'
              }
              title={'Huân Chương Top 1'}
              description={'Đạt top 1 500 lần'}
              progress={'60'}
            />
          </Col>

          <Col xs="12" sm="6" md="4" lg="6" xl="4" className="pb-4">
            <CardBadge
              onClick={handleShow}
              image={
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkSN0audfR-FYWM-pnfcysnC4QBjbXucVTrA&usqp=CAU'
              }
              title={'Chuyên gia cày cuốc'}
              description={
                'Đạt top 3 trong 10 trận gần nhất không dùng vật phẩm'
              }
              progress={'10'}
            />
          </Col>
        </Row>
      </div>

      <Modal
        show={show}
        size="sm"
        centered
        onShow={() => setShow(true)}
        onHide={() => setShow(false)}
      >
        <ModalBadge onClose={() => setShow(false)}></ModalBadge>
      </Modal>
    </>
  )
}

export default BadgesPage
