import classNames from 'classnames'
import { FC } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { TDetailPlayer, TGameHistory } from '../../../types/types'
import styles from './PlayerTab.module.css'
const PlayerTab: FC<{ game: TGameHistory }> = ({ game }) => {
  const getNumCorrectAnswersOfPlayer = (player: TDetailPlayer) => {
    let countCorrectAnswer = 0
    for (const gameRound of player.gameRounds) {
      countCorrectAnswer += gameRound.isCorrect ? 1 : 0
    }

    return (countCorrectAnswer / player.gameRounds.length) * 100
  }

  return (
    <Container>
      <Row className="fw-bold border-bottom  border-dark  py-3  bg-light">
        <Col xs={4} md={2}>
          Xếp hạng
        </Col>
        <Col xs={8} md={4}>
          Tên người chơi
        </Col>
        <Col className="text-end d-none d-md-block">Phần trăm đúng</Col>
        <Col className="text-end d-none d-md-block">Điểm tổng kết</Col>
      </Row>
      {game.players.map((player, idx) => {
        return (
          <Row key={idx} className={classNames('py-2', styles.playerRow)}>
            <Col xs={4} md={2}>
              {idx + 1}
            </Col>
            <Col xs={8} md={4}>
              {player.nickname}
            </Col>
            <Col className="text-end d-none d-md-block">
              {getNumCorrectAnswersOfPlayer(player).toFixed(2)}
            </Col>
            <Col className="text-end d-none d-md-block">
              {player.score.toFixed(2)}
            </Col>
          </Row>
        )
      })}
    </Container>
  )
}

export default PlayerTab
