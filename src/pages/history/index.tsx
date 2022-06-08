import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Pagination, Row, Table } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import { HistoryGameRow } from '../../components/HistoryGameRow/HistoryGameRow'
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

  const { q } = router.query

  const pageSize = 8
  const maxPaginationList = 5
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [pageIndex, setPageIndex] = useState(1)
  const params: Record<string, any> = {
    filter: {
      order: {
        createdAt: 'DESC',
      },
    },
    pageIndex: pageIndex,
    pageSize: pageSize,
    // q
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
    get
  )

  useEffect(() => {
    getItems(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [currentListPagination, setCurrentListPagination] = useState<number[]>()
  const [currentPagination, setCurrentPagination] = useState<number>(1)
  const getFirst = (totalPages: number) => {
    setCurrentPagination(1)
    let arr = []
    for (let i = 1; i <= totalPages; i++) {
      arr.push(i)
      if (i === maxPaginationList) break
    }
    return arr
  }

  const getLast = (totalPages: number) => {
    setCurrentPagination(totalPages)
    let arr = []
    let count = 0
    for (let i = totalPages; i >= 1; i--) {
      arr.unshift(i)
      count++
      if (count === maxPaginationList) break
    }
    return arr
  }
  //Gọi hàm để set lại danh sách mảng số Pagination
  const getPagination = (totalPages: number, pageCur: number) => {
    if (pageCur > totalPages || pageCur < 1)
      return currentListPagination ? [...currentListPagination] : []
    setCurrentPagination(pageCur)
    if (totalPages === 0 || totalPages === 1 || !totalPages) return [1]
    let arr: any = []
    //Nếu nút pagination được chọn khác với pagination hiện tại
    if (
      pageCur !== currentPagination &&
      currentListPagination &&
      currentListPagination.indexOf(pageCur) > maxPaginationList / 2 &&
      currentListPagination.length === maxPaginationList
    ) {
      //Ở vị trí lớn hơn nút giữa nhưng không phải nút cuối
      if (currentListPagination.indexOf(pageCur) < maxPaginationList - 1) {
        arr = [...currentListPagination]
        let lastPag = arr[maxPaginationList - 1]
        //Nếu phần tử cuối có giá trị lớn hơn số trang hoặc bằng thì sẽ giữ nguyên
        if (lastPag >= totalPages) return arr
        //Shift mảng lên 1 vị trí
        arr.push(lastPag + 1)
        arr.splice(0, 1)
      } else {
        //Shift mảng lên 2 vị trí
        arr = [...currentListPagination]
        let lastPag = arr[maxPaginationList - 1]
        if (lastPag >= totalPages) return arr
        for (let k = 0; k < 2; k++) {
          lastPag = lastPag + 1
          arr.push(lastPag)
          arr.splice(0, 1)
          if (lastPag === totalPages) break
        }
      }
    } else if (
      pageCur !== currentPagination &&
      currentListPagination &&
      currentListPagination.indexOf(pageCur) < maxPaginationList / 2 &&
      currentListPagination.length === maxPaginationList
    ) {
      //Ở vị trí nhỏ hơn nút giữa nhưng không phải nút cuối
      if (currentListPagination.indexOf(pageCur) < maxPaginationList - 1) {
        arr = [...currentListPagination]
        let firstPag = arr[0]
        //Nếu phần tử đầu có giá trị 1 (đầu trang) thì sẽ giữ nguyên
        if (firstPag === 1) return arr
        //Shift mảng về 1 vị trí
        arr.unshift(firstPag - 1)
        arr.splice(arr.length - 1, 1)
      } else {
        //Shift mảng về 2 vị trí
        arr = [...currentListPagination]
        let firstPag = arr[maxPaginationList - 1]
        if (firstPag === 1) return arr
        for (let k = 0; k < 2; k++) {
          firstPag = firstPag - 1
          arr.unshift(firstPag)
          arr.splice(arr.length - 1, 1)
          if (firstPag === 1) break
        }
      }
    }
    return arr
  }

  const getItems = async (pageIndex: number) => {
    if (
      data &&
      data.response.totalPages > 0 &&
      (pageIndex > data?.response.totalPages || pageIndex < 1)
    ) {
      return
    }

    setPageIndex(pageIndex)
    if (pageIndex === 1) {
      setCurrentListPagination(getFirst(data?.response?.totalPages ?? 1))
    } else if (pageIndex === data?.response?.totalPages) {
      setCurrentListPagination(getLast(data?.response.totalPages))
    } else {
      setCurrentListPagination(
        getPagination(data?.response?.totalPages ?? 1, pageIndex)
      )
    }
  }
  return (
    <DashboardLayout>
      <div className="w-100 bg-white bg-opacity-10 min-vh-100">
        <Container fluid="lg">
          <Row className="my-3 justify-content-between">
            <Col xs={2} className="fs-22px fw-medium">
              Lịch sử
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
            <Row className="mt-3">
              <Col style={{ display: 'flex', justifyContent: 'center' }}>
                {data?.response ? (
                  <Pagination>
                    <Pagination.First
                      onClick={() => {
                        getItems(1)
                      }}
                    />
                    <Pagination.Prev
                      onClick={() => {
                        getItems(currentPagination - 1)
                      }}
                    />
                    {currentListPagination?.map((item, idx) =>
                      item === currentPagination ? (
                        <Pagination.Item key={idx} active>
                          {item}
                        </Pagination.Item>
                      ) : (
                        <Pagination.Item
                          key={idx}
                          onClick={() => {
                            getItems(data.response.totalPages)
                          }}
                        >
                          {item}
                        </Pagination.Item>
                      )
                    )}

                    <Pagination.Next
                      onClick={() => {
                        getItems(currentPagination + 1)
                      }}
                    />
                    <Pagination.Last
                      onClick={() => {
                        getItems(data.response.totalPages)
                      }}
                    />
                  </Pagination>
                ) : (
                  <div></div>
                )}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default HistoryPage
