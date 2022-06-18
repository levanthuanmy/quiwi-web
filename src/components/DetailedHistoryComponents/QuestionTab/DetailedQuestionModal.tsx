import { FC } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { TGameHistory } from '../../../types/types'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from '../../../utils/constants'
import { parseQuestionHTMLToRaw } from '../../../utils/helper'
import { getNumCorrectAnswersOfPlayer } from '../../../utils/statistic-calculation'
import { PlayerStatisticList } from './PlayerStatisticList'
import QuestionAnswerStatistic from './QuestionAnswer'

const DetailedQuestionModal: FC<{
  gameHistory: TGameHistory
  show: boolean
  onHide: () => void
  index: number
}> = ({ gameHistory, show, onHide, index }) => {
  const question = gameHistory.quiz.questions[index]

  const gameRoundStatistic = gameHistory.gameRoundStatistics.find(
    (g) => g.roundNumber === question.orderPosition
  )!

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
            <i className="bi bi-question-circle  pe-2"></i>
          </div>
          <div>Câu hỏi {index + 1}</div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2 pb-3">
        <div className="p-2">
          <Row>
            <Col>
              <span className="pe-2 ">{index + 1}.</span>
              <span className="fw-medium ">
                {parseQuestionHTMLToRaw(question.question)}{' '}
              </span>
            </Col>
            {/* Thông tin chung của Question */}
            <Col xs={4} className="">
              <div className="d-flex border-bottom border-secondary pb-2">
                <div>
                  {QUESTION_TYPE_MAPPING_TO_TEXT[question?.type ?? '10SG']}
                </div>
              </div>
              <div className="d-flex border-bottom border-secondary py-2">
                <div>Thời gian làm {question.duration} giây</div>
              </div>
              <div className="d-flex border-bottom border-secondary py-2">
                <div>
                  {getNumCorrectAnswersOfPlayer(
                    gameRoundStatistic,
                    gameHistory.players.length
                  ).toFixed(2)}
                  % trả lời đúng
                </div>
              </div>
            </Col>
          </Row>

          <Row className="bg-light my-2 py-3">
            <Col xs={4}>
              <div
                className="h-100"
                style={{
                  backgroundImage: `url(
                    ${question.media || '/assets/default-question-image.png'}
                  )`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '140px',
                }}
              />
            </Col>
            {/* Thông tin các câu trả lời theo hàng */}
            <Col>
              <QuestionAnswerStatistic question={question} />
            </Col>
          </Row>

          <Row className="py-3 px-2">
            <Row className="fw-bold border-bottom  border-dark  py-3  bg-light">
              <Col xs={6} md={3}>
                Tên người chơi
              </Col>
              <Col className=" ">Kết quả</Col>
              <Col className="d-none d-md-block ">Câu trả lời</Col>

              <Col className="text-end d-none d-md-block">Điểm nhận được</Col>
            </Row>
            <PlayerStatisticList
              gameHistory={gameHistory}
              questionId={question.id ?? 0}
            />
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DetailedQuestionModal
