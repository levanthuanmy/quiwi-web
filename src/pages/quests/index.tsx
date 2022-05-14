import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import QuestItem from '../../components/QuestItem/QuestItem'

const QuestPage: NextPage = () => {
  const [toggleState, setToggleState] = useState<number>(1)

  return (
    <DashboardLayout>
      <div className="w-100">
        <Row
          className="justify-content-md-center"
          style={{ paddingBottom: '30px' }}
        >
          <Col sm={8}>
            <nav className="nav flex-column flex-sm-row ">
              <a
                className={classNames(
                  'flex-sm-fill text-sm-center nav-link navbar-quest',
                  {
                    'active-tab-with-green': toggleState === 1,
                    'tab-with-green': toggleState !== 1,
                  }
                )}
                onClick={() => setToggleState(1)}
              >
                Nhiệm vụ ngày
              </a>
              <a
                className={classNames(
                  'flex-sm-fill text-sm-center nav-link navbar-quest',
                  {
                    'active-tab-with-green': toggleState === 2,
                    'tab-with-green': toggleState !== 2,
                  }
                )}
                onClick={() => setToggleState(2)}
              >
                Nhiệm vụ tuần
              </a>
              <a
                className={classNames(
                  'flex-sm-fill text-sm-center nav-link navbar-quest',
                  {
                    'active-tab-with-green': toggleState === 3,
                    'tab-with-green': toggleState !== 3,
                  }
                )}
                onClick={() => setToggleState(3)}
              >
                Nhiệm vụ tháng
              </a>
              <a
                className={classNames(
                  'flex-sm-fill text-sm-center nav-link navbar-quest',
                  {
                    'active-tab-with-green': toggleState === 4,
                    'tab-with-green': toggleState !== 4,
                  }
                )}
                onClick={() => setToggleState(4)}
              >
                Nhiệm vụ đặc biệt
              </a>
            </nav>
          </Col>
        </Row>

        {toggleState === 1 ? (
          <div>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={3}
                  targetValue={5}
                  name={'Top 1 thần thánh'}
                  des={'Có 5 lần đạt top 1'}
                  isDone={false}
                ></QuestItem>
              </Col>
            </Row>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={1}
                  targetValue={1}
                  name={'Top 3 thần thánh'}
                  des={'Có 1 lần đạt top 3'}
                  isDone={true}
                ></QuestItem>
              </Col>
            </Row>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={1}
                  targetValue={5}
                  name={'Top 2 thần thánh'}
                  des={'Có 5 lần đạt top 2'}
                  isDone={false}
                ></QuestItem>
              </Col>
            </Row>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={10}
                  targetValue={10}
                  name={'Hoàn thành 10 bài quiz'}
                  des={'Hoàn thành đầy đủ 10 bài quiz'}
                  isDone={false}
                ></QuestItem>
              </Col>
            </Row>
          </div>
        ) : toggleState === 3 ? (
          <div>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={3}
                  targetValue={5}
                  name={'Top 1 thần thánh'}
                  des={'Có 5 lần đạt top 1'}
                  isDone={false}
                ></QuestItem>
              </Col>
            </Row>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: '17px' }}
            >
              <Col sm={9}>
                <QuestItem
                  currentValue={10}
                  targetValue={10}
                  name={'Hoàn thành 10 bài quiz'}
                  des={'Hoàn thành đầy đủ 10 bài quiz'}
                  isDone={false}
                ></QuestItem>
              </Col>
            </Row>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}

export default QuestPage
