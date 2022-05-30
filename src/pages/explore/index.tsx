import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import SearchBar from '../../components/SearchBar/SearchBar'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuiz } from '../../types/types'

const ExplorePage: NextPage = () => {
  const router = useRouter()
  const { q } = router.query

  const { data, isValidating } = useSWR<
    TApiResponse<TPaginationResponse<TQuiz>>
  >(
    [
      `/api/quizzes`,
      false,
      {
        filter: {
          relations: ['questions', 'user'],
          where: { isPublic: true, isLocked: false },
          order: {
            createdAt: 'DESC',
          },
        },
        q,
      },
    ],
    get,
    {
      revalidateOnFocus: false,
    }
  )

  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10 min-vh-100">
        <Container fluid="lg" className="p-3">
          <SearchBar pageUrl="explore" inputClassName="border-0" />

          <div className="fs-32px fw-medium mb-3">
            {q?.length ? q : 'Hãy tìm kiếm gì đó...'}
          </div>

          <Row>
            {data?.response?.items?.map((quiz, key) => (
              <Col xs="12" md="6" lg="4" key={key} className="mb-3">
                <ItemQuiz quiz={quiz} exploreMode />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default ExplorePage
