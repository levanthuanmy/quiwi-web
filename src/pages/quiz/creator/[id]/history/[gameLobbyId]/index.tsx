import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'

import Link from 'next/link'
import useSWR from 'swr'
import PlayerTab from '../../../../../../components/DetailedHistoryComponents/PlayerTab.tx/PlayerTab'
import QuestionTab from '../../../../../../components/DetailedHistoryComponents/QuestionTab/QuesionTab'
import SummaryTab from '../../../../../../components/DetailedHistoryComponents/SummaryTab/SummaryTab'
import { HistoryDropdownButton } from '../../../../../../components/HistoryDropdownButton/HistoryDropdownButton'
import Loading from '../../../../../../components/Loading/Loading'
import MyModal from '../../../../../../components/MyModal/MyModal'
import MyTabBar from '../../../../../../components/MyTabBar/MyTabBar'
import { get } from '../../../../../../libs/api'
import {
  GameHistoryByQuiz,
  TApiResponse,
  TGameHistory,
  TGameModeEnum,
  TQuiz,
} from '../../../../../../types/types'
import { GAME_MODE_MAPPING } from '../../../../../../utils/constants'
import { formatDate_HHmmDDMMMYYYY } from '../../../../../../utils/helper'
import NavBar from '../../../../../../components/NavBar/NavBar'
import QuizBannerWithTitle from '../../../../../../components/CardQuizInfo/QuizBannerWithTitle/QuizBannerWithTitle'

const DetailedHistoryPage: NextPage = () => {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [tabs, setTabs] = useState<
    {
      title: string
    }[]
  >([])
  const { id, gameLobbyId, invitationCode } = router.query

  const { data, isValidating } = useSWR<TApiResponse<TGameHistory>>(
    [
      `/api/quizzes/my-quizzes/${id}/history/${gameLobbyId}`,
      true,
      { secretKey: invitationCode },
    ],
    get,
    {
      revalidateOnFocus: false,
    }
  )

  const [showError, setShowError] = useState('')

  const [history, setHistory] = useState<GameHistoryByQuiz>()
  const [quiz, setQuiz] = useState<TQuiz>()
  const [isDetailed, setIsDetailed] = useState(false)

  const [chosenHistory, setChosenHistory] = useState<string | null>(null)
  const [errorMessage, setError] = useState('')

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const res = await get<TApiResponse<TQuiz>>(
          `/api/quizzes/my-quizzes/${id}`,
          true,
          { filter: { relations: ['quizCategories'] } }
        )

        if (res.response) {
          setQuiz(res.response)
        }
      } catch (error) {
        console.log('getQuiz - error', error)
      }
    }

    if (id) {
      getQuiz()
    }
  }, [id])
  useEffect(() => {
    if (data) {
      if (data.response) {
        setTabs([
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
    <div className="w-100 bg-white bg-opacity-10 min-vh-100">
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <QuizBannerWithTitle
        isValidating={isValidating}
        quiz={quiz}
        setQuiz={setQuiz}
      />
      {data?.response ? (
        <Container fluid="lg pt-3 pb-5 mt-3">
          <Row className="flex-wrap pb-2">
            <Col xs={7} md={8}>
              <div className="d-flex justify-content-between align-items-center">
                <h4>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb m-0 p-0">
                      <li className="breadcrumb-item text-primary">
                        <Link href={`/quiz/creator/${id}/history/`}>Lịch sử </Link>
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
              </div>
              <h2>Mã mời: {invitationCode}</h2>
            </Col>
            <Col className="py-3">
              <div className="ps-2 pb-2 border-bottom border-secondary">
                {GAME_MODE_MAPPING[data.response.mode as TGameModeEnum]}
              </div>

              <div className="ps-2 py-2 border-bottom border-secondary">
                {formatDate_HHmmDDMMMYYYY(data.response.createdAt)}
              </div>
            </Col>
          </Row>
          <MyTabBar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabs={tabs.map((tab) => tab.title)}
          />

          <div className="pt-3">
            {currentTab === 0 ? (
              <PlayerTab game={data.response} />
            ) : currentTab === 1 ? (
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
        header={<Modal.Title className={'text-danger'}>Thông báo</Modal.Title>}
      >
        <div>{showError}</div>
      </MyModal>
    </div>
  )
}

export default DetailedHistoryPage
