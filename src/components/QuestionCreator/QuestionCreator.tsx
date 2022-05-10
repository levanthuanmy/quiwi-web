import { Field, Form as FormikForm, Formik } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { Col, Dropdown, Form, Image, Modal, Row } from 'react-bootstrap'
import { post } from '../../libs/api'
import { TEditQuestion } from '../../pages/quiz/creator/[id]'
import {
  TAnswerRequest,
  TApiResponse,
  TQuestionRequest,
  TQuestionType,
  TQuiz,
} from '../../types/types'
import { MAPPED_QUESTION_TYPE, TIMEOUT_OPTIONS } from '../../utils/constants'
import {
  storageRef,
  storage,
  uploadFile,
  getUrl,
} from '../../utils/firebaseConfig'
import { getCurrentTrueAnswer } from '../../utils/helper'
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
  type: '20SELECTION',
}

const defaultQuestion: TQuestionRequest = {
  type: '10SG',
  difficulty: 1,
  duration: 30,
  orderPosition: 0,
  question: '',
  questionAnswers: [
    { ...defaultAnswer, orderPosition: 0 },
    { ...defaultAnswer, orderPosition: 1 },
    { ...defaultAnswer, orderPosition: 2 },
  ],
  media: '',
}

type QuestionCreatorProps = {
  show: boolean
  onHide: () => void
  setQuiz: React.Dispatch<React.SetStateAction<TQuiz | undefined>>
  quiz: TQuiz | undefined
  isEditQuestion: TEditQuestion
}
const QuestionCreator: FC<QuestionCreatorProps> = ({
  show,
  onHide,
  setQuiz,
  quiz,
  isEditQuestion,
}) => {
  const router = useRouter()
  const quizId = Number(router.query.id)
  const [fillAnswers, setFillAnswers] = useState<string[]>([])
  const [answers, setAnswers] = useState<TAnswerRequest[]>([
    { ...defaultAnswer, orderPosition: 0 },
    { ...defaultAnswer, orderPosition: 1 },
    { ...defaultAnswer, orderPosition: 2 },
  ])
  const [newQuestion, setNewQuestion] =
    useState<TQuestionRequest>(defaultQuestion)
  const type: QuestionType = isEditQuestion.isEdit
    ? MAPPED_QUESTION_TYPE[newQuestion?.type]
    : (router.query?.type?.toString() as QuestionType) || 'single'

  useEffect(() => {
    if (isEditQuestion.isEdit) {
      setNewQuestion(
        quiz?.questions.find(
          (question) => question.id === isEditQuestion.questionId
        ) as TQuestionRequest
      )
      setAnswers(
        quiz?.questions.find(
          (question) => question.id === isEditQuestion.questionId
        )?.questionAnswers as TAnswerRequest[]
      )
    } else {
      setNewQuestion(defaultQuestion)
    }
  }, [isEditQuestion, quiz?.questions])

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
      if (getCurrentTrueAnswer(answers) < 1) {
        alert('Bạn cần có ít nhất 1 câu trả lời là đúng')
        return
      }
      const _newQuestion: TQuestionRequest = {
        ...newQuestion,
        questionAnswers: answers,
        type: isEditQuestion.isEdit
          ? newQuestion.type
          : (Object.keys(MAPPED_QUESTION_TYPE).find(
              (key) => MAPPED_QUESTION_TYPE[key] === type
            ) as TQuestionType),
        orderPosition: isEditQuestion.isEdit
          ? newQuestion.orderPosition
          : quiz.questions.length,
      }

      let body = {}
      if (isEditQuestion.isEdit) {
        const _questions = [...quiz.questions]
        for (let i = 0; i < _questions.length; i++) {
          if (_questions[i].id === isEditQuestion.questionId) {
            _questions[i] = { ..._newQuestion, id: isEditQuestion.questionId }
          }
        }
        body = { ...quiz, questions: [..._questions] }
      } else {
        body = { ...quiz, questions: [...quiz.questions, _newQuestion] }
      }
      const res = await post<TApiResponse<TQuiz>>(
        `/api/quizzes/${quizId}`,
        {},
        body,
        true
      )

      setQuiz(res.response)
      setNewQuestion(defaultQuestion)

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

  const handleUploadImage = async (evt: any) => {
    try {
      const data: File = evt.target.files[0]

      const path = `/images/${data.name}`
      const ref = storageRef(storage, path)
      await uploadFile(ref, data)
      const url = await getUrl(ref)

      setNewQuestion((prev) => ({
        ...prev,
        media: url,
      }))
    } catch (error) {
      console.log('handleUploadImage - error', error)
    }
  }

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
              <div className="position-relative">
                <input
                  type="file"
                  onChange={handleUploadImage}
                  onDropCapture={handleUploadImage}
                  className="position-absolute top-0 w-100 h-100 opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ left: 0 }}
                />
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
              </div>

              <QuestionConfigBtn
                prefixIcon={<IconQuestion type={type} />}
                title={questionTypeStyles[type].title}
                suffixIcon=""
                className="mb-2"
              />
              <Dropdown id="timeoutDropdown">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="w-100 p-0 bg-transparent border-0 shadow-none"
                >
                  <QuestionConfigBtn
                    prefixIcon={
                      <QuestionActionButton
                        iconClassName="bi bi-clock"
                        className="bg-primary text-white"
                      />
                    }
                    title={`${newQuestion.duration} giây`}
                    suffixIcon={<i className="bi bi-chevron-down fs-18px" />}
                    className="text-start"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100 rounded-10px shadow-sm">
                  {TIMEOUT_OPTIONS.map((item, key) => (
                    <Dropdown.Item
                      key={key}
                      onClick={() =>
                        setNewQuestion({ ...newQuestion, duration: item })
                      }
                    >
                      {item} giây
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col className="ps-12px ps-md-0">
              <Row className="flex-column-reverse flex-md-row border m-0 rounded-10px overflow-hidden">
                {newQuestion?.media?.length ? (
                  <Col xs="12" md="6" className="p-0">
                    <Image
                      src={newQuestion.media}
                      width="100%"
                      height="240"
                      alt=""
                      className="object-fit-cover"
                    />
                  </Col>
                ) : (
                  <></>
                )}
                <Col xs="12" md="6" className="p-0">
                  <Form.Control
                    as="textarea"
                    className="bg-white shadow-none fs-20px border-0"
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
            </Col>
          </Row>
        </div>

        <div className="bg-white p-3">
          {(type === 'multiple' || type === 'single') && (
            <Row>
              {answers.map((_, key) => (
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
