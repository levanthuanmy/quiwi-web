import { Formik, Field, Form as FormikForm } from 'formik'
import _ from 'lodash'
import { FC, memo, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { TAnswer, TQuestion, TMatcherQuestion } from '../../../types/types'
import { QuestionType } from '../../IconQuestion/IconQuestion'
import ItemMultipleAnswer from '../ItemMultipleAnswer/ItemMultipleAnswer'
import MyButton from '../../MyButton/MyButton'
import MyInput from '../../MyInput/MyInput'
import { defaultAnswer } from '../QuestionCreator.constants'
import ItemConjunctionAnswer from '../ItemConjunctionAnswer/ItemConjunctionAnswer'
import { ANSWER_COLORS } from '../../../utils/constants'
import classNames from 'classnames'

const AnswerEditorSection: FC<{
  type: QuestionType
  answers: TAnswer[]
  setAnswers: React.Dispatch<React.SetStateAction<TAnswer[]>>
  removeAnswerAtIndex: (index: number) => void
  setNewQuestion: (value: React.SetStateAction<TQuestion>) => void
  newQuestion: TQuestion
  fillAnswers: string[]
  setFillAnswers: (value: React.SetStateAction<string[]>) => void
  correctIndexes: number[]
  setCorrectIndexes: React.Dispatch<React.SetStateAction<number[]>>
  // eslint-disable-next-line react/display-name
}> = ({
  type,
  answers,
  setAnswers,
  removeAnswerAtIndex,
  setNewQuestion,
  newQuestion,
  fillAnswers,
  setFillAnswers,
  correctIndexes,
  setCorrectIndexes,
}) => {
  return (
    <>
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
                      matcher: e.target.value as TMatcherQuestion,
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
                        maxLength={100}
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

        {type === 'conjunction' && (
          <>
            <Row>
              {answers.map((answer, key) => (
                <Col key={key} xs="auto" className="mb-3">
                  <ItemConjunctionAnswer
                    currentIndex={key}
                    conjunctionAnswers={answers}
                    correctIndexes={correctIndexes}
                    setCorrectIndexes={setCorrectIndexes}
                    setConjunctionAnswers={setAnswers}
                    onRemove={() => removeAnswerAtIndex(key)}
                  />
                </Col>
              ))}
              {answers.length < 10 && (
                <Col xs="auto" className="my-auto">
                  <div
                    className="bi bi-plus-circle-fill fs-24px mb-0 text-primary cursor-pointer d-flex align-items-center gap-2 pb-3"
                    onClick={() =>
                      setAnswers((prev) => [
                        ...prev,
                        { ...defaultAnswer, orderPosition: prev.length },
                      ])
                    }
                  >
                    <span className="fs-18px">Thêm lựa chọn</span>
                  </div>
                  <div
                    className="bi bi-plus-circle-fill fs-24px mb-0 text-secondary cursor-pointer d-flex align-items-center gap-2"
                    onClick={() => {
                      const _ans: TAnswer[] = [
                        ...answers,
                        {
                          ...defaultAnswer,
                          isCorrect: true,
                          type: '21PLHDR',
                        },
                      ]
                      setAnswers(_ans)
                      setCorrectIndexes((prev) => [...prev, _ans.length - 1])
                    }}
                  >
                    <span className="fs-18px">Thêm từ đệm</span>
                  </div>
                </Col>
              )}
            </Row>
            <div className="fw-medium fs-22px mt-5 mb-4">Xem trước đáp án</div>
            <Row className="fs-18px">
              {correctIndexes.map((item, key) => (
                <Col key={key} xs="auto" className="mb-3">
                  <div
                    className={classNames('rounded-pill px-3 py-1 text-white', {
                      'border border-5': answers[item]?.type === '21PLHDR',
                    })}
                    style={{
                      backgroundColor:
                        answers[item].type === '21PLHDR'
                          ? 'gray'
                          : ANSWER_COLORS[key % ANSWER_COLORS.length],
                    }}
                  >
                    {answers[item]?.answer}
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        {type === 'essay' && (
          <div className="fs-32px text-secondary text-center">
            Câu trả lời của người tham gia sẽ được nhập ở đây
          </div>
        )}
      </div>
    </>
  )
}

export default memo(AnswerEditorSection)
