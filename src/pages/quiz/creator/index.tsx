import { NextPage } from 'next'
import React from 'react'
import { Accordion, Col, Container, Row } from 'react-bootstrap'
import NavBar from '../../../components/NavBar/NavBar'

const QuizCreator: NextPage = () => {
  return (
    <>
      <NavBar />
      <Container fluid="lg" className="pt-64px min-vh-100">
        <Accordion id="itemQuestion" defaultActiveKey="0">
          <Accordion.Item eventKey="0" className="overflow-hidden">
            <Accordion.Header>
              <Row className="w-100 m-0">
                <Col className="d-flex align-items-center ps-0">
                  <div
                    style={{ width: 36, height: 36 }}
                    className="rounded-6px bg-info me-3"
                    onClick={() => null}
                  ></div>
                  <div className='fw-medium'>Câu hỏi 1</div>
                </Col>
                <Col className="d-flex align-items-center justify-content-end pe-0">
                  <div
                    style={{ width: 36, height: 36 }}
                    className="rounded-6px bg-info me-3"
                    onClick={() => null}
                  ></div>
                  <div
                    style={{ width: 36, height: 36 }}
                    className="rounded-6px bg-info me-3"
                    onClick={() => null}
                  ></div>
                  <div
                    style={{ width: 36, height: 36 }}
                    className="rounded-6px bg-info"
                    onClick={() => null}
                  ></div>
                </Col>
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
            <div className="accordion-button rounded-0">dsad</div>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  )
}

export default QuizCreator
