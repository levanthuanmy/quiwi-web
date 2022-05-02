import { NextPage } from 'next'
import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import MenuBar from '../../components/MenuBar/MenuBar'
import MyButton from '../../components/MyButton/MyButton'
import NavBar from '../../components/NavBar/NavBar'
import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuiz } from '../../types/types'
import { homeMenuOptions } from '../../utils/constants'

const MyLibPage: NextPage = () => {
  const [isExpand, setIsExpand] = useState<boolean>(true)
  const authNavigate = useAuthNavigation()

  const params = {
    filter: {
      relations: ['questions', 'questions.questionAnswers'],
    },
    pageIndex: 1,
    pageSize: 100,
  }
  const { data, isValidating } = useSWR<
    TApiResponse<TPaginationResponse<TQuiz>>
  >(['/api/quizzes/my-quizzes', true, params], get)

  return (
    <>
      <NavBar />
      <div className="d-flex pt-64px min-vh-100">
        <MenuBar
          isExpand={isExpand}
          setIsExpand={setIsExpand}
          menuOptions={homeMenuOptions}
          isFullHeight={true}
        />
        <div
          style={{ paddingLeft: isExpand ? 240 : 48 }}
          className="w-100 transition-all-150ms bg-secondary bg-opacity-10"
        >
          <Container fluid="lg" className="p-3">
            {isValidating ? (
              'fetching...'
            ) : (
              <Row>
                {data?.response.items.map((quiz, key) => (
                  <Col xs="12" sm="6" md="4" lg="3" key={key}>
                    <div className="bg-white h-100 p-3 border rounded-10px">
                      <div>{quiz.title}</div>
                      <div>{quiz.description}</div>
                      <div>Số câu: {quiz.questions.length}</div>
                      <div>
                        Trạng thái: {quiz.isPublic ? 'Công khai' : 'Riêng tư'}
                      </div>
                      <MyButton
                        className="text-white mt-3 w-100"
                        onClick={(e) => {
                          authNavigate.navigate(`/host?quizId=${quiz.id}`)
                        }}
                      >
                        Bắt đầu ngay
                      </MyButton>
                    </div>
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

export default MyLibPage
