import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TPaginationResponse,
  TGameHistory,
} from '../../types/types'
import dayjs from 'dayjs'
var locale_vi = require('dayjs/locale/vi')
const GameModeMapping: Record<string, string> = {
  '10CLASSIC': 'Truyền Thống',
  '20MRT': 'Marathon',
}

const HistoryPage: NextPage = () => {
  const authContext = useAuth()
  const user = authContext.getUser()

  const [gamesHistory, setGamesHistory] =
    useState<TApiResponse<TPaginationResponse<TGameHistory>>>()

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
        <td>{gameHistory.quiz.title}</td>
        <td>
          {dayjs(gameHistory.createdAt)
            .locale('vi')
            .format('HH:mm, DD MMMM YYYY')}
        </td>
        <td>{GameModeMapping[gameHistory.mode] ?? 'Truyền Thống'}</td>
        <td>{gameHistory.players.length}</td>
      </tr>
    )
  }
  return (
    <DashboardLayout>
      <div className=" w-100 bg-secondary bg-opacity-10 min-vh-100 text-center">
        <div className="pt-5">
          <Table bordered className="w-50 mx-auto" hover variant="light">
            <thead>
              <tr>
                <th>Tên bộ đề</th>
                <th>Ngày làm</th>
                <th>Chế độ chơi</th>
                <th>Số người tham gia</th>
              </tr>
            </thead>
            <tbody>
              {gamesHistory?.response?.items.map((game) => renderRow(game))}
            </tbody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HistoryPage
