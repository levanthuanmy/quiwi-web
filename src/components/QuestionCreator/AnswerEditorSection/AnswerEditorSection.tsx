import {Formik, Field, Form as FormikForm} from 'formik'
import _ from 'lodash'
import {FC, memo, useState} from 'react'
import {Row, Col, Form} from 'react-bootstrap'
import {TAnswer, TQuestion, TMatcherQuestion} from '../../../types/types'
import {QuestionType} from '../../IconQuestion/IconQuestion'
import ItemMultipleAnswer from '../ItemMultipleAnswer/ItemMultipleAnswer'
import MyButton from '../../MyButton/MyButton'
import MyInput from '../../MyInput/MyInput'
import {defaultAnswer} from '../QuestionCreator.constants'
import ItemConjunctionAnswer from '../ItemConjunctionAnswer/ItemConjunctionAnswer'
import {ANSWER_COLORS} from '../../../utils/constants'
import classNames from 'classnames'
import {width} from "dom-helpers";

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
  console.log("=>(AnswerEditorSection.tsx:41) answers", answers);
  const sortedCorrectAnswers = answers.filter(answer => answer.isCorrect).sort((a, b) => {
    return a.orderPosition - b.orderPosition
  })

  const sortedIncorrectAnswers = answers.filter(answer => (!answer.isCorrect && answer.type === "10TEXT")).sort((a, b) => {
    return a.orderPosition - b.orderPosition
  })

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
                    {...defaultAnswer, orderPosition: prev.length},
                  ])
                }
              >
                <div className="bi bi-plus-circle-fill fs-1 mb-0 text-primary cursor-pointer"/>
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
                  style={{height: 50}}
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
                      <i className="bi bi-trash"/>
                    </MyButton>
                  </div>
                ))}

                <Formik
                  initialValues={{newAnswer: ''}}
                  onSubmit={(values, actions) => {
                    if (values.newAnswer.length) {
                      setFillAnswers([...fillAnswers, values.newAnswer])
                    }
                    actions.setSubmitting(false)
                    actions.resetForm()
                  }}
                >
                  {({isSubmitting}) => (
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
                        <i className="bi bi-plus-lg"/>
                      </MyButton>
                    </FormikForm>
                  )}
                </Formik>
              </Col>
            </Row>
          </div>
        )}

        {type === 'conjunction' && (
          <div>
            <div className="fw-medium fs-22px mb-4">Nhập câu hoàn chỉnh:</div>
            <Formik
              initialValues={{sentence: sortedCorrectAnswers.map(answer => answer.answer).join(" ")}}
              onSubmit={(values, actions) => {
                let wordArray = values.sentence.split(" ").filter(word => word != "")
                if (wordArray) {
                  let _answers: TAnswer[] = wordArray.map((value, index) => ({
                    ...defaultAnswer,
                    isCorrect: true,
                    type: '21PLHDR',
                    answer: value,
                    orderPosition: index
                  } as TAnswer))
                  setAnswers([..._answers, ...sortedIncorrectAnswers])
                  actions.setSubmitting(false)
                }
              }}
            >
              {({isSubmitting}) => (
                <FormikForm className="d-flex w-100">
                  <Field
                    maxLength={1000}
                    type="text"
                    name="sentence"
                    placeholder="Nhập câu hoàn chỉnh"
                    as={MyInput}
                    className="mb-3 w-100"
                  />

                  <MyButton
                    className="ms-3 text-white text-nowrap"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {"Cập nhập"}
                  </MyButton>
                </FormikForm>
              )}
            </Formik>
            <div className="fw-medium fs-22px mb-4">Chọn từ cần điền <span className={"fw-light text-secondary"}>(bấm để chọn)</span>:
            </div>
            <Row className="fs-18px gx-2">
              {sortedCorrectAnswers.map((answer, key) => (
                <Col key={key}
                     xs="auto"
                     className="mb-2 position-relative"
                     onClick={() => {
                       answer.type = answer.type === '21PLHDR' ? '10TEXT' : '21PLHDR'
                       setAnswers([...answers])
                     }}>
                  <div
                    className={classNames('rounded-10px px-2 py-8px text-black user-select-none ', {
                      "text-white": answer.type === '10TEXT'
                    })}
                    style={{
                      backgroundColor:
                        answer.type === '21PLHDR'
                          ? '#ECECE466'
                          : "#2E765E",
                    }}
                  >
                    <pre>{answer?.answer}</pre>
                  </div>
                  {
                    answer.type === '10TEXT' &&
                      <div className={"position-absolute"}
                           style={{
                             top: "-12px",
                             right: "-4px",
                           }}>
                          <i className={"bi bi-check-circle-fill text-success"} style={{fontSize: 16}}></i>
                      </div>
                  }
                </Col>
              ))}
            </Row>
            <div className="fw-medium fs-22px mb-4">Thêm từ gây nhiễu:</div>
            <Row
              className={"customScrollbar"}
              style={{
                maxHeight: "40vh",
                overflowY: "auto"
              }}>
              {sortedCorrectAnswers.filter(a => a.type == "10TEXT").map((answer, key) => (
                <Col key={key} xs="auto" className="mb-3">
                  <ItemConjunctionAnswer
                    currentIndex={key}
                    answer={answer}
                    correctIndexes={correctIndexes}
                    setCorrectIndexes={setCorrectIndexes}
                    setConjunctionAnswers={setAnswers}
                    onRemove={() => {
                    }}
                    couldDelete={false}
                  />
                </Col>
              ))}
              {sortedIncorrectAnswers.map((answer, key) => (
                <Col key={key} xs="auto" className="mb-3">
                  <ItemConjunctionAnswer
                    currentIndex={key}
                    answer={answer}
                    correctIndexes={correctIndexes}
                    setCorrectIndexes={setCorrectIndexes}
                    setConjunctionAnswers={setAnswers}
                    onRemove={() => {
                      let answerIndex = answers.indexOf(answer)
                      if (answerIndex >= 0) removeAnswerAtIndex(answerIndex)
                    }}
                    couldDelete={true}
                  />
                </Col>
              ))}
              {answers.length < 150 && (
                <Col xs="auto" className="my-auto">
                  <div
                    className="bi bi-plus-circle-fill fs-24px mb-0 text-primary cursor-pointer d-flex align-items-center gap-2 pb-3"
                    onClick={() =>
                      setAnswers((prev) => [
                        ...prev,
                        {
                          ...defaultAnswer,
                          isCorrect: false,
                          orderPosition: prev.length,
                          answer: "",
                          type: "10TEXT"
                        } as TAnswer,
                      ])
                    }
                  >
                    <span className="fs-18px">Thêm lựa chọn</span>
                  </div>
                </Col>
              )}
            </Row>
          </div>
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
