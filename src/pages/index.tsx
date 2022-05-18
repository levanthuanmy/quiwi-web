import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../components/ItemQuiz/ItemQuiz'
import MyButton from '../components/MyButton/MyButton'
import MyInput from '../components/MyInput/MyInput'
import { MyScrollMenu } from '../components/MyScrollMenu/MyScrollMenu'
import { useAuth } from '../hooks/useAuth/useAuth'
import { get, post } from '../libs/api'
import {
  TApiResponse,
  TPaginationResponse,
  TQuiz,
  TQuizBodyRequest,
} from '../types/types'

const Home: NextPage = () => {
  const [invitationCode, setInvitationCode] = useState<string>('')
  const [invitationInputError, setInvitationInputError] = useState<string>('')
  const authContext = useAuth()
  const user = authContext.getUser()
  const router = useRouter()
  const params = {
    filter: {
      order: {
        numUpvotes: 'DESC',
        numPlayed: 'DESC',
      },
      where: {
        isPublic: true,
        isLocked: false,
      },
    },
    pageIndex: 1,
    pageSize: 5,
  }
  const { data: popularQuizzesResponse } = useSWR<
    TApiResponse<TPaginationResponse<TQuiz>>
  >([`api/quizzes`, false, params], get, { revalidateOnFocus: false })

  const onJoinRoom = async () => {
    if (invitationCode.trim().length === 0) {
      setInvitationInputError('Vui lòng nhập mã phòng')
      return
    }

    const res: TApiResponse<any> = await get(
      `/api/games/check-room/${invitationCode}`,
      true
    )
    router.push(`/lobby/join?invitationCode=${invitationCode}`)
  }

  const handleToQuizCreator = async () => {
    try {
      const body: TQuizBodyRequest = {
        title: 'Quiz chưa có tên',
        description: '',
        isPublic: false,
        isLocked: false,
        numPlayed: 0,
        numUpvotes: 0,
        numDownvotes: 0,
        questions: [],
      }
      const res = await post<TApiResponse<TQuiz>>(
        `/api/quizzes`,
        {},
        body,
        true
      )

      router.push(`/quiz/creator/${res.response.id}`)
    } catch (error) {
      console.log('handleToQuizCreator - error', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10">
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
                        className={'pb-12px'}
                        errorText={invitationInputError}
                        placeholder="Nhập mã tham gia"
                        onChange={(e) => {
                          setInvitationInputError('')
                          setInvitationCode(e.target.value)
                        }}
                      />
                    </Col>
                    <Col xs="12" sm="4" xl="3" className="ps-sm-2">
                      <MyButton
                        className={`fw-medium text-white w-100`}
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
                    onClick={handleToQuizCreator}
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
            <div className="fs-22px fw-medium pb-3">Phổ biến</div>
            <MyScrollMenu>
              {popularQuizzesResponse?.response.items?.map((quiz, key) => (
                <Col xs="12" md="6" lg="4" key={key} className="mb-3">
                  <ItemQuiz quiz={quiz} />
                </Col>
              ))}
            </MyScrollMenu>
          </div>

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
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default Home
