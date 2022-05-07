import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Col, Collapse, Container, Row } from 'react-bootstrap'
import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
import MenuBar from '../../components/MenuBar/MenuBar'
import NavBar from '../../components/NavBar/NavBar'
import { HOME_MENU_OPTIONS } from '../../utils/constants'
import classNames from 'classnames'
import QuestItem from '../../components/QuestItem/QuestItem'

const QuestPage: NextPage = () => {
  const [isExpand, setIsExpand] = useState<boolean>(false)
  const authNavigate = useAuthNavigation()
  const [toggleState, setToggleState] = useState<number>(1)

  const toggleTab = (index: number) => {
    setToggleState(index)
  }

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
        <div className="ps-5 w-100 transition-all-150ms">
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
          <Row
            className="justify-content-md-center"
            style={{ paddingBottom: '17px' }}
          >
            <Col sm={10}>
              <QuestItem></QuestItem>
            </Col>
          </Row>
          <Row
            className="justify-content-md-center"
            style={{ paddingBottom: '17px' }}
          >
            <Col sm={10}>
              <QuestItem></QuestItem>
            </Col>
          </Row>
          <Row
            className="justify-content-md-center"
            style={{ paddingBottom: '17px' }}
          >
            <Col sm={10}>
              <QuestItem></QuestItem>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default QuestPage
