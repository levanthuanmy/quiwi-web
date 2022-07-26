import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconQuestion, {
  QuestionType,
  questionTypeStyles,
} from '../IconQuestion/IconQuestion'
import MyButton from '../MyButton/MyButton'
import MyModal from '../MyModal/MyModal'

type AddingQuestionButtonsProps = {
  quizId: number
}
const AddingQuestionButtons: FC<AddingQuestionButtonsProps> = ({ quizId }) => {
  const router = useRouter()
  const mainRoute = `/quiz/creator/${quizId}`
  const [showQuestionTypePicker, setShowQuestionTypePicker] =
    useState<boolean>(false)

  const handleAddingQuestionClick = (path: string) => {
    setShowQuestionTypePicker(false)
    router.replace(path, undefined, {
      scroll: false,
    })
  }

  return (
    <>
      <MyButton
        id="addingQuestion"
        className="text-white d-flex align-items-center justify-content-between w-100"
        onClick={() => setShowQuestionTypePicker(true)}
      >
        <div className="text-uppercase fw-medium">Thêm câu hỏi mới</div>
        <i className="bi bi-plus-lg fs-18px" />
      </MyButton>

      <MyModal
        show={showQuestionTypePicker}
        onHide={() => setShowQuestionTypePicker(false)}
        // activeButtonTitle="Quay lại trang chủ"
        // activeButtonCallback={() => router.push('/home')}
        header={<div className="text-center h3">Chọn loại câu hỏi</div>}
      >
        <Row>
          {Object.keys(questionTypeStyles).map((key) => (
            <Col
              key={key}
              xs="12"
              sm="6"
              className="mb-3 align-self-center"
              onClick={() =>
                handleAddingQuestionClick(`${mainRoute}?type=${key}`)
              }
            >
              <IconQuestion
                type={key as QuestionType}
                showTitle
                className="d-flex gap-2 border p-3 rounded-8px cursor-pointer"
              />
            </Col>
          ))}
        </Row>
      </MyModal>
    </>
  )
}

export default AddingQuestionButtons
