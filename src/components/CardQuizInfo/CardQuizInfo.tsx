import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

const CardQuizInfo: FC = () => {
  return (
    <div className="rounded-10px border bg-white p-12px">
      <div className="border rounded-10px text-center fs-14px text-secondary py-4 cursor-pointer">
        <div className="bi bi-image text-primary fs-32px"></div>
        Bấm vào đây để thêm ảnh bìa cho quiz
      </div>
      <Row className="d-flex pt-12px">
        <Col>
          <div className="fw-medium fs-18px">Đây là tên của quiz</div>

          <div className="fs-14px text-secondary mt-3">
            <div>
              <i className="bi bi-eye me-2 fs-16px" />
              Công khai
            </div>
            <div>
              <i className="bi bi-journals me-2 fs-16px" />
              Toán học, Tư duy
            </div>
          </div>
        </Col>
        <Col xs="auto">
          <QuestionActionButton iconClassName="bi bi-pencil" />
        </Col>
      </Row>
    </div>
  )
}

export default CardQuizInfo
