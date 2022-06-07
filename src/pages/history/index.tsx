import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Dropdown, Table } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TGameHistory,
  TPaginationResponse,
} from '../../types/types'
import { GAME_MODE_MAPPING } from '../../utils/constants'
import { getExcelFile } from '../../utils/exportToExcel'
import {
  formatDate_DDMMMMYYYY,
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

        if (res.response) {
          setGamesHistory(res)
        }
      } catch (error) {
        alert((error as Error).message)
      }
    }
    getGameHistory()
  }, [user])

  const handleOnExport = (game: TGameHistory) => {
    getExcelFile(game)
  }

  const renderRow = (gameHistory: TGameHistory) => {
    return (
      <tr key={gameHistory.id} className="">
        <td
          className={classNames(
            styles.firstCell,
            styles.cell,
            'cursor-pointer text-wrap px-0'
          )}
          onClick={() => {
            router.push(`/history/${gameHistory.id}`)
          }}
        >
          <div
            className={classNames(
              'ps-3 py-3  fw-medium rounded-start-14px bg-light'
            )}
          >
            {gameHistory.quiz.title}
          </div>
        </td>

        <td className={classNames(styles.cell)}>
          <div className={classNames('py-3 bg-light')}>
            <span className="d-none d-lg-table-cell">
              {formatDate_HHmmDDMMMYYYY(gameHistory.createdAt)}
            </span>
            <span className="d-table-cell d-lg-none">
              {formatDate_DDMMMMYYYY(gameHistory.createdAt)}
            </span>
          </div>
        </td>

        <td className={classNames(styles.cell)}>
          <div className={classNames('py-3 bg-light text-center',  styles.borderRadiusSm)}>
            {GAME_MODE_MAPPING[gameHistory.mode] ?? 'Truyền Thống'}
          </div>
        </td>
        <td
          className={classNames(
            styles.cell,
            'd-none d-lg-table-cell text-end '
          )}
        >
          <div className={classNames('py-3 bg-light')}>
            {gameHistory.players.length}
          </div>
        </td>
        <td className={classNames(styles.cell, 'd-none d-md-table-cell')}>
          <Dropdown>
            <Dropdown.Toggle
              variant="white"
              className={classNames(styles.dropdown, 'bg-light py-3 m-0')}
              id="dropdown-basic"
            >
              <div>
              <i className="bi bi-three-dots-vertical fs-14px"></i>
              </div>
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
      <div className="w-100 bg-white bg-opacity-10 min-vh-100">
        <Container>
          <div className="fs-32px fw-medium mb-3 ms-2">Lịch sử</div>
          <div>
            <Table borderless className={classNames(styles.table)}>
              <tbody>
                <tr>
                  <th className="ps-3">Tên bài</th>
                  <th>Ngày làm</th>
                  <th>Chế độ chơi</th>

                  <th className="d-none d-lg-table-cell text-end">
                    Số người chơi
                  </th>
                  <th className="d-none d-md-table-cell"></th>
                </tr>
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
