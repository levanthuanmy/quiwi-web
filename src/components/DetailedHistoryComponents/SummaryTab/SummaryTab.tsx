import _ from 'lodash'
import router from 'next/router'
import { FC } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { TGameHistory } from '../../../types/types'
import { calculateScorePercentages } from '../../../utils/exportToExcel'
import MyButton from '../../MyButton/MyButton'
import Pie from '../../Pie/Pie'

const SummaryTab: FC<{ game: TGameHistory }> = ({ game }) => {
  const correctPercentages = calculateScorePercentages(game)

  return (
    <Row >
      <Col>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={12} md={4} className="text-center">
                <Pie
                  percentage={Number(
                    _.get(correctPercentages, 'correctAnswersPercentage', 0)
                  )}
                  colour="#009883"
                />
                <div>Phần trăm trả lời chính xác</div>
              </Col>
              <Col className="text-center text-md-start pt-3 pt-md-0">
                <h2>Có công mài sắt có ngày nên kim!</h2>
                <p>Tiếp tục luyện tập để đạt được những thành tích tốt hơn</p>
                <MyButton
                  className="text-white px-3"
                  onClick={() => {
                    router.push(`/quiz/${game.quiz.id}/play`)
                  }}
                >
                  Chơi lại
                </MyButton>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} lg={3} className="pt-3 pt-lg-0">
        <Card className="h-100 ">
          <Card.Body className="d-flex justify-content-center flex-column">
            <div className="ps-2 d-flex justify-content-between">
              <div>
                <i className="bi bi-person pe-2 text-info"></i> Số người chơi{' '}
              </div>
              <div>{game.players.length}</div>
            </div>
            <hr></hr>
            <div className="ps-2 d-flex justify-content-between">
              <div>
                <i className="bi bi-question-circle pe-2 text-info"></i> Số câu
                hỏi
              </div>
              <div>{game.quiz.questions.length}</div>
            </div>
            <hr></hr>
            <div className="ps-2 d-flex justify-content-between">
              <div>
                <i className="bi bi-qr-code  pe-2 text-info"></i> Mã phòng
              </div>
              <div>{game.invitationCode}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default SummaryTab
