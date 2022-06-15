import _ from 'lodash'
import { FC } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { TDetailPlayer } from '../../../types/types'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from '../../../utils/constants'
import { parseQuestionHTMLToRaw } from '../../../utils/helper'
import Pie from '../../Pie/Pie'

const DetailedPlayerModal: FC<{
  player: TDetailPlayer
  show: boolean
  onHide: () => void
  rank: number
}> = ({ player, show, onHide, rank }) => {
  let correctPercentages = 0

  for (const gameRound of player.gameRounds) {
    if (gameRound.isCorrect) correctPercentages++
  }
  let percentage =
    Number(correctPercentages / (player.gameRounds.length || 1)) * 100
  return (
    <Modal
      centered
      onHide={() => onHide()}
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      contentClassName="rounded-20px overflow-hidden"
      fullscreen="lg-down"
    >
      <Modal.Header closeButton className="">
        <Modal.Title className="d-flex align-items-center">
          <div>
            <i className="bi bi-person pe-2"></i>
          </div>

          <div>{player.nickname}</div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2 pb-3">
        <Row className=" ">
          <Col xs={5} lg={4} className="text-center">
            <Pie percentage={percentage} colour="#009883" />
          </Col>
          <Col xs={7} lg={6} className="py-3">
            <div className="ps-2 py-2 border-bottom-2 border-bottom border-secondary">
              <b>Hạng:</b> {rank}
            </div>

            <div className="ps-2 py-2  border-bottom border-secondary">
              <b>Tổng điểm:</b> {player.score.toFixed(2)}
            </div>
          </Col>
        </Row>
        <div className="p-2">
          <Row className="fw-bold border-bottom  border-dark  py-3 px-2 bg-light">
            <Col xs={8} lg={4}>
              Câu hỏi
            </Col>
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
            const question = parseQuestionHTMLToRaw(
              gameRound.question?.question || ''
            )
            return (
              <Row key={idx} className="border p-2 ">
                <Col xs={8} lg={4} title={question}>
                  <span className="pe-3">{idx + 1}</span> {question}
                </Col>
                <Col lg={3} className="d-none d-lg-flex">
                  {
                    QUESTION_TYPE_MAPPING_TO_TEXT[
                      gameRound.question?.type ?? '10SG'
                    ]
                  }
                </Col>
                <Col
                  lg={2}
                  xl={3}
                  className="d-none d-lg-flex"
                  title={answers.join(', ')}
                >
                  {answers.join(', ')}
                </Col>
                <Col className="text-center" xs={4} lg={2} xl={1}>
                  {isCorrect}
                </Col>
                <Col lg={1} className="d-none d-lg-flex">
                  {gameRound.score.toFixed(2)}
                </Col>
              </Row>
            )
          })}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DetailedPlayerModal
