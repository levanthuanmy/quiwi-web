import classNames from 'classnames'
import _ from 'lodash'
import { FC } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { TDetailPlayer } from '../../../types/types'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from '../../../utils/constants'
import { parseQuestionHTMLToRaw } from '../../../utils/helper'
import MyModal from '../../MyModal/MyModal'

const DetailedPlayerModal: FC<{
  player: TDetailPlayer
  show: boolean
  onHide: () => void
}> = ({ player, show, onHide }) => {
  return (
    <Modal
      centered
      onHide={() => onHide()}
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      contentClassName="rounded-20px overflow-hidden"
      // fullscreen="lg-down"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="d-flex align-items-center">
          <div>
            <i className="bi bi-person pe-2"></i>
          </div>

          <div>{player.nickname}</div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-4">
        <Row className="fw-bold border-bottom  border-dark  py-3  bg-light">
          <Col xs={8} lg={4}>Câu hỏi</Col>
          <Col lg={3} className="d-none d-lg-flex">
            Loại câu hỏi
          </Col>
          <Col lg={2} xl={3} className="d-none d-lg-flex">
            Câu trả lời
          </Col>
          <Col className="text-center" xs={4} lg={2} xl={1}>
            Đúng/Sai
          </Col>
          <Col lg={1} className="d-none d-lg-flex">
            Điểm
          </Col>
        </Row>
        {player.gameRounds.map((gameRound, idx) => {
          const answers = []

          if (!_.isEmpty(gameRound.selectionAnswers)) {
            for (const index in gameRound.selectionAnswers) {
              answers.push(gameRound.selectionAnswers[index].answer)
            }
          } else if (gameRound.answer) {
            answers.push(gameRound.answer)
          }

          let isCorrect = ''
          if (gameRound.isCorrect) {
            isCorrect = 'Đúng'
          } else if (!gameRound.answer && _.isEmpty(gameRound.answerIds)) {
            isCorrect = 'Không trả lời'
          } else {
            isCorrect = 'Sai'
          }
          const question = parseQuestionHTMLToRaw(gameRound.question?.question || '')
          return (
            <Row key={idx} className="border py-2">
              <Col xs={8} lg={4} title={question}>
                <span className="pe-3">{idx + 1}</span>{' '}
                {question}
              </Col>
              <Col lg={3} className="d-none d-lg-flex">
                {
                  QUESTION_TYPE_MAPPING_TO_TEXT[
                    gameRound.question?.type ?? '10SG'
                  ]
                }
              </Col>
              <Col
                lg={2} xl={3}
                className="d-none d-lg-flex"
                title={answers.join(', ')}
              >
                {answers.join(', ')}
              </Col>
              <Col className="text-center" xs={4} lg={2} xl={1}>
                {isCorrect}
              </Col>
              <Col lg={1} className="d-none d-lg-flex">
                {gameRound.score}
              </Col>
            </Row>
          )
        })}
      </Modal.Body>
    </Modal>
  )
}

export default DetailedPlayerModal
