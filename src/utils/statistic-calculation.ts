import _ from 'lodash'
import {
  TGameHistory,
  TGameRound,
  TGameRoundStatistic,
  TQuestion,
} from '../types/types'

export const getNumCorrectAnswersOfPlayer = (
  gameRoundStatistic: TGameRoundStatistic,
  numPlayers: number
) => {
  // let countCorrectAnswer = 0
  // for (const player of gameHistory.players)
  //   for (const gameRound of player.gameRounds) {
  //     if (gameRound.question?.id === question.id) {
  //       countCorrectAnswer += gameRound.isCorrect ? 1 : 0
  //     }
  //   }

  return (
    ((gameRoundStatistic?.numberOfCorrectAnswers ?? 0) / (numPlayers || 1)) *
    100
  )
}

/**
 * Lấy kết quả của câu trả lời => Đúng / Sai / Không trả lời
 */
export const getAnswerResultText = (gameRound: TGameRound) => {
  let isCorrect = ''
  if (!gameRound){
    return ''
  }
  if (gameRound.question?.type === '31ESSAY') {
    return isCorrect
  }
  if (gameRound.isCorrect) {
    isCorrect = 'Đúng'
  } else if (!gameRound.answer && _.isEmpty(gameRound.answerIds)) {
    isCorrect = 'Không trả lời'
  } else {
    isCorrect = 'Sai'
  }

  return isCorrect
}
