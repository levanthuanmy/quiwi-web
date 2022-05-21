import classNames from 'classnames'
import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'

type MyTabBarProps = {
  tabs: string[]
  currentTab: number
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}
const MyTabBar: FC<MyTabBarProps> = ({ currentTab, setCurrentTab, tabs }) => {
  return (
    <>
      <Row className="fs-14px bg-primary bg-opacity-10 p-2 rounded-20px m-0 w-100">
        {tabs?.map((tab, key) => (
          <Col
            xs={6}
            md={3}
            xl={2}
            key={key}
            className={classNames('p-0 text-center cursor-pointer')}
            onClick={() => setCurrentTab(key)}
          >
            <div
              className={classNames(
                'p-2 rounded-14px transition-all-150ms w-100 h-100 text-truncate',
                {
                  'bg-primary text-white shadow': currentTab === key,
                }
              )}
            >
              {tab}
            </div>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default MyTabBar
