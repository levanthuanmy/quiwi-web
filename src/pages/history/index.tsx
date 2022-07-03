import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Alert, Col, Container, Row, Table } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import { HistoryGameRow } from '../../components/HistoryGameRow/HistoryGameRow'
import { MyPagination } from '../../components/MyPagination/MyPagination'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import SearchBar from '../../components/SearchBar/SearchBar'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TGameHistory,
  TPaginationResponse,
} from '../../types/types'
import styles from './HistoryPage.module.css'

require('dayjs/locale/vi')
const tabs = [
  {
    showType: 'Đã tổ chức',
  },
  {
    showType: 'Đã tham gia',
  },
]
const HistoryPage: NextPage = () => {
  const router = useRouter()

  const { q, pageIndex } = router.query

  const pageSize = 8
  const [currentTab, setCurrentTab] = useState<number>(0)
  // const [pageIndex, setPageIndex] = useState(1)
  const params: Record<string, any> = {
    filter: {},
    pageIndex: pageIndex ?? 1,
    pageSize: pageSize,
    q,
  }
  const { data, isValidating } = useSWR<
    TApiResponse<TPaginationResponse<TGameHistory>>
  >(
    [
      currentTab === 0
        ? `/api/games/hosted-game-history`
        : `/api/games/joined-game-history`,
      true,
      params,
    ],
    get,
    {
      revalidateOnFocus: false,
    }
  )

  const [pageCount, setPageCount] = useState(0)

  useEffect(() => {
    // setPageIndex(1)
    setPageCount(0)
    router.replace(`/history?pageIndex=1${q ? `&q=${q}` : ''}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  useEffect(() => {
    if (data?.response) {
      setPageCount(data.response.totalPages)
    }
  }, [data])

  // Invoke when user click to request another page.
  const handlePageClick = (selected: { selected: number }) => {
    // setPageIndex(Number(selected.selected) + 1)
    router.replace(
      `/history?pageIndex=${Number(selected.selected) + 1}&${q ? `q=${q}` : ''}`
    )
  }

  return (
    <DashboardLayout>
      <div className="w-100 bg-white bg-opacity-10 min-vh-100">
        <Container fluid="lg">
          <Row className="my-3 justify-content-between">
            <Col xs={2} className=" fw-medium">
              <h1> Lịch sử</h1>
            </Col>
            <Col>
              <SearchBar
                pageUrl="history"
                inputClassName="border border-primary"
              />
            </Col>
          </Row>
          <MyTabBar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabs={tabs.map((tab) => tab.showType)}
          />

          <br />
          {pageCount == 0 ? (
            <Alert
              variant="primary"
              className="text-center w-75 mx-auto fs-16px py-4 fw-medium mt-2"
            >
              Chưa có dữ liệu
            </Alert>
          ) : (
            <div>
              <Table borderless className={classNames(styles.table)}>
                <tbody>
                  <tr>
                    <th className={classNames('ps-3')}>Tên bài</th>
                    <th>Ngày làm</th>
                    <th>Chế độ chơi</th>

                    <th className="d-none d-lg-table-cell text-end">
                      Số người chơi
                    </th>
                    <th className="d-none d-md-table-cell"></th>
                  </tr>
                  {data?.response?.items.map((game) => (
                    <HistoryGameRow key={game.id} gameHistory={game} />
                  ))}
                </tbody>
              </Table>
              {pageCount > 0 ? (
                <Row className="mt-3">
                  <Col style={{ display: 'flex', justifyContent: 'center' }}>
                    <MyPagination
                      handlePageClick={handlePageClick}
                      totalPages={pageCount}
                    />
                  </Col>
                </Row>
              ) : null}
            </div>
          )}
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default HistoryPage
