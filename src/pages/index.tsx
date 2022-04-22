import type { NextPage } from 'next'
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import MenuBar from '../components/MenuBar/MenuBar'
import MyButton from '../components/MyButton/MyButton'
import MyInput from '../components/MyInput/MyInput'
import NavBar from '../components/NavBar/NavBar'
import { useAuthNavigation } from '../hooks/useAuthNavigation/useAuthNavigation'

const Home: NextPage = () => {
  const [isExpand, setIsExpand] = useState<boolean>(true)
  const authNavigate = useAuthNavigation()
  const [invitationCode, setInvitationCode] = useState<string>('')

  const onJoinRoom = () => {
    if (invitationCode.trim().length === 0) {
      alert('Nhập mã đi bạn')
      return
    }
    authNavigate.navigate(`/lobby/join?invitationCode=${invitationCode}`)
  }
  return (
    <>
      <NavBar />
      <div className="d-flex pt-64px min-vh-100">
        <MenuBar isExpand={isExpand} setIsExpand={setIsExpand} />
        <div
          style={{ paddingLeft: isExpand ? 240 : 48 }}
          className="w-100 transition-all-150ms bg-secondary bg-opacity-10"
        >
          <div className="bg-white">
            <Container fluid="lg" className="p-3">
              <Row>
                <Col xs="12" lg="8" className="pe-lg-2 pb-3 pb-lg-0">
                  <div className="border rounded-10px p-3">
                    <div className="fs-22px fw-medium pb-4">
                      Tham gia một quiz
                    </div>

                    <Row>
                      <Col xs="12" sm="6" className="pe-sm-2 pb-3 pb-sm-0">
                        <MyInput
                          placeholder="Nhập mã tham gia"
                          onChange={(e) => {
                            setInvitationCode(e.target.value)
                          }}
                        />
                      </Col>
                      <Col xs="12" sm="4" xl="3" className="ps-sm-2">
                        <MyButton
                          className="fw-medium text-white w-100"
                          onClick={onJoinRoom}
                        >
                          Tham gia ngay
                        </MyButton>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col xs="12" lg="4" className="ps-lg-2">
                  <div className="border rounded-10px p-3">
                    <div className="fs-22px fw-medium pb-4 w-100">
                      Tạo một quiz
                    </div>
                    <MyButton
                      className="fw-medium text-white"
                      onClick={() => {
                        authNavigate.navigate('/quiz/creator')
                      }}
                    >
                      Tạo mới ngay
                    </MyButton>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>

          <Container fluid="lg" className="p-3">
            <div className="pt-4">
              <div className="fs-22px fw-medium pb-3">Đã tham gia gần đây</div>
              <Row className="overflow-auto flex-nowrap">
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
              </Row>
            </div>

            <div className="pt-4">
              <div className="fs-22px fw-medium pb-3">Đã tạo gần đây</div>
              <Row className="overflow-auto flex-nowrap">
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
              </Row>
            </div>

            <div className="pt-4">
              <div className="fs-22px fw-medium pb-3">Phổ biến</div>
              <Row className="overflow-auto flex-nowrap">
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
                <Col xs="auto">
                  <div
                    style={{ width: 278, height: 240 }}
                    className="border rounded-10px bg-white"
                  ></div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}

export default Home
