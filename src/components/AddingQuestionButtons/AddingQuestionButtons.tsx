import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconQuestion from '../IconQuestion/IconQuestion'

const AddingQuestionButtons: FC = () => {
  const router = useRouter()
  return (
    <div
      id="addingQuestion"
      className="rounded-10px border shadow-sm bg-white p-12px"
    >
      <div className="fw-medium">Thêm câu hỏi mới</div>
      <Row className="mt-3">
        <Col
          xs="6"
          md="3"
          className="d-flex flex-column align-items-center mb-3 mb-md-0"
          onClick={() =>
            router.replace(`/quiz/creator?type=multiple`)
          }
        >
          <IconQuestion type="multiple" showTitle />
        </Col>
        <Col
          xs="6"
          md="3"
          className="d-flex flex-column align-items-center"
          onClick={() => router.replace(`/quiz/creator?type=survey`)}
        >
          <IconQuestion type="survey" showTitle />
        </Col>
        <Col
          xs="6"
          md="3"
          className="d-flex flex-column align-items-center"
          onClick={() => router.replace(`/quiz/creator?type=fill`)}
        >
          <IconQuestion type="fill" showTitle />
        </Col>
        <Col
          xs="6"
          md="3"
          className="d-flex flex-column align-items-center"
          onClick={() => router.replace(`/quiz/creator?type=essay`)}
        >
          <IconQuestion type="essay" showTitle />
        </Col>
      </Row>
    </div>
  )
}

export default AddingQuestionButtons
