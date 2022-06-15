import classNames from 'classnames'
import { FC } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { TGameHistory } from '../../../types/types'
import { parseQuestionHTMLToRaw } from '../../../utils/helper'
import styles from './QuestionTab.module.css'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from '../../../utils/constants'
import QuestionAnswer from './QuestionAnswer'
import _ from 'lodash'

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

  const getNumCorrectAnswersOfPlayer = () => {
    let countCorrectAnswer = 0
    for (const player of gameHistory.players)
      for (const gameRound of player.gameRounds) {
        if (gameRound.question?.id === question.id) {
          countCorrectAnswer += gameRound.isCorrect ? 1 : 0
        }
      }

    return (countCorrectAnswer / gameHistory.players.length) * 100
  }

  const questionAnswers = question.questionAnswers

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
                  {getNumCorrectAnswersOfPlayer().toFixed(2)}% trả lời đúng
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
              <QuestionAnswer question={question} />
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
            {gameHistory.players.map((player) => {
              const gameRound = player.gameRounds.find(
                (gameRound) => gameRound.question?.id === question.id
              )
              if (!gameRound) return null
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
              return (
                <Row
                  key={player.nickname}
                  className={classNames('py-2', styles.playerStatisticRow)}
                >
                  <Col xs={6} md={3}>
                    {player.nickname}
                  </Col>
                  <Col className=" ">{isCorrect}</Col>
                  <Col className="d-none d-md-block ">{answers.join(', ')}</Col>

                  <Col className="text-end d-none d-md-block">
                    {gameRound.score.toFixed(2)}
                  </Col>
                </Row>
              )
            })}
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DetailedQuestionModal
