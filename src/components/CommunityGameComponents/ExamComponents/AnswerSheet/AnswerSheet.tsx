import classNames from 'classnames'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { usePracticeGameSession } from '../../../../hooks/usePracticeGameSession/usePracticeGameSession'
import MyModal from '../../../MyModal/MyModal'
import { UserAnswer } from '../ExamAnswerBoard/ExamAnswerBoard'

const AnswerSheet: FC<{
  userAnswers: UserAnswer[]
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>
  submit: () => void
  currentQuestionIndex: number
}> = ({
  userAnswers,
  setCurrentQuestionIndex,
  submit,
  currentQuestionIndex,
}) => {
  const [show, setShow] = useState<boolean>(false)

  const isAnswerQuestionAtIndex = (index: number): boolean => {
    if (userAnswers[index].answer.length > 0 || userAnswers[index].answerIds.length > 0) {
      return true
    }
    return userAnswers[index].answerIds.length > 0
  }

  return (
    <>
      <div
        className="position-fixed bg-white py-3 px-2 rounded-end-14px shadow-lg fs-14px cursor-pointer"
        style={{ left: 0, bottom: 16 }}
        onClick={() => setShow(true)}
      >
        <div className="bi bi-chevron-double-right mb-2"></div>
        <div className="" style={{ writingMode: 'vertical-rl' }}>
          Bảng câu hỏi
        </div>
      </div>

      <MyModal
        show={show}
        onHide={() => setShow(false)}
        header={<Modal.Title>Bảng câu hỏi</Modal.Title>}
        activeButtonCallback={submit}
        activeButtonTitle="Nộp bài"
      >
        <div className="mb-3">Bấm chọn câu hỏi bất kì để đi đến câu hỏi đó</div>

        <div className="fs-14px">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill text-primary" />
            Đã trả lời
          </div>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-x-circle-fill text-secondary" />
            Chưa trả lời
          </div>
        </div>

        <div className="d-flex w-100 flex-wrap">
          {userAnswers?.map((question, key) => (
            <div key={key} className="w-50 d-flex justify-content-center py-2">
              <div
                className={classNames(
                  'btn btn-outline-light text-dark d-flex align-items-center justify-content-center gap-2 fs-20px rounded-pill',
                  {
                    'border-primary': currentQuestionIndex === key,
                    'border-0': currentQuestionIndex !== key,
                  }
                )}
                onClick={() => setCurrentQuestionIndex(key)}
              >
                {key + 1}
                <div>
                  {isAnswerQuestionAtIndex(key) ? (
                    <i className="bi bi-check-circle-fill fs-24px text-primary" />
                  ) : (
                    <i className="bi bi-x-circle-fill fs-24px text-secondary" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </MyModal>
    </>
  )
}

export default React.memo(AnswerSheet)
