import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
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
          relations: ['questions', 'questions.questionAnswers'],
          where: { isPublic: true, isLocked: false },
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
          <Form
            className="d-flex w-100 gap-3"
            onChange={(e: any) => {
              !e?.target?.value?.length && router.replace(`/explore`)
            }}
            onSubmit={(e) => {
              e.preventDefault()
              router.replace('/explore?q=' + _.get(e, 'target[0].value'))
            }}
          >
            <div className="w-100 mb-3">
              <MyInput
                name="q"
                className="border-0"
                placeholder="Tìm kiếm..."
                onClick={(e: any) => e?.target?.select()}
              />
            </div>
            <MyButton
              type="submit"
              className="bi bi-search px-3 text-white"
            ></MyButton>
          </Form>

          <div className="fs-32px fw-medium mb-3">
            {q?.length ? q : 'Hãy tìm kiếm gì đó...'}
          </div>

          <Row>
            {data?.response?.items?.map((quiz, key) => (
              <Col xs="12" sm="6" lg="4" key={key} className="mb-3">
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
