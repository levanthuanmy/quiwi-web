import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Button, Container, Dropdown, Table } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TPaginationResponse,
  TGameHistory,
} from '../../types/types'
import dayjs from 'dayjs'
import { GAME_MODE_MAPPING } from '../../utils/constants'
import styles from './HistoryPage.module.css'
import classNames from 'classnames'
import { useRouter } from 'next/router'
require('dayjs/locale/vi')
import * as XLSX from 'xlsx'
import {
  formatDate_HHmmDDMMMYYYY,
  formatDate_DDMMMMYYYY,
} from '../../utils/helper'

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

  const generateSummarySheet = (game: TGameHistory) => {
    const summaryWorksheet: XLSX.WorkSheet = {}
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
    ]
    summaryWorksheet['!merges'] = merge
    XLSX.utils.sheet_add_aoa(
      summaryWorksheet,
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

            v: 'Ngày làm bài',
          },
          {},
          {},
          {},
          {
            v: formatDate_HHmmDDMMMYYYY(game.createdAt),
          },
        ],
        // Row 3
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
      ],
      { origin: 'A1' }
    )

    summaryWorksheet['A1'].style = {
      font: { sz: 16, bold: true, color: '#FF00FF' },
    }
    return summaryWorksheet
  }

  const handleOnExport = (game: TGameHistory) => {
    const wb = XLSX.utils.book_new()

    wb.SheetNames.push('Thông tin chung')

    wb.Sheets['Thông tin chung'] = generateSummarySheet(game)

    XLSX.writeFile(wb, `${game.quiz.title}_${game.createdAt}.xlsx`)
  }
  const renderRow = (gameHistory: TGameHistory) => {
    return (
      <tr>
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
