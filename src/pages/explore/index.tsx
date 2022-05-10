import { NextPage } from 'next'
import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import useSWR from 'swr'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import MenuBar from '../../components/MenuBar/MenuBar'
import NavBar from '../../components/NavBar/NavBar'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuiz } from '../../types/types'
import { HOME_MENU_OPTIONS } from '../../utils/constants'

const ExplorePage: NextPage = () => {
  const [isExpand, setIsExpand] = useState<boolean>(false)
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
    <>
      <NavBar />
      <div className="d-flex pt-64px min-vh-100">
        <MenuBar
          isExpand={isExpand}
          setIsExpand={setIsExpand}
          menuOptions={HOME_MENU_OPTIONS}
          isFullHeight={true}
        />
        <div className="ps-5 w-100 transition-all-150ms bg-secondary bg-opacity-10">
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
      </div>
    </>
  )
}

export default ExplorePage
