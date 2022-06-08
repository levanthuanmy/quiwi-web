import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconQuestion, {
  QuestionType,
  questionTypeStyles,
} from '../IconQuestion/IconQuestion'

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
        {Object.keys(questionTypeStyles).map((key) => (
          <Col
            key={key}
            xs="6"
            sm="3"
            className="d-flex flex-column align-items-center mb-3"
            onClick={() =>
              handleAddingQuestionClick(`${mainRoute}?type=${key}`)
            }
          >
            <IconQuestion type={key as QuestionType} showTitle />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default AddingQuestionButtons
