import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import RankingBoard from '../../components/Ranking/RankingBoard'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import { TApiResponse } from '../../types/types'

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
  const router = useRouter()
  const q = router.query?.q?.toString()
  const userId = useAuth().getUser()?.id

  const { data, isValidating } = useSWR<TApiResponse<TRankingItem[]>>(
    [
      `/api/users/user/ranking/${rankingTabs[currentRankingTab].type}`,
      true,
      { q, userId },
    ],
    get
  )

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

            <RankingBoard rankingList={data?.response as TRankingItem[]} />
          </Container>
        </div>
      </DashboardLayout>
    </>
  )
}

export default RankingPage
