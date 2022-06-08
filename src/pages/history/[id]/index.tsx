import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

import useSWR from 'swr'
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout'
import { HistoryDropdownButton } from '../../../components/HistoryDropdownButton/HistoryDropdownButton'
import Loading from '../../../components/Loading/Loading'
import { get } from '../../../libs/api'
import { TApiResponse, TGameHistory } from '../../../types/types'
import { GAME_MODE_MAPPING } from '../../../utils/constants'
import { formatDate_HHmmDDMMMYYYY } from '../../../utils/helper'

import { calculateScorePercentages } from '../../../utils/exportToExcel'
import Pie from '../../../components/Pie/Pie'
import _ from 'lodash'
require('dayjs/locale/vi')

const DetailedHistoryPage: NextPage = () => {
  const router = useRouter()

  const [conrrectPercentages, setConrrectPercentages] = useState({})
  const { id } = router.query
  console.log('==== ~ id', id)

  const { data, isValidating } = useSWR<TApiResponse<TGameHistory>>(
    [`/api/games/hosted-game-history/${id}`, true],
    get
  )

  useEffect(() => {
    if (data) {
      setConrrectPercentages(calculateScorePercentages(data.response))
    }
  }, [data])

  return (
    <DashboardLayout>
      <div className="w-100 bg-white bg-opacity-10 min-vh-100">
        {data?.response ? (
          <Container fluid="lg">
            <Row className="flex-wrap">
              <Col xs={8}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-medium fs-22px">Lịch sử</div>
                  <div>
                    <HistoryDropdownButton
                      key={data.response.id}
                      isFromHistoryPage={false}
                      gameHistory={data.response}
                    />
                  </div>
                </div>
                <div className="fw-medium fs-32px">
                  {data.response.quiz.title}
                </div>
              </Col>
              <Col xs={4} className="py-3">
                <div className="ps-2">
                  Chế độ chơi: {GAME_MODE_MAPPING[data.response.mode]}
                </div>
                <hr></hr>
                <div className="ps-2">
                  Ngày: {formatDate_HHmmDDMMMYYYY(data.response.createdAt)}
                </div>
                <hr></hr>
                <div className="ps-2">
                  Chủ phòng:{' '}
                  {data.response.host.name ?? data.response.host.username}
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Pie
                      percentage={_.get(
                        conrrectPercentages,
                        'correctAnswersPercentage',
                        0
                      )}
                      colour="green"
                    />
                    Phan tram chinh xac
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={3}>
                <Card>
                  <Card.Body>
                    <div className="ps-2 d-flex justify-content-between">
                      <div>Số người chơi</div>
                      <div>{data.response.players.length}</div>
                    </div>
                    <hr></hr>
                    <div className="ps-2 d-flex justify-content-between">
                      <div>Số câu hỏi</div>
                      <div>{data.response.quiz.questions.length}</div>
                    </div>
                    <hr></hr>
                    <div className="ps-2 d-flex justify-content-between">
                      <div>Mã phòng</div>
                      <div>{data.response.invitationCode}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        ) : (
          <Loading />
        )}
      </div>
    </DashboardLayout>
  )
}

export default DetailedHistoryPage
