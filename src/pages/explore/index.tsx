import { NextPage } from 'next'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuiz } from '../../types/types'

const ExplorePage: NextPage = () => {
  const { data, isValidating } = useSWR<
    TApiResponse<TPaginationResponse<TQuiz>>
  >(
    [
      `/api/quizzes`,
      false,
      {
        filter: {
          relations: ['questions', 'questions.questionAnswers'],
          where: { isPublic: true, isLocked: false },
        },
      },
    ],
    get,
    {
      revalidateOnFocus: false,
    }
  )

  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10">
        <Container fluid="lg" className="p-3">
          {isValidating ? (
            'fetching...'
          ) : (
            <Row>
              <Col xs="12" className="fs-22px fw-medium mb-3">
                Khám phá
              </Col>
              {data?.response?.items?.map((quiz, key) => (
                <Col xs="12" sm="6" lg="4" key={key} className="mb-3">
                  <ItemQuiz quiz={quiz} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default ExplorePage
