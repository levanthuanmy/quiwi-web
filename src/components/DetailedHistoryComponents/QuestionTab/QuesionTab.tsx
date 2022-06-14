import classNames from 'classnames'
import { FC } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { TGameHistory } from '../../../types/types'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from '../../../utils/constants'
import styles from './QuestionTab.module.css'

const QuestionTab: FC<{ game: TGameHistory }> = ({ game }) => {
  const getNumCorrectAnswersOfPlayer = (questionId: number) => {
    let countCorrectAnswer = 0
    for (const player of game.players)
      for (const gameRound of player.gameRounds) {
        if (gameRound.question?.id === questionId) {
          countCorrectAnswer +=
            gameRound.score >= (gameRound.question?.score ?? 0) ? 1 : 0
        }
      }

    return (countCorrectAnswer / game.players.length) * 100
  }
  const regex = /<[^>]+>/g
  return (
    <Container fluid={true}>
      <Row className="fw-bold border-bottom  border-dark py-3  bg-light">
        <Col xs={6}>Câu hỏi</Col>
        <Col xs={4}>Loại câu hỏi</Col>
        <Col xs={2}>Phần trăm đúng</Col>
      </Row>
      {game.quiz.questions.map((question, idx) => {
        return (
          <Row key={idx} className={classNames('py-2', styles.questionRow)}>
            <Col xs={6} className="fw-medium">
              <span className="pe-3">{idx + 1}</span>{' '}
              {question.question.replaceAll(regex, '')}
            </Col>
            <Col xs={4}>
              {QUESTION_TYPE_MAPPING_TO_TEXT[question?.type ?? '10SG']}
            </Col>
            <Col xs={2}>
              {getNumCorrectAnswersOfPlayer(question.id ?? -1).toFixed(2)}
            </Col>
          </Row>
        )
      })}
    </Container>
  )
}

export default QuestionTab
