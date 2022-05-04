import classNames from 'classnames'
import React, { FC } from 'react'
import { Accordion, Col, Image, Row } from 'react-bootstrap'
import { TQuestionRequest } from '../../types/types'
import IconQuestion from '../IconQuestion/IconQuestion'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

type ItemQuestionProps = {
  question: TQuestionRequest
}
const ItemQuestion: FC<ItemQuestionProps> = ({ question }) => {
  return (
    <Accordion id="itemQuestion" defaultActiveKey="0" className="mb-3">
      <Accordion.Item eventKey="0" className="overflow-hidden">
        <Accordion.Header>
          <Row className="w-100 m-0">
            <Col className="d-flex align-items-center ps-0">
              <IconQuestion type="multiple" className="me-3" />
              <div className="fw-medium">{question.orderPosition}</div>
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
            <div>{question.question}</div>
          </div>

          <div className="fw-medium">
            <div className="fs-14px text-secondary">Câu trả lời</div>
            <Row>
              {question.questionAnswers.map((answer, key) => (
                <Col key={key} xs="6" className='d-flex align-items-center'>
                  <div
                    className={classNames('bi bi-circle-fill me-2', {
                      'text-danger': !answer.isCorrect,
                      'text-primary': answer.isCorrect,
                    })}
                  />
                  <div>
                    <div>{answer.answer}</div>
                    {answer.media.length ? (
                      <Image
                        src={answer.media}
                        alt=""
                        width="100%"
                        height="160"
                        className="object-fit-cover rounded border mt-2"
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </Col>
              ))}
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
