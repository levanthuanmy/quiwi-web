require('dayjs/locale/vi')
import _ from 'lodash'
import * as XLSX from 'xlsx'
import { TAnswer, TDetailPlayer, TGameHistory } from '../types/types'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from './constants'
import { formatDate_DDMMMMYYYY, formatDate_DDMMYYYY } from './helper'

// include correct answers percentage, timeout submission
const calculateScorePercentages = (game: TGameHistory) => {
  let countCorrectAnswers = 0
  let countTimeoutSubmission = 0
  for (const gameRoundStatistic of game.gameRoundStatistics) {
    let correctAnswer = gameRoundStatistic.numberOfCorrectAnswers
    countCorrectAnswers += correctAnswer / (game.players.length || 1)

    let timeoutSubmission = gameRoundStatistic.numberOfTimeout
    countTimeoutSubmission += timeoutSubmission / (game.players.length || 1)
  }

  return {
    correctAnswersPercentage: (
      countCorrectAnswers / (game.gameRoundStatistics.length || 1)
    ).toFixed(2),
    timeoutSubmissionPercentage: (
      countTimeoutSubmission / (game.gameRoundStatistics.length || 1)
    ).toFixed(2),
  }
}

const generateOverviewInformation = (game: TGameHistory) => {
  const overviewWorkSheet: XLSX.WorkSheet = {}
  const merge = [
    {
      // From A1 -> H1
      s: { r: 0, c: 0 },
      e: { r: 0, c: 8 },
    },
    {
      // From A2 -> D2
      s: { r: 1, c: 0 },
      e: { r: 1, c: 3 },
    },
    {
      // From E2 -> H2
      s: { r: 1, c: 4 },
      e: { r: 1, c: 8 },
    },

    {
      // From A3 -> D3
      s: { r: 2, c: 0 },
      e: { r: 2, c: 3 },
    },
    {
      // From E3 -> H3
      s: { r: 2, c: 4 },
      e: { r: 2, c: 8 },
    },

    {
      // From A4 -> D4
      s: { r: 3, c: 0 },
      e: { r: 3, c: 3 },
    },
    {
      // From E4 -> H4
      s: { r: 3, c: 4 },
      e: { r: 3, c: 8 },
    },

    {
      // From A5 -> D5
      s: { r: 4, c: 0 },
      e: { r: 4, c: 3 },
    },
    {
      // From E5 -> H5
      s: { r: 4, c: 4 },
      e: { r: 4, c: 8 },
    },
    {
      // From A6 -> H6
      s: { r: 5, c: 0 },
      e: { r: 5, c: 8 },
    },
    {
      // From A7 -> H7
      s: { r: 6, c: 0 },
      e: { r: 6, c: 8 },
    },
    {
      // From A8 -> D8
      s: { r: 7, c: 0 },
      e: { r: 7, c: 3 },
    },
    {
      // From E8 -> H8
      s: { r: 7, c: 4 },
      e: { r: 7, c: 8 },
    },

    {
      // From A9 -> D9
      s: { r: 8, c: 0 },
      e: { r: 8, c: 3 },
    },
    {
      // From E9 -> H9
      s: { r: 8, c: 4 },
      e: { r: 8, c: 8 },
    },

    {
      // From E11 -> H11
      s: { r: 10, c: 0 },
      e: { r: 10, c: 8 },
    },
  ]
  overviewWorkSheet['!merges'] = merge
  XLSX.utils.sheet_add_aoa(
    overviewWorkSheet,
    [
      // Row 1
      [
        {
          t: 's',

          v: game.quiz.title,
        },
      ],
      // Row 2
      [
        {
          t: 's',
          v: 'Chủ phòng',
        },
        {},
        {},
        {},
        {
          v: game.host?.name || game.host?.username,
        },
      ],
      // Row 3
      [
        {
          t: 's',

          v: 'Ngày làm bài',
        },
        {},
        {},
        {},
        {
          v: formatDate_DDMMMMYYYY(game.createdAt),
        },
      ],
      // Row 4
      [
        {
          t: 's',

          v: 'Số người chơi',
        },
        {},
        {},
        {},
        {
          t: 's',
          v: `${game.players.length} người chơi`,
        },
      ],

      // Row 5
      [
        {
          t: 's',

          v: 'Mã phòng',
        },
        {},
        {},
        {},
        {
          t: 's',
          v: `${game.invitationCode}`,
        },
      ],
    ],
    { origin: 'A1' }
  )

  const percentages = calculateScorePercentages(game)
  // Add percentages
  XLSX.utils.sheet_add_aoa(
    overviewWorkSheet,
    [
      // Row 1
      [
        {
          t: 's',
          v: 'Tổng quan',
        },
      ],
      // Row 2
      [
        {
          t: 's',
          v: 'Sô phần trăm trả lời đúng',
        },
        {},
        {},
        {},
        {
          v: percentages.correctAnswersPercentage,
        },
      ],
      // Row 3
      [
        {
          t: 's',

          v: 'Sô phần trăm chưa trả lời (trễ giờ)',
        },
        {},
        {},
        {},
        {
          v: percentages.timeoutSubmissionPercentage,
        },
      ],
      [],
      [
        {
          t: 's',
          v: 'Chuyển sang các Sheet sau để xem kết quả từng câu',
        },
      ],
    ],
    { origin: 'A7' }
  )
  overviewWorkSheet['A1'].style = {
    font: { sz: 16, bold: true, color: '#FF00FF' },
  }
  return overviewWorkSheet
}

const getPlayerFinalScore = (player: TDetailPlayer, rank: number) => {
  const res: Record<string, number | string> = {}
  res['rank'] = rank + 1
  res['player'] = player.nickname
  res['score'] = player['score']
  let correctAnswer = 0
  const totalAnswers = player.gameRounds.length
  for (const gameRound of player.gameRounds) {
    if (gameRound.score === gameRound.question?.score || gameRound.score > 0) {
      correctAnswer++
    }
  }

  res['correctAnswers'] = correctAnswer
  res['incorrectAnswers'] = totalAnswers - correctAnswer

  return res
}

const generateFinalScoreSheet = (game: TGameHistory) => {
  const ws: XLSX.WorkSheet = {}

  const merge = [
    {
      // From A1 -> H1
      s: { r: 0, c: 0 },
      e: { r: 0, c: 8 },
    },
    {
      // From A2 -> H2
      s: { r: 1, c: 0 },
      e: { r: 1, c: 8 },
    },
  ]

  ws['!merges'] = merge

  XLSX.utils.sheet_add_aoa(ws, [
    // Row 1
    [
      {
        t: 's',

        v: game.quiz.title,
      },
    ],
    [
      {
        v: 'Điểm tổng kết',
      },
    ],
    [
      {
        v: 'Xếp hạng',
      },
      {
        v: 'Tên người chơi',
      },
      {
        v: 'Tổng điểm',
      },
      {
        v: 'Câu trả lời đúng',
      },
      {
        v: 'Câu trả lời sai',
      },
    ],
  ])

  XLSX.utils.sheet_add_json(
    ws,
    game.players.map((player, index) => getPlayerFinalScore(player, index)),
    {
      origin: -1,
      skipHeader: true,
    }
  )

  return ws
}

const getPlayerScoreForEachQuestion = (
  index: number,
  player: TDetailPlayer
) => {
  const gameRound = player.gameRounds[index]

  const playerRowSheet = [
    {
      v: 'Thời gian trả lời câu hỏi',
    },
    {},
    {},
    {},
    {
      v: 'BUH BUH LMAO',
    },
  ]

  return playerRowSheet
}

const getSheetForEachQuestion = (index: number, game: TGameHistory) => {
  const regex = /<[^>]+>/g
  const gameRoundStatistic = game.gameRoundStatistics.find(
    (g) => g.roundNumber === index
  )!

  const question = game.quiz.questions.find((q) => q.orderPosition === index)!

  const quiz = game.quiz.title
  const questionTitle = question?.question.replaceAll(regex, '')
  const ws: XLSX.WorkSheet = {}
  const merge = [
    {
      // From A1 -> H1
      s: { r: 0, c: 0 },
      e: { r: 0, c: 8 },
    },
    {
      // From A2 -> D2
      s: { r: 1, c: 0 },
      e: { r: 1, c: 3 },
    },
    {
      // From E2 -> H2
      s: { r: 1, c: 4 },
      e: { r: 1, c: 8 },
    },

    {
      // From A3 -> D3
      s: { r: 2, c: 0 },
      e: { r: 2, c: 3 },
    },
    {
      // From E3 -> H3
      s: { r: 2, c: 4 },
      e: { r: 2, c: 8 },
    },

    {
      // From A4 -> D4
      s: { r: 3, c: 0 },
      e: { r: 3, c: 3 },
    },
    {
      // From E4 -> H4
      s: { r: 3, c: 4 },
      e: { r: 3, c: 8 },
    },
    {
      // From A5 -> D5
      s: { r: 4, c: 0 },
      e: { r: 4, c: 3 },
    },
    {
      // From E5 -> H5
      s: { r: 4, c: 4 },
      e: { r: 4, c: 8 },
    },
    {
      // From A6 -> D6
      s: { r: 5, c: 0 },
      e: { r: 5, c: 3 },
    },
    {
      // From E6 -> H6
      s: { r: 5, c: 4 },
      e: { r: 5, c: 8 },
    },
    {
      // From A7 -> H7
      s: { r: 6, c: 0 },
      e: { r: 6, c: 8 },
    },
    {
      // From A8 -> H8
      s: { r: 7, c: 0 },
      e: { r: 7, c: 8 },
    },
    {
      // From A9 -> D9
      s: { r: 8, c: 0 },
      e: { r: 8, c: 3 },
    },

    {
      // From A10 -> D10
      s: { r: 9, c: 0 },
      e: { r: 9, c: 3 },
    },
    {
      // From A11 -> D11
      s: { r: 10, c: 0 },
      e: { r: 10, c: 3 },
    },
    {
      // From A12 -> H12
      s: { r: 11, c: 0 },
      e: { r: 11, c: 8 },
    },
    {
      // From A13 -> H13
      s: { r: 12, c: 0 },
      e: { r: 12, c: 8 },
    },
  ]
  ws['!merges'] = merge

  const answers: string[] = []

  const answersStatistics = []

  const answerTextStatistic: Record<string, number> =
    gameRoundStatistic.answerTextStatistic ?? {}
  for (const questionAnswer of question.questionAnswers) {
    if (questionAnswer.isCorrect) {
      answers.push(questionAnswer.answer)
    }
    // Convert from quesitionAnswerId to questionAnswer as text
    if (question.type !== '30TEXT') {
      answersStatistics.push({
        answer: questionAnswer.answer,
        isCorrect: questionAnswer.isCorrect,
        numOfAnswers: _.get(
          gameRoundStatistic,
          `answersStatistic.${questionAnswer.id}`,
          0
        ),
      })
    }
  }
  const correctAnswersPercentage =
    gameRoundStatistic?.numberOfCorrectAnswers / game.players.length

  XLSX.utils.sheet_add_aoa(
    ws,
    [
      [
        {
          v: quiz,
        },
      ],
      [
        {
          v: 'Câu hỏi',
        },
        {},
        {},
        {},
        {
          v: questionTitle,
        },
      ],
      [
        {
          v: 'Loại câu hỏi',
        },
        {},
        {},
        {},
        {
          v: QUESTION_TYPE_MAPPING_TO_TEXT[question?.type ?? '10SG'],
        },
      ],
      [
        {
          v: 'Thời gian trả lời câu hỏi',
        },
        {},
        {},
        {},
        {
          v: question.duration.toString(),
        },
      ],
      [
        {
          v: 'Câu hỏi đúng là',
        },
        {},
        {},
        {},
        {
          v: answers.join(', '),
        },
      ],
      [
        {
          v: 'Phần trăm trả lời đúng',
        },
        {},
        {},
        {},
        {
          v: correctAnswersPercentage.toString(),
        },
      ],
      [],
    ],
    { origin: 'A1' }
  )

  const answerText = [
    {
      v: 'Câu trả lời',
    },
    {},
    {},
    {},
  ]

  const correctText = [
    {
      v: 'Đây là câu trả lời đúng?',
    },
    {},
    {},
    {},
  ]

  const numChoiceText = [
    {
      v: 'Số người chơi lựa chọn câu này',
    },
    {},
    {},
    {},
  ]
  if (question.type == '30TEXT') {
    for (const answer in answerTextStatistic) {
      answerText.push({
        v: answer,
      })
      // correctText.push({
      //   v: answer.isCorrect ? 'Đúng' : 'Sai',
      // })
      numChoiceText.push({
        v: answerTextStatistic[answer].toString(),
      })
    }
  } else {
    for (const answer of answersStatistics) {
      answerText.push({
        v: answer.answer,
      })
      correctText.push({
        v: answer.isCorrect ? 'Đúng' : 'Sai',
      })
      numChoiceText.push({
        v: answer.numOfAnswers.toString(),
      })
    }
  }

  XLSX.utils.sheet_add_aoa(
    ws,
    [
      [
        {
          v: 'Tổng quan câu trả lời của người chơi',
        },
      ],
      answerText,
      correctText,
      numChoiceText,
    ],
    { origin: 'A8' }
  )

  const playersScoreForEachQuestionText = [
    [
      {
        v: 'Kết quả trận đấu',
      },
      {},
    ],
  ]

  for (let i = 0; i < game.players.length; i++) {
    const player = game.players[i]

    playersScoreForEachQuestionText.push(
      getPlayerScoreForEachQuestion(i, player)
    )
  }
  XLSX.utils.sheet_add_aoa(
    ws,
    playersScoreForEachQuestionText,
    { origin: 'A13' }
  )

  return ws
  // for (const ga)
}

const getExcelFile = (game: TGameHistory) => {
  const wb = XLSX.utils.book_new()

  wb.SheetNames.push('Thông tin chung')
  wb.SheetNames.push('Điểm tổng kết')

  wb.Sheets['Thông tin chung'] = generateOverviewInformation(game)
  wb.Sheets['Điểm tổng kết'] = generateFinalScoreSheet(game)

  for (let i = 0; i < game.quiz.questions.length; i++) {
    const sheetName = `Câu ${i + 1}`
    wb.SheetNames.push(sheetName)
    const questionResultSheet = getSheetForEachQuestion(i, game)

    wb.Sheets[sheetName] = questionResultSheet
  }
  return wb
}

export { getExcelFile }
