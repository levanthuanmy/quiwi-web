import _ from 'lodash'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { Container, Dropdown } from 'react-bootstrap'
import MenuBar from '../../components/MenuBar/MenuBar'
import NavBar from '../../components/NavBar/NavBar'
import RankingBoard from '../../components/Ranking/RankingBoard'
import { RankingProps } from '../../components/Ranking/RankingRow'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { TUser } from '../../types/types'
import { HOME_MENU_OPTIONS } from '../../utils/constants'
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
  const [isExpand, setIsExpand] = useState<boolean>(false)
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
    <>
      <NavBar />
      <div className="d-flex pt-64px min-vh-100">
        <MenuBar
          isExpand={isExpand}
          setIsExpand={setIsExpand}
          menuOptions={HOME_MENU_OPTIONS}
          isFullHeight={true}
        />
        <div className="ps-5 w-100 transition-all-150ms bg-secondary bg-opacity-10">
          <Container fluid="lg" className="p-3">
            <div>
              <div className={styles.RowDisplay}>
                <div className={styles.RowDisplay}>
                  <div>Xếp hạng theo:</div>
                  <Dropdown
                    onSelect={(eventKey: any) => {
                      setRankingDropdownPos(eventKey)
                    }}
                  >
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {rankingDropdown[rankingDropdownPos].showType}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {rankingDropdown.map((d, index) => (
                        <Dropdown.Item href="#/action-1" eventKey={index}>
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
      </div>
    </>
  )
}

export default RankingPage
