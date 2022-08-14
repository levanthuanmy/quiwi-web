import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import Loading from '../../components/Loading/Loading'
import LoadingFullScreen from '../../components/LoadingFullScreen/Loading'
import { MyPagination } from '../../components/MyPagination/MyPagination'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuiz } from '../../types/types'
const MyLibPage: NextPage = () => {
  const pageSize = 9
  const [pageIndex, setPageIndex] = useState(1)

  const [quizResponse, setquizResponse] =
    useState<TApiResponse<TPaginationResponse<TQuiz>>>()

  useEffect(() => {
    const getQuizzes = async () => {
      const res: TApiResponse<TPaginationResponse<TQuiz>> = await get(
        `/api/quizzes/my-quizzes`,
        true,
        {
          filter: {
            relations: ['questions', 'questions.questionAnswers'],
            order: { createdAt: 'DESC' },
          },
          pageIndex: pageIndex,
          pageSize: pageSize,
        }
      )
      if (res.response) {
        setquizResponse(res)
      }
    }
    getQuizzes()
  }, [pageIndex, pageSize])

  const handlePageClick = (selected: { selected: number }) => {
    setPageIndex(Number(selected.selected) + 1)
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, 10)
  }
  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10 min-vh-100">
        <Container fluid="lg" className="p-3">
          <Row>
            <Col xs="12" className="fw-medium mb-3">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <h1>Quiz đã tạo</h1>
              </div>
            </Col>
            {quizResponse?.response ? (
              quizResponse.response.totalItems ? (
                quizResponse.response.items.map((quiz, key) => (
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
              <div className="text-center mt-5 d-flex justify-content-center align-items-center">
                <Loading  color='#009883'/>
              </div>
            )}
          </Row>

          {quizResponse?.response?.totalItems ? (
            <Row className="mt-3">
              <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <MyPagination
                  handlePageClick={handlePageClick}
                  totalPages={quizResponse?.response.totalPages ?? 0}
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
