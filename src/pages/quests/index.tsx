import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Col, Collapse, Container, Row } from 'react-bootstrap'
import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
import MenuBar from '../../components/MenuBar/MenuBar'
import NavBar from '../../components/NavBar/NavBar'
import { homeMenuOptions } from '../../utils/constants'
import classNames from 'classnames'
import QuestItem from '../../components/QuestItem/QuestItem'

const QuestPage: NextPage = () => {

  const [isExpand, setIsExpand] = useState<boolean>(true)
  const authNavigate = useAuthNavigation()
  const [toggleState, setToggleState] = useState<number>(1);

  const toggleTab = (index: number) => {
    setToggleState(index);
  }


  return (
    <>
      <NavBar />
      <div className="d-flex pt-64px min-vh-100">
        <MenuBar
          isExpand={isExpand}
          setIsExpand={setIsExpand}
          menuOptions={homeMenuOptions}
          isFullHeight={true}
        />
        <div style={{ paddingLeft: isExpand ? 240 : 48 }}
          className="w-100 transition-all-150ms" >
          <Row className = "justify-content-md-center">
            <Col sm = {8}>
            <nav className="nav flex-column flex-sm-row ">
                <a className={"flex-sm-fill text-sm-center nav-link navbar-quest " + (toggleState === 1 ? " active-tab-with-green " : " tab-with-green ")} onClick={() => setToggleState(1)}>Nhiệm vụ ngày</a>
                <a className={"flex-sm-fill text-sm-center nav-link navbar-quest" + (toggleState === 2 ? " active-tab-with-green " : " tab-with-green ")} onClick={() => setToggleState(2)}>Nhiệm vụ tuần</a>
                <a className={"flex-sm-fill text-sm-center nav-link navbar-quest" + (toggleState === 3 ? " active-tab-with-green " : " tab-with-green ")} onClick={() => setToggleState(3)}>Nhiệm vụ tháng</a>
                <a className={"flex-sm-fill text-sm-center nav-link navbar-quest" + (toggleState === 4 ? " active-tab-with-green " : " tab-with-green ")} onClick={() => setToggleState(4)}>Nhiệm vụ đặc biệt</a>
              </nav></Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col sm = {10}>
              <QuestItem></QuestItem></Col>
            </Row>
        </div>
      </div>
    </>
  )
}

export default QuestPage
