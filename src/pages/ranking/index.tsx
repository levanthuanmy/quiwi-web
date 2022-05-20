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

const searchByUsername = (username: string, data?: RankingProps[]) => {
  return data?.filter((d) =>
    d.username.toLowerCase().includes(username.toLowerCase())
  )
}

const RankingPage: NextPage = () => {
  const [rankingDropdownPos, setRankingDropdownPos] = useState<number>(0)
  const [data, setData] = useState<RankingProps[]>()
  const [searchVal, setSearchVal] = useState<string>('')
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

  console.log(`data: ${JSON.stringify(data)}`)
  const [lsUser] = useLocalStorage('user', '')
  const user = JsonParse(lsUser) as TUser
  // console.log('hihihi', data)

  const handleChangeSearch = () => {
    const searchValue = (document.getElementById('searchBox') as HTMLInputElement).value.trim()
    setSearchVal(searchValue)
  }

  const getListUser = () => {
    if (searchVal === '') return data
    return searchByUsername(searchVal, data)
  }
  const listUser = getListUser()

  return (
    <>
      <DashboardLayout>
        <div className="w-100 bg-secondary bg-transparent">
          <Container fluid="lg" className="p-3">
            <div>
              <div className="d-flex justify-content-between p-4">
                <div className="d-flex align-items-center gap-3">
                  <div>Xếp hạng theo:</div>
                  <Dropdown
                    className={'text-white'}
                    onSelect={(eventKey: any) => {
                      setRankingDropdownPos(eventKey)
                    }}
                  >
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className={'text-white'}
                    >
                      {rankingDropdown[rankingDropdownPos].showType}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {rankingDropdown.map((d, index) => (
                        <Dropdown.Item key={index} href="#/action-1" eventKey={index}>
                          {d.showType}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div>Tìm kiếm:</div>
                  <div>
                    <input
                      placeholder="Nhập tên người dùng để tìm kiếm"
                      style={{ width: 400 }}
                      type="text"
                      name="description"
                      id="searchBox"
                      onChange={() => handleChangeSearch()}
                    />
                  </div>
                </div>
              </div>
              <div>
                {listUser?.length === 0 ? (
                  <text>Không có user nào để hiển thị</text>
                ) : (
                  <RankingBoard rankingList={listUser} />
                )}
              </div>
            </div>
          </Container>
        </div>
      </DashboardLayout>
    </>
  )
}

export default RankingPage
