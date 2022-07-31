import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Breadcrumb, Col, Container, Modal, Row } from 'react-bootstrap'

import useSWR from 'swr'
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout'
import { HistoryDropdownButton } from '../../../components/HistoryDropdownButton/HistoryDropdownButton'
import Loading from '../../../components/Loading/Loading'
import { get } from '../../../libs/api'
import { TApiResponse, TGameHistory, TGameModeEnum } from '../../../types/types'
import { GAME_MODE_MAPPING } from '../../../utils/constants'
import { formatDate_HHmmDDMMMYYYY } from '../../../utils/helper'

import PlayerTab from '../../../components/DetailedHistoryComponents/PlayerTab.tx/PlayerTab'
import QuestionTab from '../../../components/DetailedHistoryComponents/QuestionTab/QuesionTab'
import SummaryTab from '../../../components/DetailedHistoryComponents/SummaryTab/SummaryTab'
import MyTabBar from '../../../components/MyTabBar/MyTabBar'
import MyModal from '../../../components/MyModal/MyModal'
import Link from 'next/link'

const DetailedHistoryPage: NextPage = () => {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [tabs, setTabs] = useState<
    {
      title: string
    }[]
  >([])
  const { id } = router.query

  const { data, isValidating } = useSWR<TApiResponse<TGameHistory>>(
    [`/api/games/game-history/${id}`, true],
    get,
    {
      revalidateOnFocus: false,
    }
  )

  const [showError, setShowError] = useState('')

  useEffect(() => {
    if (data) {
      if (data.response) {
        setTabs([
          {
            title: 'Tổng quan',
          },
          {
            title: `Người chơi (${data.response?.players.length})`,
          },
          {
            title: `Câu hỏi (${data.response?.quiz.questions.length})`,
          },
        ])
      } else {
        setShowError('Không tìm thấy lịch sử')
      }
    }
  }, [data])

  return (
    <DashboardLayout>
      <div className="w-100 bg-white bg-opacity-10 min-vh-100">
        {data?.response ? (
          <Container fluid="lg">
            <Row className="flex-wrap pb-2">
              <Col xs={7} md={8}>
                <div className="d-flex justify-content-between align-items-center">
                  <h4>
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb m-0 p-0">
                        <li className="breadcrumb-item text-primary">
                          <Link href="/history">Lịch sử</Link>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Chi tiết lịch sử
                        </li>
                      </ol>
                    </nav>
                  </h4>

                  {/* <h4>Lịch sử</h4> */}
                  <div>
                    <HistoryDropdownButton
                      key={data.response.id}
                      isFromHistoryPage={false}
                      gameHistory={data.response}
                    />
                  </div>
                </div>
                <h1>{data.response.quiz.title}</h1>
              </Col>
              <Col className="py-3">
                <div className="ps-2 pb-2 border-bottom border-secondary">
                {GAME_MODE_MAPPING[data.response.mode as TGameModeEnum]}
                </div>

                <div className="ps-2 py-2 border-bottom border-secondary">
                  {formatDate_HHmmDDMMMYYYY(data.response.createdAt)}
                </div>
                {data.response.isCommunityPlay ? (
                  data.response.quiz?.userId ? (
                    <div className="ps-2 py-2">
                      Quiz này của{' '}
                      <span className="fw-medium">
                        <Link
                          href={`/users/${data.response.quiz?.userId || 0}`}
                        >
                          {data.response.quiz?.user?.name ||
                            data.response.quiz?.user?.username}
                        </Link>
                      </span>
                    </div>
                  ) : null
                ) : (
                  <div className="ps-2 py-2">
                    Tổ chức bởi{' '}
                    <span className="fw-medium">
                      <Link href={`/users/${data.response.hostId}`}>
                        {data.response.host?.name ||
                          data.response.host?.username}
                      </Link>
                    </span>
                  </div>
                )}
              </Col>
            </Row>
            <MyTabBar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              tabs={tabs.map((tab) => tab.title)}
            />

            <div className="pt-3">
              {currentTab === 0 ? (
                <SummaryTab game={data.response} />
              ) : currentTab === 1 ? (
                <PlayerTab game={data.response} />
              ) : currentTab === 2 ? (
                <QuestionTab game={data.response} />
              ) : (
                <></>
              )}
            </div>
          </Container>
        ) : (
          <Loading />
        )}
        <MyModal
          onHide={() => {
            setShowError('')
          }}
          show={showError.length > 0}
          size="sm"
          inActiveButtonTitle="Quay lại"
          inActiveButtonCallback={() => {
            setShowError('')
            router.push('/history')
          }}
          header={
            <Modal.Title className={'text-danger'}>Thông báo</Modal.Title>
          }
        >
          <div>{showError}</div>
        </MyModal>
      </div>
    </DashboardLayout>
  )
}

export default DetailedHistoryPage
