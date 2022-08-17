import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import Loading from '../../components/Loading/Loading'
import { MyPagination } from '../../components/MyPagination/MyPagination'
import SearchBar from '../../components/SearchBar/SearchBar'
import { get } from '../../libs/api'
import { TApiResponse, TPaginationResponse, TQuiz } from '../../types/types'
const MyLibPage: NextPage = () => {
  const router = useRouter()
  const { q } = router.query

  const pageSize = 9
  const [pageIndex, setPageIndex] = useState(1)

  const [isLoading, setIsLoading] = useState(true)

  const [quizResponse, setquizResponse] =
    useState<TApiResponse<TPaginationResponse<TQuiz>>>()

  useEffect(() => {
    const getQuizzes = async () => {
      setIsLoading(true)
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
          q,
        }
      )
      if (res.response) {
        setquizResponse(res)
      }
      setIsLoading(false)
    }
    getQuizzes()
  }, [pageIndex, pageSize, q])

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

            <Col xs="12" className="fw-medium mb-3">
              <div className="fw-medium mb-1 bi bi-search d-flex gap-2 align-items-center ">
                Tìm kiếm quiz
              </div>
              <SearchBar pageUrl="my-lib" inputClassName="border-0" />
            </Col>
            {isLoading ? (
              <div className="text-center mt-5 d-flex justify-content-center align-items-center">
                <Loading color="#009883" />
              </div>
            ) : quizResponse?.response ? (
              quizResponse.response.totalItems > 0 ? (
                quizResponse.response.items.map((quiz, key) => (
                  <Col xs="12" md="6" lg="4" key={key} className="mb-3">
                    <ItemQuiz quiz={quiz} />
                  </Col>
                ))
              ) : q ? (
                <div className="fs-4 text-center">
                  Chúng tôi không tìm thấy bộ quiz phù hợp
                </div>
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
                <Loading color="#009883" />
              </div>
            )}
          </Row>

          {!isLoading && quizResponse?.response?.totalItems ? (
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
