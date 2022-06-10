require('dayjs/locale/vi')
import _, { over } from 'lodash'
import * as XLSX from 'sheetjs-style'
import { TDetailPlayer, TGameHistory } from '../types/types'
import { QUESTION_TYPE_MAPPING_TO_TEXT } from './constants'
import { formatDate_DDMMMMYYYY, formatDate_DDMMYYYY } from './helper'
import ExcelJS from 'exceljs'
const alignCenterSetting = {
  alignment: {
    vertical: 'center',
    horizontal: 'center',
  },
}

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
      (countCorrectAnswers / (game.gameRoundStatistics.length || 1)) *
      100
    ).toFixed(2),
    timeoutSubmissionPercentage: (
      (countTimeoutSubmission / (game.gameRoundStatistics.length || 1)) *
      100
    ).toFixed(2),
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
    vertical: 'middle'
  }
  cell.value = title

  // console.log("cell.row", cell.row)
  sheet.getRow(Number(cell.row)).height = 22
}

const setValueForCell = (
  sheet: ExcelJS.Worksheet,
  cell: string,
  value: string
) => {
  sheet.getCell(cell).value = value
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
  value: string
) => {
  setValueForCell(sheet, cell, value)
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
  createCellWithThinBorder(sheet, 'E8', percentages.correctAnswersPercentage)

  createCellWithThinBorder(sheet, 'A9', 'Sô phần trăm chưa trả lời (trễ giờ)')
  createCellWithThinBorder(sheet, 'E9', percentages.timeoutSubmissionPercentage)

  getHeader(sheet, 'A11', 'Chuyển sang các Sheet sau để xem kết quả từng câu')
}

const getPlayerFinalScore = (player: TDetailPlayer, rank: number) => {
  const rs = []

  rs.push((rank + 1).toString())
  rs.push(player.nickname)
  rs.push(player['score'].toFixed(2))
  let correctAnswer = 0
  const totalAnswers = player.gameRounds.length
  for (const gameRound of player.gameRounds) {
    if (gameRound.isCorrect) {
      correctAnswer++
    }
  }

  rs.push(correctAnswer.toString())
  rs.push((totalAnswers - correctAnswer).toString())
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

  const answers = []

  if (gameRound.selectionAnswers) {
    for (const index in gameRound.selectionAnswers) {
      answers.push(gameRound.selectionAnswers[index].answer)
    }
  }

  let isCorrect = ''
  if (gameRound.score === gameRound.question?.score) {
    isCorrect = 'Đúng'
  } else if (!gameRound.answer && !gameRound.answerIds.length) {
    isCorrect = 'Không trả lời'
  } else {
    isCorrect = 'Sai'
  }
  const playerRowSheet = [
    player.nickname,
    gameRound.answer || answers.join(', '),
    isCorrect,
    gameRound.score.toFixed(2),
    gameRound.currentScore.toFixed(2),
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
    (gameRoundStatistic?.numberOfCorrectAnswers / game.players.length) * 100

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
  createCellWithThinBorder(sheet, 'E4', question.duration.toString())
  createCellWithThinBorder(sheet, 'A5', 'Câu trả lời đúng là')
  createCellWithThinBorder(sheet, 'E5', answers.join(', '))
  createCellWithThinBorder(sheet, 'A6', 'Phần trăm trả lời đúng')
  createCellWithThinBorder(sheet, 'E6', correctAnswersPercentage.toFixed(2))

  const answerText = ['Câu trả lời', '', '', '']

  const correctText = ['Đây là câu trả lời đúng?', '', '', '']

  const numChoiceText = ['Số người chơi lựa chọn câu này', '', '', '']
  if (question.type == '30TEXT') {
    for (const answer in answerTextStatistic) {
      answerText.push(answer)
      // correctText.push({
      //   v: answer.isCorrect ? 'Đúng' : 'Sai',
      // })
      numChoiceText.push(answerTextStatistic[answer].toString())
    }
  } else {
    for (const answer of answersStatistics) {
      answerText.push(answer.answer)
      correctText.push(answer.isCorrect ? 'Đúng' : 'Sai')
      numChoiceText.push(answer.numOfAnswers.toString())
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

  const playersScoreForEachQuestionText: any = []

  for (let i = 0; i < game.players.length; i++) {
    const player = game.players[i]

    playersScoreForEachQuestionText.push(
      getPlayerScoreForEachQuestion(index, player)
    )
  }

  sheet.addTable({
    name: 'PlayerScore',
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

  // await workbook.xlsx.writeFile(`${formatDate_DDMMYYYY(game.createdAt)} ${game.quiz.title}.xlsx`)

  // write to a new buffer
  const buffer = await workbook.xlsx.writeBuffer()
  console.log(buffer)

  return buffer
}

export { getExcelFile, calculateScorePercentages }
