import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import QuestItem from '../../components/QuestItem/QuestItem'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import {
  TApiResponse,
  TQuest,
  TPaginationResponse
} from '../../types/types'

const QuestPage: NextPage = () => {
  const [toggleState, setToggleState] = useState<number>(0)
  const [itemsResponse, setItemsResponse] =
    useState<TPaginationResponse<TQuest>>()
  const authContext = useAuth()
  useEffect(() => {
    const getItemCategories = async () => {
      if (authContext !== undefined) {
        let currentUserId = authContext.getUser()?.id || null
        try {
          const popularParams = {
            filter: {
              relations: ["questRequirement", "questGoal", "userQuest"],

              where: {
                userQuest: {
                  userId: currentUserId
                }
              },
            }
          }

          const res: TApiResponse<TPaginationResponse<TQuest>> = await get(
            `/api/quest/all`,
            true,
            popularParams
          )
          if (res.response) {
            console.log("ÁDAS")
            console.log(res.response)
            setItemsResponse(res.response)
            console.log(itemsResponse)
          }
        } catch (error) {
          alert('Có lỗi nè')
          console.log(error)
        }
      }
    }

    getItemCategories()
    // if (!itemsResponse){
    //   getItems()
    // }
  }, [])

  const tabOptions = [
    'Nhiệm vụ ngày',
    'Nhiệm vụ tuần',
    'Nhiệm vụ tháng',
    'Nhiệm vụ đặc biệt',
  ]

  return (
    <DashboardLayout>
      <Container fluid="lg" className="p-3">
        <div className="">
          <MyTabBar
            currentTab={toggleState}
            setCurrentTab={setToggleState}
            tabs={tabOptions}
          />

          <Row
            className="justify-content-md-center m-0 my-4"
            style={{ paddingBottom: '17px' }}
          >
            {toggleState === 0 ? (
              <>
                {itemsResponse?.items?.map((item, idx) => (
                  <Col xs={12} className="p-0 mb-3">
                    <QuestItem
                      props={item}
                    ></QuestItem>
                  </Col>
                ))}
              </>
            ) : toggleState === 2 ? (
              <>

              </>
            ) : null}
          </Row>
        </div>
      </Container>
    </DashboardLayout>
  )
}

export default QuestPage
