import React, { FC } from 'react'
import { Accordion, Col, Row } from 'react-bootstrap'
import IconQuestion from '../IconQuestion/IconQuestion'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

const ItemQuestion: FC = () => {
  return (
    <Accordion id="itemQuestion" defaultActiveKey="0" className="mb-3">
      <Accordion.Item eventKey="0" className="overflow-hidden">
        <Accordion.Header>
          <Row className="w-100 m-0">
            <Col className="d-flex align-items-center ps-0">
              <IconQuestion type="multiple" className="me-3" />
              <div className="fw-medium">Câu hỏi 1</div>
            </Col>
            <Col className="d-flex align-items-center justify-content-end pe-0">
              <QuestionActionButton
                iconClassName="bi bi-pencil"
                className="bg-white me-2"
              />
              <QuestionActionButton
                iconClassName="bi bi-clipboard2"
                className="bg-white me-2"
              />
              <QuestionActionButton
                iconClassName="bi bi-trash"
                className="bg-danger text-white border-0"
              />
            </Col>
          </Row>
        </Accordion.Header>
        <Accordion.Body>
          <div className="fw-medium mb-3">
            <div className="fs-14px text-secondary">Câu hỏi</div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>

          <div className="fw-medium">
            <div className="fs-14px text-secondary">Câu trả lời</div>
            <Row>
              <Col xs="6">
                <i className="bi bi-circle-fill me-2 text-primary" />
                Lorem ipsum dolor sit amet
              </Col>
              <Col xs="6">
                <i className="bi bi-circle-fill me-2 text-danger" />
                Lorem ipsum dolor sit amet
              </Col>
              <Col xs="6">
                <i className="bi bi-circle-fill me-2 text-danger" />
                Lorem ipsum dolor sit amet
              </Col>
            </Row>
          </div>
        </Accordion.Body>
        <div className="accordion-button rounded-0">
          <QuestionActionButton
            iconClassName="bi bi-clock"
            className="bg-white"
            title="30 giây"
          />
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default ItemQuestion
