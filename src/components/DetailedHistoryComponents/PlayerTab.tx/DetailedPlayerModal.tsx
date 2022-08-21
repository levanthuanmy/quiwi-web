import _ from 'lodash'
import { FC } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { TDetailPlayer } from '../../../types/types'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from '../../../utils/constants'
import { getPlayerFinalScore } from '../../../utils/exportToExcel2'
import { parseQuestionHTMLToRaw, renderPercentage } from '../../../utils/helper'
import Pie from '../../Pie/Pie'

const DetailedPlayerModal: FC<{
  player: TDetailPlayer
  show: boolean
  onHide: () => void
  rank: number
}> = ({ player, show, onHide, rank }) => {
  const data = getPlayerFinalScore(player, rank)
  const correctAnswers = data[3]

  const percentage =
    (Number(correctAnswers) / (player?.gameRounds?.length || 1)) * 100
  const finalScoreOn10 = data[5]
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
        <Row className="align-items-center">
          <Col xs={5} lg={4} className="text-center">
            <Pie percentage={percentage} colour="#009883" />
          </Col>
          <Col xs={7} lg={6} className="py-3">
            <div className="ps-2 py-2 border-bottom-2 border-bottom border-secondary">
              <b>Hạng:</b> {rank}
            </div>

            <div className="ps-2 py-2  border-bottom border-secondary">
              <b>Số câu đúng:</b> {correctAnswers} /{' '}
              {player?.gameRounds?.length} câu
            </div>

            <div className="ps-2 py-2  border-bottom border-secondary">
              <b>Tổng điểm:</b> {renderPercentage(player.score)}
            </div>

            <div className="ps-2 py-2  border-bottom border-secondary">
              <b>Tổng điểm trên thang 10:</b> {finalScoreOn10}
            </div>
          </Col>
        </Row>
        <div className="p-2 d-flex flex-column  flex-nowrap overflow-x-scroll ">
          <Row className="fw-bold bg-light    flex-nowrap">
            <Col
              xs={8}
              lg={4}
              className=" py-3 bg-light border-bottom  border-dark "
            >
              Câu hỏi
            </Col>
            <Col
              lg={3}
              className="d-none d-lg-flex   py-3 bg-light border-bottom  border-dark "
            >
              Loại câu hỏi
            </Col>
            <Col
              xs={3}
              lg={2}
              xl={3}
              className="d-flex  py-3 bg-light border-bottom  border-dark "
            >
              Câu trả lời
            </Col>
            <Col
              className="text-center  py-3 bg-light border-bottom  border-dark "
              xs={3}
              lg={2}
              xl={1}
            >
              Đúng/Sai
            </Col>
            <Col
              xs={2} lg={1}
              className="d-flex  py-3 bg-light border-bottom  border-dark "
            >
              Điểm
            </Col>
          </Row>
          {player?.gameRounds?.map((gameRound, idx) => {
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
              <Row key={idx} className="flex-nowrap">
                <Col
                  xs={8}
                  lg={4}
                  title={question}
                  className="py-2  border-bottom "
                >
                  <span className="pe-3">{idx + 1}</span> {question}
                </Col>
                <Col lg={3} className="d-none d-lg-flex py-2 border-bottom ">
                  {
                    QUESTION_TYPE_MAPPING_TO_TEXT[
                      gameRound.question?.type ?? '10SG'
                    ]
                  }
                </Col>
                <Col
                  xs={3}
                  lg={2}
                  xl={3}
                  className="d-flex  border-bottom py-2"
                  title={answers.join(', ')}
                >
                  {answers.join(', ')}
                </Col>
                <Col
                  className="text-center border-bottom py-2 "
                  xs={3}
                  lg={2}
                  xl={1}
                >
                  {isCorrect}
                </Col>
                <Col xs={2} lg={1} className="d-flex  border-bottom py-2 ">
                  {gameRound.score?.toFixed(2)}
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
