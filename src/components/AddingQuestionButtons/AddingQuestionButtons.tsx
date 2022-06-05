import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconQuestion from '../IconQuestion/IconQuestion'

type AddingQuestionButtonsProps = {
  quizId: number
}
const AddingQuestionButtons: FC<AddingQuestionButtonsProps> = ({ quizId }) => {
  const router = useRouter()
  const mainRoute = `/quiz/creator/${quizId}`

  const handleAddingQuestionClick = (path: string) => {
    router.replace(path, undefined, {
      scroll: false,
    })
  }

  return (
    <div
      id="addingQuestion"
      className="rounded-10px border shadow-sm bg-white p-12px"
    >
      <div className="fw-medium">Thêm câu hỏi mới</div>
      <Row className="mt-3">
        <Col
          xs="6"
          sm="3"
          className="d-flex flex-column align-items-center mb-3 mb-md-0"
          onClick={() => handleAddingQuestionClick(`${mainRoute}?type=single`)}
        >
          <IconQuestion type="single" showTitle />
        </Col>
        <Col
          xs="6"
          sm="3"
          className="d-flex flex-column align-items-center"
          onClick={() =>
            handleAddingQuestionClick(`${mainRoute}?type=multiple`)
          }
        >
          <IconQuestion type="multiple" showTitle />
        </Col>
        <Col
          xs="6"
          sm="3"
          className="d-flex flex-column align-items-center"
          onClick={() => handleAddingQuestionClick(`${mainRoute}?type=fill`)}
        >
          <IconQuestion type="fill" showTitle />
        </Col>
        <Col
          xs="6"
          sm="3"
          className="d-flex flex-column align-items-center"
          onClick={() =>
            handleAddingQuestionClick(`${mainRoute}?type=conjunction`)
          }
        >
          <IconQuestion type="conjunction" showTitle />
        </Col>
      </Row>
    </div>
  )
}

export default AddingQuestionButtons
