import { NextPage } from 'next'
import React, { useState } from 'react'
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap'
// import useSWR from 'swr'
import MenuBar from '../../components/MenuBar/MenuBar'
import NavBar from '../../components/NavBar/NavBar'
// import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
// import { get } from '../../libs/api'
// import {
//     TApiResponse,
//     TPaginationResponse,
//     TQuiz
// } from '../../types/types'
import { homeMenuOptions } from '../../utils/constants'
import ItemShop from '../../components/ItemShop/ItemShop'
import classNames from 'classnames'


// const socket = io(`${API_URL}/games`, { transports: ['websocket'] })

const ItemPage: NextPage = () => {
  const [isExpand, setIsExpand] = useState<boolean>(true)
  const [toggleState, setToggleState] = useState<number>(1);
  const toggleTab = (index:number) => {
    setToggleState(index)
  }

  return (
    <>
      <NavBar />
      <div className="d-flex pt-64px min-vh-100" style={{ backgroundColor: '#00A991' }}>
        <MenuBar
          isExpand={isExpand}
          setIsExpand={setIsExpand}
          menuOptions={homeMenuOptions}
          isFullHeight={true}
        />
        <div
          style={{ paddingLeft: isExpand ? 240 : 48 }}
          className="w-100 transition-all-150ms"
        >
          <Container fluid="lg">
            <Row className='mt-2 pt-2 align-items-center'>
              <Col style={{ color: 'white', fontWeight: 'bold', fontSize: '25px', textAlign:'center' }} xs={2}>Cửa hàng vật phẩm</Col>
              <Col xs={8} style={{display:'flex', justifyContent:'center'}}>
                <div className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'} onClick={() => toggleTab(1)}>Mũ</div>
                <div className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'} onClick={() => toggleTab(2)}>Áo</div>
                <div className={toggleState === 3 ? 'tabs active-tabs' : 'tabs'} onClick={() => toggleTab(3)}>Vật phẩm chức năng</div>
                <div className={toggleState === 4 ? 'tabs active-tabs' : 'tabs'} onClick={() => toggleTab(4)}>Huy chương</div>
              </Col>
              <Col xs={2}>
                <div style={{display:'flex', justifyContent:'flex-start', backgroundColor:'#006557', fontSize:'25px', borderRadius:10, padding:2, fontWeight: 'bold', color:'#D1B550'}}>
                  <div className={classNames('bi bi-coin')} style={{marginLeft:10}}>
                  </div>
                  <div style={{paddingLeft:'10px'}}>
                    800,000
                  </div>
                </div>
              </Col>
            </Row>
            <Row className={toggleState === 1 ? 'content' : 'deactive-content'}>
              <Col className='p-3' xs={3}><ItemShop /></Col>
              <Col className='p-3' xs={3}><ItemShop /></Col>
              <Col className='p-3' xs={3}><ItemShop /></Col>
              <Col className='p-3' xs={3}><ItemShop /></Col>
              <Col className='p-3' xs={3}><ItemShop /></Col>
              <Col className='p-3' xs={3}><ItemShop /></Col>
              <Col className='p-3' xs={3}><ItemShop /></Col>
              <Col className='p-3' xs={3}><ItemShop /></Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  )
}

export default ItemPage
