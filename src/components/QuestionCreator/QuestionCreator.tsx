import { Field, Form as FormikForm, Formik } from 'formik'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap'
import { post } from '../../libs/api'
import {
  TAnswerRequest,
  TApiResponse,
  TQuestionRequest,
  TQuiz,
} from '../../types/types'
import IconQuestion, {
  QuestionType,
  questionTypeStyles,
} from '../IconQuestion/IconQuestion'
import ItemMultipleAnswer from '../ItemMultipleAnswer/ItemMultipleAnswer'
import MyButton from '../MyButton/MyButton'
import MyInput from '../MyInput/MyInput'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'
import QuestionConfigBtn from '../QuestionConfigBtn/QuestionConfigBtn'

const defaultAnswer: TAnswerRequest = {
  answer: '',
  isCorrect: false,
  orderPosition: 0,
  media: '',
}

type QuestionCreatorProps = {
  show: boolean
  onHide: () => void
  setQuiz: React.Dispatch<React.SetStateAction<TQuiz | undefined>>
  quiz: TQuiz | undefined
}
const QuestionCreator: FC<QuestionCreatorProps> = ({
  show,
  onHide,
  setQuiz,
  quiz,
}) => {
  const router = useRouter()
  const type: QuestionType =
    (router.query?.type?.toString() as QuestionType) || 'multiple'
  const quizId = Number(router.query.id)
  console.log('quizId', quizId)
  const [fillAnswers, setFillAnswers] = useState<string[]>([])
  const [answers, setAnswers] = useState<TAnswerRequest[]>([
    { ...defaultAnswer, orderPosition: 0 },
    { ...defaultAnswer, orderPosition: 1 },
    { ...defaultAnswer, orderPosition: 2 },
  ])
  const [newQuestion, setNewQuestion] = useState<TQuestionRequest>({
    type: '10SG',
    difficulty: 1,
    duration: 100,
    orderPosition: 1,
    question: '',
    questionAnswers: [],
  })

  console.log('answers', answers)

  const resetStates = () => {
    setAnswers([
      { ...defaultAnswer, orderPosition: 0 },
      { ...defaultAnswer, orderPosition: 1 },
      { ...defaultAnswer, orderPosition: 2 },
    ])
    setFillAnswers([])
  }

  const removeAnswerAtIndex = (index: number) => {
    try {
      const cloneAnswers = [...answers]
      cloneAnswers.splice(index, 1)

      for (let i = 0; i < cloneAnswers.length; i++) {
        cloneAnswers[i].orderPosition = i
      }

      setAnswers(cloneAnswers)
    } catch (error) {
      console.log('removeAnswerAtIndex - error', error)
    }
  }

  const onSaveQuestion = async () => {
    try {
      if (!quiz) return

      const _newQuestion: TQuestionRequest = {
        ...newQuestion,
        questionAnswers: answers,
      }

      const body = { ...quiz, questions: [...quiz.questions, _newQuestion] }
      const res = await post<TApiResponse<TQuiz>>(
        `/api/quizzes/${quizId}`,
        {},
        body,
        true
      )

      setQuiz(res.response)

      onHide()
    } catch (error) {
      console.log('onSaveQuestion - error', error)
    }
  }

  useEffect(() => {
    if (!show) {
      resetStates()
    }
  }, [show])

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="rounded-10px border-0 shadow overflow-hidden"
      backdrop="static"
      keyboard={false}
      size="xl"
      fullscreen="lg-down"
    >
      <Modal.Body className="p-0">
        <div className="bg-secondary bg-opacity-10 p-3">
          <Row>
            <Col xs="12" md="auto" className="mb-3 mb-md-0">
              <QuestionConfigBtn
                prefixIcon={
                  <QuestionActionButton
                    iconClassName="bi bi-image"
                    className="bg-primary text-white"
                  />
                }
                title="Thêm hình ảnh"
                suffixIcon={<i className="bi bi-plus-lg fs-18px" />}
                className="mb-2"
              />
              <QuestionConfigBtn
                prefixIcon={<IconQuestion type={type} />}
                title={questionTypeStyles[type].title}
                suffixIcon={<i className="bi bi-chevron-down fs-18px" />}
                className="mb-2"
              />
              {type === 'multiple' && (
                <QuestionConfigBtn
                  prefixIcon={
                    <QuestionActionButton
                      iconClassName="bi bi-grid"
                      className="bg-primary text-white"
                    />
                  }
                  title="Nhiều đáp án đúng"
                  suffixIcon={<i className="bi bi-chevron-down fs-18px" />}
                  className="mb-2"
                />
              )}
              <QuestionConfigBtn
                prefixIcon={
                  <QuestionActionButton
                    iconClassName="bi bi-clock"
                    className="bg-primary text-white"
                  />
                }
                title="30 giây"
                suffixIcon={<i className="bi bi-chevron-down fs-18px" />}
              />
            </Col>
            <Col className="ps-12px ps-md-0">
              <Form.Control
                as="textarea"
                className="border rounded-10px bg-white shadow-none fs-20px"
                defaultValue={newQuestion.question}
                onChange={(e) => {
                  const cloneQuestion = { ...newQuestion }
                  cloneQuestion.question = e.target.value
                  setNewQuestion(cloneQuestion)
                }}
                style={{
                  height: 240,
                  resize: 'none',
                }}
                placeholder="Nhập câu hỏi của bạn ở đây..."
              />
            </Col>
          </Row>
        </div>

        <div className="bg-white p-3">
          {(type === 'multiple' || type === 'survey') && (
            <Row>
              {answers.map((answer, key) => (
                <Col key={key} xs="12" sm="6" lg="4" xl="3" className="mb-3">
                  <ItemMultipleAnswer
                    index={key}
                    answers={answers}
                    setAnswers={setAnswers}
                    onRemove={() => removeAnswerAtIndex(key)}
                  />
                </Col>
              ))}

              {answers.length < 6 && (
                <Col
                  xs="auto"
                  className="my-auto"
                  onClick={() =>
                    setAnswers((prev) => [
                      ...prev,
                      { ...defaultAnswer, orderPosition: prev.length },
                    ])
                  }
                >
                  <div className="bi bi-plus-circle-fill fs-1 mb-0 text-primary cursor-pointer" />
                </Col>
              )}
            </Row>
          )}

          {type === 'essay' && (
            <div className="text-center py-5 fs-18px">
              Người tham gia sẽ điền câu trả lời của họ ở đây
            </div>
          )}

          {type === 'fill' && (
            <div>
              <div className="text-center mb-4 fs-18px fw-medium">
                Đánh dấu một câu trả lời là đúng, nếu câu trả lời
              </div>

              <Row>
                <Col xs="12" sm="auto" className="mb-3 mb-sm-0">
                  <Form.Select
                    className="rounded-10px shadow-none"
                    style={{ height: 50 }}
                  >
                    <option>Chính xác</option>
                    <option>Chứa đựng</option>
                    <option>Số lượng chính xác</option>
                    <option>Đúng phần đầu</option>
                    <option>Đúng phần cuối</option>
                  </Form.Select>
                </Col>

                <Col>
                  {fillAnswers.map((answer, key) => (
                    <div key={key} className="d-flex mb-3 fw-medium">
                      <div className="p-12px border rounded-8px w-100 bg-primary bg-opacity-25">
                        {answer}
                      </div>
                      <MyButton
                        className="ms-3 bg-danger shadow-none border-danger text-white"
                        onClick={() => {
                          const currentAns = [...fillAnswers]
                          currentAns.splice(key, 1)
                          setFillAnswers(currentAns)
                        }}
                      >
                        <i className="bi bi-trash" />
                      </MyButton>
                    </div>
                  ))}

                  <Formik
                    initialValues={{ newAnswer: '' }}
                    onSubmit={(values, actions) => {
                      if (values.newAnswer.length) {
                        setFillAnswers([...fillAnswers, values.newAnswer])
                      }
                      actions.setSubmitting(false)
                    }}
                  >
                    {({ isSubmitting }) => (
                      <FormikForm className="d-flex">
                        <Field
                          type="text"
                          name="newAnswer"
                          placeholder="Nhập đáp án mới"
                          as={MyInput}
                          className="mb-3"
                        />

                        <MyButton
                          className="ms-3 text-white"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          <i className="bi bi-plus-lg" />
                        </MyButton>
                      </FormikForm>
                    )}
                  </Formik>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <MyButton
          className="bg-danger shadow-none border-danger text-white"
          onClick={onHide}
        >
          Huỷ
        </MyButton>
        <MyButton className="text-white" onClick={onSaveQuestion}>
          Lưu
        </MyButton>
      </Modal.Footer>
    </Modal>
  )
}

export default QuestionCreator
