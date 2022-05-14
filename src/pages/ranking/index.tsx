import _ from 'lodash'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { Container, Dropdown } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import RankingBoard from '../../components/Ranking/RankingBoard'
import { RankingProps } from '../../components/Ranking/RankingRow'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { TUser } from '../../types/types'
import { JsonParse } from '../../utils/helper'
import styles from './ranking.module.css'

export enum RankingType {
  COIN = 'coin',
  BADGE = 'badge',
}

export type RankingDropdown = {
  showType: string
  type: RankingType
}

const rankingDropdown: RankingDropdown[] = [
  {
    showType: 'Xu',
    type: RankingType.COIN,
  },
  {
    showType: 'Danh hiệu',
    type: RankingType.BADGE,
  },
]
const url = process.env.NEXT_PUBLIC_API_URL

const RankingPage: NextPage = () => {
  const [rankingDropdownPos, setRankingDropdownPos] = useState<number>(0)
  const [data, setData] = useState<RankingProps[]>()
  useEffect(() => {
    const getData = async () => {
      try {
        const dataResponse = await fetch(
          `${url}/api/users/user/ranking/${rankingDropdown[rankingDropdownPos].type}?userId=${user.id}`
        )
        setData(_.get(await dataResponse.json(), 'response'))
      } catch (error) {
        console.log('🚀 ~ getData ~ error', error)
      }
    }
    getData()
  }, [rankingDropdownPos])

  // console.log(`data: ${JSON.stringify(data)}`)
  const [lsUser] = useLocalStorage('user', '')
  const user = JsonParse(lsUser) as TUser
  // console.log('hihihi', data)

  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10">
        <Container fluid="lg" className="p-3">
          <div>
            <div className={styles.RowDisplay}>
              <div className="d-flex align-items-center gap-3">
                <div>Xếp hạng theo:</div>
                <Dropdown
                  className="text-white"
                  onSelect={(eventKey: any) => {
                    setRankingDropdownPos(eventKey)
                  }}
                >
                  <Dropdown.Toggle id="dropdown-basic">
                    {rankingDropdown[rankingDropdownPos].showType}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {rankingDropdown.map((d, index) => (
                      <Dropdown.Item
                        href="#/action-1"
                        eventKey={index}
                        key={index}
                      >
                        {d.showType}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {/* <div className={styles.RowDisplay}>
                  <div>Tìm kiếm:</div>
                  <div>Search</div>
                </div> */}
            </div>
            <div>
              <RankingBoard rankingList={data} />
            </div>
          </div>
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default RankingPage
