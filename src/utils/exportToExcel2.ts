require('dayjs/locale/vi')
import ExcelJS from 'exceljs'
import _ from 'lodash'
import { TDetailPlayer, TGameHistory } from '../types/types'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from './constants'
import { formatDate_DDMMMMYYYY, renderPercentage } from './helper'
import { getAnswerResultText } from './statistic-calculation'

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
    correctAnswersPercentage:
      countCorrectAnswers / (game.gameRoundStatistics.length || 1),
    timeoutSubmissionPercentage:
      countTimeoutSubmission / (game.gameRoundStatistics.length || 1),
  }
}

const getTitle = (sheet: ExcelJS.Worksheet, title: string) => {
  sheet.getRow(1).height = 26

  const cell = sheet.getCell('A1')
  cell.value = title
  cell.font = {
    family: 4,
    size: 20,
    bold: true,
  }
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  }
  cell.alignment = {
    vertical: 'middle',
  }
}

const getHeader = (
  sheet: ExcelJS.Worksheet,
  cellName: string,
  title: string
) => {
  createCellWithThinBorder(sheet, cellName, title)
  const cell = sheet.getCell(cellName)
  cell.font = {
    size: 14,
    bold: true,
  }
  cell.alignment = {
    horizontal: 'center',
    vertical: 'middle',
  }
  cell.value = title

  // console.log("cell.row", cell.row)
  sheet.getRow(Number(cell.row)).height = 22
}

const setValueForCell = (
  sheet: ExcelJS.Worksheet,
  cell: string,
  value: any,
  isPercentage?: boolean
) => {
  sheet.getCell(cell).value = value
  if (isPercentage) {
    sheet.getCell(cell).numFmt = '0.00%'
  }
}

const setThinBorderForCell = (sheet: ExcelJS.Worksheet, cell: string) => {
  sheet.getCell(cell).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  }
}

const setHeightForRow = (
  sheet: ExcelJS.Worksheet,
  row: number,
  height = 20
) => {
  sheet.getRow(row).height = height
}

const setWidthForColumn = (
  sheet: ExcelJS.Worksheet,
  columnName: string,
  width = 32
) => {
  const col = sheet.getColumn(columnName)
  col.width = width
}

const createCellWithThinBorder = (
  sheet: ExcelJS.Worksheet,
  cell: string,
  value: any,
  isPercentage?: boolean
) => {
  setValueForCell(sheet, cell, value, isPercentage)
  setThinBorderForCell(sheet, cell)
}

const autoColWidth = (sheet: ExcelJS.Worksheet) => {
  sheet.columns.forEach((column) => {
    column.width = column?.header?.length ?? 0 < 16 ? 16 : column.header?.length
  })
}

const generateOverviewInformation = (
  sheet: ExcelJS.Worksheet,
  game: TGameHistory
) => {
  sheet.properties.defaultRowHeight = 20
  sheet.mergeCells('A1:H1')
  sheet.mergeCells('A2:D2')
  sheet.mergeCells('E2:H2')
  sheet.mergeCells('A3:D3')
  sheet.mergeCells('E3:H3')
  sheet.mergeCells('A4:D4')
  sheet.mergeCells('E4:H4')
  sheet.mergeCells('A5:D5')
  sheet.mergeCells('E5:H5')
  sheet.mergeCells('A6:H6')
  sheet.mergeCells('A7:H7')
  sheet.mergeCells('A8:D8')
  sheet.mergeCells('E8:H8')
  sheet.mergeCells('A9:D9')
  sheet.mergeCells('E9:H9')
  sheet.mergeCells('A11:H11')

  getTitle(sheet, game.quiz.title)
  setValueForCell(sheet, 'A2', 'Chủ phòng')
  setThinBorderForCell(sheet, 'A2')

  createCellWithThinBorder(sheet, 'A2', 'Chủ phòng')
  createCellWithThinBorder(sheet, 'E2', game.host?.name || game.host?.username)
  createCellWithThinBorder(sheet, 'A3', 'Ngày làm bài')
  createCellWithThinBorder(sheet, 'E3', formatDate_DDMMMMYYYY(game.createdAt))
  createCellWithThinBorder(sheet, 'A4', 'Số người chơi')
  createCellWithThinBorder(sheet, 'E4', `${game.players.length} người chơi`)
  createCellWithThinBorder(sheet, 'A5', 'Mã phòng')
  createCellWithThinBorder(sheet, 'E5', `${game.invitationCode}`)

  getHeader(sheet, 'A7', 'Tổng quan')
  const percentages = calculateScorePercentages(game)

  createCellWithThinBorder(sheet, 'A8', 'Sô phần trăm trả lời đúng')
  createCellWithThinBorder(
    sheet,
    'E8',
    +percentages.correctAnswersPercentage,
    true
  )
  createCellWithThinBorder(sheet, 'A9', 'Sô phần trăm chưa trả lời (trễ giờ)')
  createCellWithThinBorder(
    sheet,
    'E9',
    +percentages.timeoutSubmissionPercentage,
    true
  )

  getHeader(sheet, 'A11', 'Chuyển sang các Sheet sau để xem kết quả từng câu')
}

/**
 * Lấy dữ liệu tổng kết của user để báo cáo overall ở table sheet thứ 1
 * @param player player
 * @param rank rank
 * @returns string[] là một row trong excel - [0] là rank, [1] là nickname, [2] là điểm tổng, [3] là số câu đúng, [4] là số câu sai, [5] là điểm thang 10
 */
export const getPlayerFinalScore = (player: TDetailPlayer, rank: number) => {
  const rs = []

  rs.push(rank + 1)
  rs.push(player.nickname)

  rs.push(+player['score'].toFixed(2))
  let correctAnswer = 0
  const totalAnswers = player.gameRounds.length
  let rawPlayerScore = 0
  let totalScoreQuestions = 0
  for (const gameRound of player.gameRounds) {
    if (gameRound.isCorrect) {
      correctAnswer++
      rawPlayerScore += gameRound.question!.score
    }
    totalScoreQuestions += gameRound.question!.score
  }

  rs.push(correctAnswer)
  rs.push(totalAnswers - correctAnswer)
  rs.push(+renderPercentage((rawPlayerScore / totalScoreQuestions) * 10))
  return rs
}

const generateFinalScoreSheet = (
  sheet: ExcelJS.Worksheet,
  game: TGameHistory
) => {
  sheet.mergeCells('A1:H1')
  sheet.mergeCells('A2:H2')
  getTitle(sheet, game.quiz.title)

  getHeader(sheet, 'A2', 'Điểm tổng kết')
  sheet.getRow(2).height = 20

  sheet.addTable({
    name: 'MyTable',
    ref: 'A3',
    headerRow: true,
    totalsRow: false,
    style: {
      showRowStripes: true,
    },
    columns: [
      {
        name: 'Xếp hạng',
      },
      {
        name: 'Tên người chơi',
      },
      {
        name: 'Tổng điểm',
      },
      {
        name: 'Câu trả lời đúng',
      },
      {
        name: 'Câu trả lời sai',
      },
      {
        name: 'Thang điểm 10',
      },
    ],
    rows: game.players.map((player, index) =>
      getPlayerFinalScore(player, index)
    ),
  })

  autoColWidth(sheet)
}

const getPlayerScoreForEachQuestion = (
  index: number,
  player: TDetailPlayer
) => {
  const gameRound = player.gameRounds[index]
  if (!gameRound) return []

  const answers = []

  if (gameRound?.selectionAnswers) {
    for (const index in gameRound.selectionAnswers) {
      answers.push(gameRound.selectionAnswers[index].answer)
    }
  }

  const isCorrect = getAnswerResultText(gameRound)

  const playerRowSheet = [
    player.nickname,
    gameRound?.answer || answers?.join(', ') || '',
    isCorrect,
    +gameRound.score.toFixed(2),
    +gameRound.currentScore.toFixed(2),
    gameRound.currentStreak,
  ]

  return playerRowSheet
}

const generateSheetForEachQuestion = (
  sheet: ExcelJS.Worksheet,
  index: number,
  game: TGameHistory
) => {
  const regex = /<[^>]+>/g
  const gameRoundStatistic = game.gameRoundStatistics.find(
    (g) => g.roundNumber === index
  )!

  const question = game.quiz.questions.find((q) => q.orderPosition === index)!

  const questionTitle = question?.question.replaceAll(regex, '').trim()

  sheet.mergeCells('A1:H1')
  sheet.mergeCells('A2:D2')
  sheet.mergeCells('E2:H2')
  sheet.mergeCells('A3:D3')
  sheet.mergeCells('E3:H3')
  sheet.mergeCells('A4:D4')
  sheet.mergeCells('E4:H4')
  sheet.mergeCells('A5:D5')
  sheet.mergeCells('E5:H5')
  sheet.mergeCells('A6:D6')
  sheet.mergeCells('E6:H6')
  sheet.mergeCells('A7:H7')
  sheet.mergeCells('A8:H8')

  /**
   * Lấy trả lời đúng hiển thị trên hàng
   */
  const answers: string[] = []

  /**
   * Thông số người chọn các câu choices
   */
  const answersStatistics = []

  /**
   * Thông số người chọn các câu text, gán bởi gameRoundStatistic
   */
  const answerTextStatistic: Record<string, number> =
    gameRoundStatistic?.answerTextStatistic ?? {}
  // Lấy các câu trả lời trong question để đếm số người chọn câu đó và hiển thị các câu trả lời đúng
  for (const questionAnswer of question.questionAnswers) {
    if (questionAnswer.isCorrect) {
      answers.push(questionAnswer.answer)
    }
    // For choices question -> Convert from quesitionAnswerId to questionAnswer as text
    if (question.type !== '30TEXT' && question.type !== '31ESSAY') {
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
    (gameRoundStatistic?.numberOfCorrectAnswers ?? 0) /
    (game.players.length || 1)

  getTitle(sheet, game.quiz.title)

  createCellWithThinBorder(sheet, 'A2', 'Câu hỏi')
  createCellWithThinBorder(sheet, 'E2', questionTitle)
  createCellWithThinBorder(sheet, 'A3', 'Loại câu hỏi')
  createCellWithThinBorder(
    sheet,
    'E3',
    QUESTION_TYPE_MAPPING_TO_TEXT[question?.type ?? '10SG']
  )
  createCellWithThinBorder(sheet, 'A4', 'Thời gian trả lời câu hỏi')
  createCellWithThinBorder(sheet, 'E4', question.duration)
  createCellWithThinBorder(sheet, 'A5', 'Câu trả lời đúng là')
  createCellWithThinBorder(sheet, 'E5', answers.join(', '))
  createCellWithThinBorder(sheet, 'A6', 'Phần trăm trả lời đúng')
  createCellWithThinBorder(sheet, 'E6', correctAnswersPercentage, true)

  const answerText = ['Câu trả lời', '', '', '']

  const correctText = ['Đây là câu trả lời đúng?', '', '', '']

  const numChoiceText = ['Số người chơi lựa chọn câu này', '', '', '']

  // Render Đây là câu trả lời đúng và Số người chơi lựa chọn câu này
  // Nếu là 31ESSAY thì k hiện câu trả lời
  if (question.type === '30TEXT') {
    for (const answer in answerTextStatistic) {
      answerText.push(answer)
      // correctText.push({
      //   v: answer.isCorrect ? 'Đúng' : 'Sai',
      // })
      numChoiceText.push(answerTextStatistic[answer].toString())
    }
  } else if (question.type !== '31ESSAY') {
    for (const answer of answersStatistics) {
      answerText.push(answer.answer)
      correctText.push(answer.isCorrect ? 'Đúng' : 'Sai')
      numChoiceText.push(answer.numOfAnswers)
    }
  }

  getHeader(sheet, 'A8', 'Tổng quan câu trả lời của người chơi')

  sheet.insertRow(9, answerText)
  sheet.insertRow(10, correctText)
  sheet.insertRow(11, numChoiceText)
  sheet.mergeCells('A9:D9')
  sheet.mergeCells('A10:D10')
  sheet.mergeCells('A11:D11')

  sheet.mergeCells('A12:H12')
  sheet.mergeCells('A13:H13')
  getHeader(sheet, 'A13', 'Kết quả trận đấu')

  const playersScoreForEachQuestionText: (string | number)[][] = []

  for (let i = 0; i < game.players.length; i++) {
    const player = game.players[i]

    playersScoreForEachQuestionText.push(
      getPlayerScoreForEachQuestion(index, player)
    )
  }

  sheet.addTable({
    name: 'PlayerScore_' + index,
    ref: 'A14',
    headerRow: true,
    totalsRow: false,

    columns: [
      {
        name: 'Tên người chơi',
      },
      {
        name: 'Đã chọn (nhiều câu trả lời sẽ cách nhau bởi dấu phẩy)',
      },
      {
        name: 'Kết quả',
      },
      {
        name: 'Điểm nhận được',
      },
      {
        name: 'Điểm hiện tại',
      },
      {
        name: 'Streak hiện tại',
      },
    ],
    rows: playersScoreForEachQuestionText,
  })
  sheet.getCell('E2').alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'left',
  }
  sheet.getCell('F2').alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'left',
  }
  sheet.getCell('G2').alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'left',
  }
  sheet.getCell('H2').alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'left',
  }
  sheet.getCell('E5').alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'left',
  }
  sheet.getCell('F5').alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'left',
  }
  sheet.getCell('G5').alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'left',
  }
  sheet.getCell('H5').alignment = {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'left',
  }

  autoColWidth(sheet)
  sheet.getRow(14).height = 20
}

const getExcelFile = async (game: TGameHistory) => {
  const workbook = new ExcelJS.Workbook()

  const overviewInformationSheet = workbook.addWorksheet('Thông tin chung')
  generateOverviewInformation(overviewInformationSheet, game)

  const finalScoreSheet = workbook.addWorksheet('Điểm tổng kết')
  generateFinalScoreSheet(finalScoreSheet, game)

  for (let i = 0; i < game.quiz.questions.length; i++) {
    const questionReportSheet = workbook.addWorksheet(`Câu ${i + 1}`)

    generateSheetForEachQuestion(questionReportSheet, i, game)
  }

  workbook.creator = 'QuiwiGame'

  // write to a new buffer
  const buffer = await workbook.xlsx.writeBuffer()

  return buffer
}

export { getExcelFile, calculateScorePercentages }
