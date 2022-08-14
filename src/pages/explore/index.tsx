import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ReactSelect from 'react-select'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import Loading from '../../components/Loading/Loading'
import LoadingFullScreen from '../../components/LoadingFullScreen/Loading'
import { MyPagination } from '../../components/MyPagination/MyPagination'
import SearchBar from '../../components/SearchBar/SearchBar'
import { get } from '../../libs/api'
import HelpToolTip from '../../components/HelpToolTip/HelpToolTip'
import {
  TApiResponse,
  TPaginationResponse,
  TQuiz,
  TQuizCategory,
} from '../../types/types'

const ExplorePage: NextPage = () => {
  const router = useRouter()
  const pageSize = 12
  const [pageIndex, setPageIndex] = useState(1)
  const { q } = router.query

  const [currentCategoryId, setCurrentCategoryId] = useState<number[]>()
  const handlePageClick = (selected: { selected: number }) => {
    setPageIndex(Number(selected.selected) + 1)
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, 10)
  }
  const [quizResponse, setquizResponse] =
    useState<TApiResponse<TPaginationResponse<TQuiz>>>()
  useEffect(() => {
    const getQuizzes = async () => {
      const res: TApiResponse<TPaginationResponse<TQuiz>> = await get(
        `/api/quizzes/community`,
        false,
        {
          quizFilter: currentCategoryId?.length
            ? { quizCategoryIds: currentCategoryId }
            : undefined,
          q,
          pageIndex,
          pageSize,
        }
      )
      if (res.response) {
        setquizResponse(res)
      }
    }
    getQuizzes()
  }, [q, pageIndex, currentCategoryId, pageSize])

  useEffect(() => {
    setPageIndex(1)
    console.log('diadia')
  }, [q])

  const {
    data: categoryResponse,
    isValidating: categoriesValidating,
    error: categoriesError,
  } = useSWR<TApiResponse<TPaginationResponse<TQuizCategory>>>(
    [`/api/quiz-categories`, false],
    get,
    { revalidateOnFocus: false }
  )

  const categoryOptions: { value: number; label: string }[] = useMemo(() => {
    if (categoryResponse) {
      return categoryResponse.response.items.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    }
    return []
  }, [categoryResponse])

  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10 min-vh-100">
        <Container fluid="lg" className="p-3">
          <div className=" fw-medium mb-3">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <h1>Quiz cộng đồng</h1>
            </div>
            <div className="text-muted fs-14px">
              Tham gia các Quiz cộng đồng để luyện tập, tích lũy kiến thức ❤️
            </div>
          </div>
          <Row className="align-items-end mb-4 gap-3">
            <Col xs="12">
              <div className="fw-medium mb-1 bi bi-search d-flex gap-2 align-items-center ">
                Tìm kiếm quiz
              </div>
              <SearchBar pageUrl="explore" inputClassName="border-0" />
            </Col>
            <Col xs="12" className="mb-3">
              <div className="fw-medium mb-1 bi bi-journal-bookmark-fill d-flex gap-2 align-items-center">
                Tìm theo thể loại
              </div>
              <ReactSelect
                classNamePrefix="filter-select"
                isMulti
                placeholder="Chọn thể loại quiz"
                options={categoryOptions}
                onChange={(options) =>
                  setCurrentCategoryId(options.map((item) => item.value))
                }
              />
            </Col>
          </Row>
          {quizResponse?.response && (
            <Row>
              {quizResponse?.response?.items?.map((quiz, key) => (
                <Col xs="12" md="6" lg="4" key={key} className="mb-3">
                  <ItemQuiz quiz={quiz} exploreMode />
                </Col>
              ))}
            </Row>
          )}
          {quizResponse?.response?.items?.length === 0 && (
            <div className="fs-4 text-center">
              Chúng tôi không tìm thấy bộ quiz phù hợp
            </div>
          )}
          {_.get(quizResponse, 'response.totalPages', 0) > 0 ? (
            <Row className="mt-3">
              <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <MyPagination
                  handlePageClick={handlePageClick}
                  totalPages={quizResponse?.response.totalPages ?? 0}
                />
              </Col>
            </Row>
          ) : null}

          {quizResponse == null && (
            <div className="text-center">
              <Loading color="#009883" />
            </div>
          )}
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default ExplorePage
