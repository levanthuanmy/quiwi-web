import { NextPage } from 'next'
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import { MyPagination } from '../../components/MyPagination/MyPagination'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuiz } from '../../types/types'

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
              <Col xs="12" className="fs-32px fw-medium mb-3">
                Quiz của bạn
              </Col>
              {data?.response.items.map((quiz, key) => (
                <Col xs="12" md="6" lg="4" key={key} className="mb-3">
                  <ItemQuiz quiz={quiz} />
                </Col>
              ))}
            </Row>
          )}
          <Row className="mt-3">
            <Col style={{ display: 'flex', justifyContent: 'center' }}>
              <MyPagination
                handlePageClick={handlePageClick}
                totalPages={data?.response.totalPages ?? 0}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default MyLibPage
