import classNames from 'classnames'
import { Field, Form as FormikForm, Formik } from 'formik'
import _ from 'lodash'
import { FC, memo, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { TAnswer, TMatcherQuestion, TQuestion } from '../../../types/types'
import { QuestionType } from '../../IconQuestion/IconQuestion'
import MyButton from '../../MyButton/MyButton'
import MyInput from '../../MyInput/MyInput'
import ItemConjunctionAnswer from '../ItemConjunctionAnswer/ItemConjunctionAnswer'
import ItemMultipleAnswer from '../ItemMultipleAnswer/ItemMultipleAnswer'
import { defaultAnswer } from '../QuestionCreator.constants'
import HelpToolTip from '../../HelpToolTip/HelpToolTip'
import { questionTypeStyles } from '../../IconQuestion/IconQuestion'
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

    const sortedCorrectAnswers =
      answers
        ?.filter((answer) => answer.isCorrect)
        ?.sort((a, b) => {
          return a.orderPosition - b.orderPosition
        }) || []

    const sortedIncorrectAnswers =
      answers
        ?.filter((answer) => !answer.isCorrect && answer.type === '10TEXT')
        ?.sort((a, b) => {
          return a.orderPosition - b.orderPosition
        }) || []

    const [field, setField] = useState<string>("")
    const [needCreate, setNeedCreate] = useState<boolean>(true)

    return (
      <>
        <div className="bg-white p-3">
          <div className="fw-medium fs-22px mb-4">Soạn câu trả lời
            <HelpToolTip>
              {questionTypeStyles[type]?.description}
            </HelpToolTip>
          </div>
          {(type === 'multiple' || type === 'single' || type === 'poll') && (
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
                  <div className="bi bi-plus-circle-fill fs-1 mb-0 text-primary cursor-pointer" title='Thêm câu trả lời'/>
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
                  {fillAnswers.slice(0, !needCreate ? fillAnswers.length - 1 : fillAnswers.length).map((answer, key) => (
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
                      actions.setSubmitting(false)
                      actions.resetForm()
                      setField("")
                      setNeedCreate(true)
                    }}
                  >
                    {({ isSubmitting }) => (
                      <FormikForm className="d-flex w-100">
                        <Field
                          maxLength={100}
                          type="text"
                          value={field}
                          onChange={(e: any) => {
                            if (needCreate)
                              fillAnswers[fillAnswers.length] = e.target.value
                            else
                              fillAnswers[fillAnswers.length - 1] = e.target.value
                            setNeedCreate(false)
                            setFillAnswers(fillAnswers)
                            setField(e.target.value)
                          }}
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
            <div>
              <div className="fw-medium fs-22px mb-4">Nhập câu hoàn chỉnh 
              <HelpToolTip>
                Nhập hoàn chỉnh câu cần điền, hệ thống sẽ tự động tách các từ của câu này để lựa chọn
                </HelpToolTip></div>
              <Formik
                initialValues={{
                  sentence: sortedCorrectAnswers
                    .map((answer) => answer.answer)
                    .join(' '),
                }}
                onSubmit={(values, actions) => {
                  try {
                    let wordArray = values.sentence
                      .split(' ')
                      .filter((word) => word != '')
                    if (wordArray) {
                      let _answers: TAnswer[] = wordArray.map(
                        (value, index) =>
                        ({
                          ...defaultAnswer,
                          isCorrect: true,
                          type: '21PLHDR',
                          answer: value,
                          orderPosition: index,
                        } as TAnswer)
                      )
                      setAnswers([..._answers, ...sortedIncorrectAnswers])
                      actions.setSubmitting(false)
                    }
                  } catch (error) {
                    console.log('error', error)
                  }
                }}
              >
                {({ isSubmitting }) => (
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
                      {'Cập nhập'}
                    </MyButton>
                  </FormikForm>
                )}
              </Formik>
              <div className="fw-medium fs-22px mb-4">
                Chọn từ cần điền{' '}
                <span className={'fw-light text-secondary'}>(bấm để chọn)</span>
                <HelpToolTip>
                Chọn các từ để làm đáp án, hệ thống sẽ tự động xáo trộn các từ này ngẫu nhiên 
                để tạo thành các đáp án cho người chơi
                </HelpToolTip>
              </div>
              <Row className="fs-18px gx-2">
                {sortedCorrectAnswers.map((answer, key) => (
                  <Col
                    key={key}
                    xs="auto"
                    className="mb-2 position-relative"
                    onClick={() => {
                      answer.type =
                        answer.type === '21PLHDR' ? '10TEXT' : '21PLHDR'
                      setAnswers([...answers])
                    }}
                  >
                    <div
                      className={classNames(
                        'rounded-10px px-2 py-8px text-black user-select-none ',
                        {
                          'text-white': answer.type === '10TEXT',
                        }
                      )}
                      style={{
                        backgroundColor:
                          answer.type === '21PLHDR' ? '#ECECE466' : '#2E765E',
                      }}
                    >
                      <pre>{answer?.answer}</pre>
                    </div>
                    {answer.type === '10TEXT' && (
                      <div
                        className={'position-absolute'}
                        style={{
                          top: '-12px',
                          right: '-4px',
                        }}
                      >
                        <i
                          className={'bi bi-check-circle-fill text-success'}
                          style={{ fontSize: 16 }}
                        ></i>
                      </div>
                    )}
                  </Col>
                ))}
              </Row>
              <div className="fw-medium fs-22px mb-4">Thêm từ gây nhiễu 
              <HelpToolTip>
                Thêm các từ gây nhiễu để tăng độ khó cho câu hỏi, các từ này sẽ được xáo trộn lẫn giữa các đáp án
                </HelpToolTip></div>
              <Row
                className={'customScrollbar'}
                style={{
                  maxHeight: '40vh',
                  overflowY: 'auto',
                }}
              >
                {sortedCorrectAnswers
                  .filter((a) => a.type == '10TEXT')
                  .map((answer, key) => (
                    <Col key={key} xs="auto" className="mb-3">
                      <ItemConjunctionAnswer
                        currentIndex={key}
                        answer={answer}
                        correctIndexes={correctIndexes}
                        setCorrectIndexes={setCorrectIndexes}
                        setConjunctionAnswers={setAnswers}
                        onRemove={() => { }}
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
                            answer: '',
                            type: '10TEXT',
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
