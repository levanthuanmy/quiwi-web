import classNames from 'classnames'
import { Field, Form as FormikForm, Formik } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import {
  Col,
  Dropdown,
  FloatingLabel,
  Form,
  Image,
  Modal,
  Row,
} from 'react-bootstrap'
import { post } from '../../libs/api'
import { TEditQuestion } from '../../pages/quiz/creator/[id]'
import {
  TAnswer,
  TApiResponse,
  TQuestion,
  TQuestionType,
  TQuiz,
} from '../../types/types'
import { MAPPED_QUESTION_TYPE, TIMEOUT_OPTIONS } from '../../utils/constants'
import {
  getUrl,
  storage,
  storageRef,
  uploadFile,
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

const defaultAnswer: TAnswer = {
  answer: '',
  isCorrect: false,
  orderPosition: 0,
  media: '',
  type: '20SELECTION',
}

const defaultQuestion: TQuestion = {
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
  score: 100,
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
  const [answers, setAnswers] = useState<TAnswer[]>([
    { ...defaultAnswer, orderPosition: 0 },
    { ...defaultAnswer, orderPosition: 1 },
    { ...defaultAnswer, orderPosition: 2 },
  ])
  const [newQuestion, setNewQuestion] = useState<TQuestion>(defaultQuestion)
  const type: QuestionType = isEditQuestion.isEdit
    ? MAPPED_QUESTION_TYPE[newQuestion?.type]
    : (router.query?.type?.toString() as QuestionType) || 'single'
  const [isScoreError, setIsScoreError] = useState<boolean>(false)

  useEffect(() => {
    if (isEditQuestion.isEdit) {
      const _ans = quiz?.questions.find(
        (question) => question.id === isEditQuestion.questionId
      )?.questionAnswers as TAnswer[]

      setNewQuestion(
        quiz?.questions.find(
          (question) => question.id === isEditQuestion.questionId
        ) as TQuestion
      )
      setAnswers(_ans)

      setFillAnswers(_ans?.map((an) => an.answer))
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
      if (type !== 'fill' && getCurrentTrueAnswer(answers) < 1) {
        alert('Bạn cần có ít nhất 1 câu trả lời là đúng')
        return
      }
      if (isScoreError) {
        alert('Điểm của câu hỏi cần nằm trong khoảng từ 0 đến 100')
        return
      }

      let _newQuestion: TQuestion = {
        ...newQuestion,
        questionAnswers: answers,
        type: isEditQuestion.isEdit
          ? newQuestion.type
          : (Object.keys(MAPPED_QUESTION_TYPE).find(
              (key) => _.get(MAPPED_QUESTION_TYPE, key) === type
            ) as TQuestionType),
        orderPosition: isEditQuestion.isEdit
          ? newQuestion.orderPosition
          : quiz.questions.length,
      }

      if (type === 'fill') {
        const _fillAnswer: TAnswer[] = fillAnswers.map((value, index) => ({
          answer: value,
          isCorrect: true,
          orderPosition: index,
          media: '',
          type: '10TEXT',
        }))

        _newQuestion['questionAnswers'] = [..._fillAnswer]
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

  const handleScoreInputChange = (e: any) => {
    const value = Number(e?.target?.value)
    console.log('handleScoreInputChange - value', value)
    const isValid = value >= 0 && value <= 100
    setIsScoreError(!isValid)
    setNewQuestion((prev) => ({
      ...prev,
      score: Number(e?.target?.value),
    }))
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
            <Col
              xs="12"
              md="auto"
              className="mb-3 mb-md-0 d-flex flex-column gap-2"
            >
              <QuestionConfigBtn
                prefixIcon={<IconQuestion type={type} />}
                title={
                  <div className="fw-medium text-dark">
                    {questionTypeStyles[type].title}
                  </div>
                }
                suffixIcon=""
              />

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
                />
              </div>

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

              <FloatingLabel
                controlId="floatingInput"
                label="Nhập điểm số (0 - 100)"
                className="fs-14px"
              >
                <Form.Control
                  type="number"
                  placeholder="Nhập điểm số (từ 0 đến 100)"
                  className={classNames('rounded-10px border', {
                    'border-danger border-2 shadow-none': isScoreError,
                  })}
                  min={0}
                  max={100}
                  value={newQuestion?.score}
                  onChange={handleScoreInputChange}
                />
              </FloatingLabel>
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
                    type={type}
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
                    defaultValue={_.get(newQuestion, 'matcher', '10EXC')}
                    onChange={(e) => {
                      setNewQuestion((prev) => ({
                        ...prev,
                        matcher: e.target.value,
                      }))
                    }}
                  >
                    <option value="10EXC">Chính xác</option>
                    <option value="20CNT">Chứa đựng</option>
                  </Form.Select>
                </Col>

                <Col>
                  {fillAnswers.map((answer, key) => (
                    <div key={key} className="d-flex mb-3 fw-medium w-100">
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
                      actions.resetForm()
                    }}
                  >
                    {({ isSubmitting }) => (
                      <FormikForm className="d-flex w-100">
                        <Field
                          type="text"
                          name="newAnswer"
                          placeholder="Nhập đáp án mới"
                          as={MyInput}
                          className="mb-3 w-100"
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
