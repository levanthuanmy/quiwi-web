import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Dropdown, Table } from 'react-bootstrap'
import * as XLSX from 'xlsx'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TDetailPlayer,
  TGameHistory,
  TPaginationResponse,
} from '../../types/types'
import { GAME_MODE_MAPPING } from '../../utils/constants'
import {
  formatDate_DDMMMMYYYY,
  formatDate_DDMMYYYY,
  formatDate_HHmmDDMMMYYYY,
} from '../../utils/helper'
import styles from './HistoryPage.module.css'
require('dayjs/locale/vi')

const HistoryPage: NextPage = () => {
  const authContext = useAuth()
  const user = authContext.getUser()
  const router = useRouter()
  const [gamesHistory, setGamesHistory] =
    useState<TApiResponse<TPaginationResponse<TGameHistory>>>()

  // Get Game Hisotry
  useEffect(() => {
    const getGameHistory = async () => {
      try {
        const params: Record<string, object> = {
          filter: {
            order: {
              createdAt: 'DESC',
            },
          },
        }
        const res = await get<TApiResponse<TPaginationResponse<TGameHistory>>>(
          '/api/games/hosted-game-history',
          true,
          params
        )
        console.log('==== ~ getGameHistory ~ res', res)

        if (res.response) {
          setGamesHistory(res)
        }
      } catch (error) {
        alert((error as Error).message)
      }
    }
    getGameHistory()
  }, [user])

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
            v: 'Chuyển sang các Sheet để xem kết quả từng câu',
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

  const handleSheetForEachQuestion = (index: number, game: TGameHistory) => {
    const regex = /<[^>]+>/g
    const gameRoundStatistic = game.gameRoundStatistics.find(
      (g) => g.roundNumber === index
    )
    const question = game.quiz.questions.find((q) => q.orderPosition === index)

    const title = question?.question.replaceAll(regex, '')
    const questionSheet: XLSX.WorkSheet = {}
    // for (const ga)
  }

  const getPlayerFinalScore = (player: TDetailPlayer, rank: number) => {
    const res: Record<string, number | string> = {}
    res['rank'] = rank
    res['player'] = player.nickname
    res['score'] = player['score']
    let correctAnswer = 0
    const totalAnswers = player.gameRounds.length
    for (const gameRound of player.gameRounds) {
      if (
        gameRound.score === gameRound.question?.score ||
        gameRound.score > 0
      ) {
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

  const handleOnExport = (game: TGameHistory) => {
    const wb = XLSX.utils.book_new()

    wb.SheetNames.push('Thông tin chung')
    wb.SheetNames.push('Điểm tổng kết')

    wb.Sheets['Thông tin chung'] = generateOverviewInformation(game)
    wb.Sheets['Điểm tổng kết'] = generateFinalScoreSheet(game)

    XLSX.writeFile(
      wb,
      `${formatDate_DDMMYYYY(game.createdAt)} ${game.quiz.title}.xlsx`
    )
  }
  const renderRow = (gameHistory: TGameHistory) => {
    return (
      <tr key={gameHistory.id}>
        <td
          className={classNames(
            styles.firstCell,
            styles.cell,
            'ps-3 cursor-pointer text-wrap'
          )}
          onClick={() => {
            router.push(`/history/${gameHistory.id}`)
          }}
        >
          {gameHistory.quiz.title}
        </td>
        <td className={classNames(styles.cell)}>
          <span className="d-none d-lg-table-cell">
            {formatDate_HHmmDDMMMYYYY(gameHistory.createdAt)}
          </span>
          <span className="d-table-cell d-lg-none">
            {formatDate_DDMMMMYYYY(gameHistory.createdAt)}
          </span>
        </td>
        <td className={classNames(styles.cell)}>
          {GAME_MODE_MAPPING[gameHistory.mode] ?? 'Truyền Thống'}
        </td>
        <td
          className={classNames(styles.cell, 'd-none d-lg-table-cell text-end')}
        >
          {gameHistory.players.length}
        </td>
        <td className={classNames(styles.cell, 'd-none d-md-table-cell')}>
          <Dropdown>
            <Dropdown.Toggle
              variant="white"
              className={styles.dropdown}
              id="dropdown-basic"
            >
              <i className="bi bi-three-dots-vertical fs-16px"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href={`/history/${gameHistory.id}`}>
                Xem chi tiết
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOnExport(gameHistory)}>
                Tải xuống
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3">Xóa khỏi lịch sử</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    )
  }
  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10 min-vh-100">
        <Container>
          <div className="fs-32px fw-medium mb-3 ms-2">Lịch sử</div>
          <div>
            <Table
              className={classNames(styles.table, 'shadow shadow-sm')}
              hover
              variant="light"
            >
              <thead>
                <tr>
                  <th className="ps-3">Tên bài</th>
                  <th>Ngày làm</th>
                  <th>Chế độ chơi</th>

                  <th className="d-none d-lg-table-cell text-end">
                    Số người chơi
                  </th>
                  <th className="d-none d-md-table-cell"></th>
                </tr>
              </thead>
              <tbody>
                {gamesHistory?.response?.items.map((game) => renderRow(game))}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default HistoryPage
