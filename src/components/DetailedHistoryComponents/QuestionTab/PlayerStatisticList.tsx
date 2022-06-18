import classNames from 'classnames'
import _ from 'lodash'
import { FC } from 'react'
import { Row, Col } from 'react-bootstrap'
import { TGameHistory } from '../../../types/types'
import { getAnswerResultText } from '../../../utils/statistic-calculation'
import styles from './QuestionTab.module.css'

export const PlayerStatisticList: FC<{
  gameHistory: TGameHistory
  questionId: number
}> = ({ gameHistory, questionId }) => {
  return (
    <>
      {gameHistory.players.map((player) => {
        const gameRound = player.gameRounds.find(
          (gameRound) => gameRound.question?.id === questionId
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

        return (
          <Row
            key={player.nickname}
            className={classNames('py-2', styles.playerStatisticRow)}
          >
            <Col xs={6} md={3}>
              {player.nickname}
            </Col>
            <Col className=" ">{getAnswerResultText(gameRound)}</Col>
            <Col className="d-none d-md-block ">{answers.join(', ')}</Col>

            <Col className="text-end d-none d-md-block">
              {gameRound.score.toFixed(2)}
            </Col>
          </Row>
        )
      })}
    </>
  )
}
