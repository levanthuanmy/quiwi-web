import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import QuestItem from '../../components/QuestItem/QuestItem'

const QuestPage: NextPage = () => {
  const [toggleState, setToggleState] = useState<number>(0)

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
                <Col xs={12} className="p-0 mb-3">
                  <QuestItem
                    currentValue={3}
                    targetValue={5}
                    name={'Top 1 thần thánh'}
                    des={'Có 5 lần đạt top 1'}
                    isDone={false}
                  ></QuestItem>
                </Col>

                <Col xs={12} className="p-0 mb-3">
                  <QuestItem
                    currentValue={1}
                    targetValue={1}
                    name={'Top 3 thần thánh'}
                    des={'Có 1 lần đạt top 3'}
                    isDone={true}
                  ></QuestItem>
                </Col>

                <Col xs={12} className="p-0 mb-3">
                  <QuestItem
                    currentValue={1}
                    targetValue={5}
                    name={'Top 2 thần thánh'}
                    des={'Có 5 lần đạt top 2'}
                    isDone={false}
                  ></QuestItem>
                </Col>

                <Col xs={12} className="p-0 mb-3">
                  <QuestItem
                    currentValue={10}
                    targetValue={10}
                    name={'Hoàn thành 10 bài quiz'}
                    des={'Hoàn thành đầy đủ 10 bài quiz'}
                    isDone={false}
                  ></QuestItem>
                </Col>
              </>
            ) : toggleState === 2 ? (
              <>
                <Col xs={12} className="p-0 mb-3">
                  <QuestItem
                    currentValue={3}
                    targetValue={5}
                    name={'Top 1 thần thánh'}
                    des={'Có 5 lần đạt top 1'}
                    isDone={false}
                  ></QuestItem>
                </Col>

                <Col xs={12} className="p-0 mb-3">
                  <QuestItem
                    currentValue={10}
                    targetValue={10}
                    name={'Hoàn thành 10 bài quiz'}
                    des={'Hoàn thành đầy đủ 10 bài quiz'}
                    isDone={false}
                  ></QuestItem>
                </Col>
              </>
            ) : null}
          </Row>
        </div>
      </Container>
    </DashboardLayout>
  )
}

export default QuestPage
