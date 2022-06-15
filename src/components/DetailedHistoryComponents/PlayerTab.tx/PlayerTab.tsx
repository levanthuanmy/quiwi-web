import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { TDetailPlayer, TGameHistory } from '../../../types/types'
import DetailedPlayerModal from './DetailedPlayerModal'
import styles from './PlayerTab.module.css'
const PlayerTab: FC<{ game: TGameHistory }> = ({ game }) => {
  const [showDetailedPlayerModal, setShowDetailedPlayerModal] = useState(false)
  const [playerIndexChosen, setPlayerIndexChosen] = useState<number>()
  const getNumCorrectAnswersOfPlayer = (player: TDetailPlayer) => {
    let countCorrectAnswer = 0
    for (const gameRound of player.gameRounds) {
      countCorrectAnswer += gameRound.isCorrect ? 1 : 0
    }

    return (countCorrectAnswer / player.gameRounds.length) * 100
  }
  useEffect(() => {
    console.log(playerIndexChosen)
  }, [playerIndexChosen])

  return (
    <Container fluid={true}>
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
          <div key={idx}>
            <Row
              className={classNames('py-2', styles.playerRow)}
              onClick={() => {
                setPlayerIndexChosen(idx)
                setShowDetailedPlayerModal(true)
              }}
            >
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
          </div>
        )
      })}
      {playerIndexChosen != null ? (
        <DetailedPlayerModal
          show={showDetailedPlayerModal}
          onHide={() => setShowDetailedPlayerModal(false)}
          player={game.players[playerIndexChosen]}
          rank={playerIndexChosen + 1}
        />
      ) : null}
    </Container>
  )
}

export default PlayerTab
