import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Table, Image } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import { MyPagination } from '../../components/MyPagination/MyPagination'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import RankingBoard from '../../components/Ranking/RankingBoard'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse } from '../../types/types'

const rankingTabs = [
  {
    showType: 'Xu',
    type: 'coin',
  },
  {
    showType: 'Danh hiệu',
    type: 'badge',
  },
]

export type TRankingItem = {
  avatar: string
  id: number
  isHighlight: boolean
  quantity: number
  rank: number
  username: string
}

const RankingPage: NextPage = () => {
  const [currentRankingTab, setCurrentRankingTab] = useState<number>(0)
  const [pageIndex, setPageIndex] = useState(1)
  const router = useRouter()
  const q = router.query?.q?.toString()
  const userId = useAuth().getUser()?.id
  const pageSize = 7

  const { data, isValidating } = useSWR<
    TApiResponse<TPaginationResponse<TRankingItem>>
  >(
    [
      `/api/users/user/ranking/${rankingTabs[currentRankingTab].type}`,
      true,
      {
        pageIndex,
        pageSize,
      },
    ],
    get
  )
  const handlePageClick = (selected: { selected: number }) => {
    setPageIndex(Number(selected.selected) + 1)
  }

  useEffect(() => {
    setPageIndex(1)
  }, [currentRankingTab])

  return (
    <>
      <DashboardLayout>
        <div className="w-100 bg-secondary bg-transparent">
          <Container fluid="lg" className="p-3">
            <MyTabBar
              currentTab={currentRankingTab}
              setCurrentTab={setCurrentRankingTab}
              tabs={rankingTabs.map((tab) => tab.showType)}
            />

            <br />

            <SearchBar pageUrl="/ranking" />

            <RankingBoard
              rankingList={data?.response.items as TRankingItem[]}
            />
            {data?.response.items.length === 0 ? (
              'Không có dữ liệu'
            ) : (
              <Row className="mt-3">
                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                  <MyPagination
                    handlePageClick={handlePageClick}
                    totalPages={data?.response.totalPages ?? 0}
                  />
                </Col>
              </Row>
            )}
          </Container>
        </div>
      </DashboardLayout>
    </>
  )
}

export default RankingPage
