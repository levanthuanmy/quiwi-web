import classNames from 'classnames'
import React, { FC, useState } from 'react'
import { Accordion, Col, Image, Row, useAccordionButton } from 'react-bootstrap'
import { TQuestionRequest } from '../../types/types'
import { MAPPED_QUESTION_TYPE } from '../../utils/constants'
import IconQuestion from '../IconQuestion/IconQuestion'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

type ItemQuestionProps = {
  question: TQuestionRequest
  onRemove: () => void
  onEditQuestion: () => void
}

const ItemQuestion: FC<ItemQuestionProps> = ({
  question,
  onRemove,
  onEditQuestion,
}) => {
  return (
    <Accordion id="itemQuestion" defaultActiveKey="0" className="mb-3">
      <Accordion.Item eventKey="0" className="overflow-hidden">
        <CustomToggle
          eventKey="0"
          question={question}
          onRemove={onRemove}
          onEditQuestion={onEditQuestion}
        />
        <Accordion.Body>
          <div className="fw-medium mb-3">
            <div className="fs-14px text-secondary">Câu hỏi</div>
            <div>{question.question}</div>
            {question.media?.length ? (
              <Image
                src={question.media}
                alt=""
                width="100%"
                height="160"
                className="object-fit-cover rounded border mt-2"
              />
            ) : (
              <></>
            )}
          </div>

          <div className="fw-medium">
            <div className="fs-14px text-secondary">Câu trả lời</div>
            <Row>
              {question.questionAnswers.map((answer, key) => (
                <Col key={key} xs="6" className="d-flex align-items-center">
                  <div
                    className={classNames('bi bi-circle-fill me-2', {
                      'text-danger': !answer.isCorrect,
                      'text-primary': answer.isCorrect,
                    })}
                  />
                  <div>
                    <div>{answer.answer}</div>
                    {answer.media?.length ? (
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
        <div className="bg-secondary p-12px bg-opacity-10 d-flex">
          <QuestionActionButton
            iconClassName="bi bi-clock"
            className="bg-white"
            title={question.duration.toString()}
          />
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default ItemQuestion

function CustomToggle({
  eventKey,
  question,
  onRemove,
  onEditQuestion,
}: {
  eventKey: string
  question: TQuestionRequest
  onRemove: () => void
  onEditQuestion: () => void
}) {
  const [isToggle, setIsToggle] = useState<boolean>(true)
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    setIsToggle((prev) => !prev)
  )

  return (
    <Row className="w-100 m-0 bg-secondary p-12px bg-opacity-10 border-bottom">
      <Col className="d-flex align-items-center ps-0">
        <IconQuestion
          type={MAPPED_QUESTION_TYPE[question.type]}
          className="me-3"
        />
        <div className="fw-medium">{question.orderPosition}</div>
      </Col>
      <Col className="d-flex align-items-center justify-content-end pe-0 gap-2">
        <QuestionActionButton
          iconClassName="bi bi-trash"
          className="bg-danger text-white border-0"
          onClick={onRemove}
        />
        <QuestionActionButton
          iconClassName="bi bi-pencil"
          className="bg-white"
          onClick={onEditQuestion}
        />
        <QuestionActionButton
          iconClassName={classNames('bi', {
            'bi-chevron-down': !isToggle,
            'bi-chevron-up': isToggle,
          })}
          className="bg-white"
          onClick={decoratedOnClick}
        />
      </Col>
    </Row>
  )
}
