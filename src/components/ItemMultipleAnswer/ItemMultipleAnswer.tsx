import React, { FC } from 'react'
import { Form } from 'react-bootstrap'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

const ItemMultipleAnswer: FC = () => {
  return (
    <div className="rounded-10px border bg-secondary bg-opacity-10 overflow-hidden">
      <div className="d-flex p-12px">
        <QuestionActionButton
          iconClassName="bi bi-check-lg"
          className="me-2 bg-white"
        />
        <QuestionActionButton
          iconClassName="bi bi-image"
          className="me-2 bg-white"
        />
        <QuestionActionButton
          iconClassName="bi bi-trash"
          className="me-2 bg-danger text-white"
        />
      </div>
      <Form.Control
        as="textarea"
        placeholder="Nhập câu trả lời của bạn ở đây..."
        style={{
          height: 240,
          resize: 'none',
        }}
        className="shadow-none border-0 rounded-0 bg-transparent"
      />
    </div>
  )
}

export default ItemMultipleAnswer
