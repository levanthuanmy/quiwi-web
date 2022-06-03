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
            {dayjs(gameHistory.createdAt)
              .locale('vi')
              .format('HH:mm, DD MMMM YYYY')}
          </span>
          <span className="d-table-cell d-lg-none">
            {dayjs(gameHistory.createdAt).locale('vi').format('DD MMMM YYYY')}
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
              <Dropdown.Item href="#/action-2">Tải xuống</Dropdown.Item>
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
