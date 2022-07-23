import { NextPage } from 'next'
import React, { useState } from 'react'
import { Alert, Card, Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import LoadingFullScreen from '../../components/LoadingFullScreen/Loading'
import { MyPagination } from '../../components/MyPagination/MyPagination'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuiz } from '../../types/types'
import HelpToolTip from '../../components/HelpToolTip/HelpToolTip'
const MyLibPage: NextPage = () => {
  const pageSize = 9
  const [pageIndex, setPageIndex] = useState(1)
  const params = {
    filter: {
      relations: ['questions', 'questions.questionAnswers'],
      order: { createdAt: 'DESC' },
    },
    pageIndex: pageIndex,
    pageSize: pageSize,
  }
  const { data, isValidating } = useSWR<
    TApiResponse<TPaginationResponse<TQuiz>>
  >(['/api/quizzes/my-quizzes', true, params], get, {
    revalidateOnFocus: false,
  })
  const handlePageClick = (selected: { selected: number }) => {
    setPageIndex(Number(selected.selected) + 1)
  }
  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10 min-vh-100">
        <Container fluid="lg" className="p-3">
          {isValidating ? (
            'fetching...'
          ) : (
            <Row>
              <Col xs="12" className="fw-medium mb-3">
                <h1>Quiz đã tạo      
                </h1>
              </Col>
              {data?.response ? (
                data.response.totalItems ? (
                  data.response.items.map((quiz, key) => (
                    <Col xs="12" md="6" lg="4" key={key} className="mb-3">
                      <ItemQuiz quiz={quiz} />
                    </Col>
                  ))
                ) : (
                  <Alert
                    variant="primary"
                    className="text- w-75 mx-auto fs-16px py-4 fw-medium"
                  >
                    Ấn nút &quot;Tạo Quiz&quot; để tạo Quiz cho riêng mình
                  </Alert>
                )
              ) : (
                <LoadingFullScreen />
              )}
            </Row>
          )}
          {data?.response?.totalItems ? (
            <Row className="mt-3">
              <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <MyPagination
                  handlePageClick={handlePageClick}
                  totalPages={data?.response.totalPages ?? 0}
                />
              </Col>
            </Row>
          ) : null}
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default MyLibPage
