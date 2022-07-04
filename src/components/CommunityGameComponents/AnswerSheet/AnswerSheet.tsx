import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { usePracticeGameSession } from '../../../hooks/usePracticeGameSession/usePracticeGameSession'
import MyModal from '../../MyModal/MyModal'

const AnswerSheet = () => {
  const [show, setShow] = useState<boolean>(false)
  const { gameSession } = usePracticeGameSession()

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
      >
        <div>
          <div className="d-flex align-items-center justify-content-around gap-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill fs-24px text-primary" />
              Đã trả lời
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-x-circle-fill fs-24px text-secondary" />
              Chưa trả lời
            </div>
          </div>

          {gameSession?.quiz?.questions?.map((question, key) => (
            <div key={key} className="">
              {key + 1}
            </div>
          ))}
        </div>
      </MyModal>
    </>
  )
}

export default React.memo(AnswerSheet)
