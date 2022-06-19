import classNames from 'classnames'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import MyInput from '../../components/MyInput/MyInput'
import SearchBar from '../../components/SearchBar/SearchBar'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TPaginationResponse,
  TQuiz,
  TQuizCategory,
} from '../../types/types'

const ExplorePage: NextPage = () => {
  const router = useRouter()
  const { q } = router.query

  const [showCategories, setShowCategories] = useState<boolean>(false)
  const [currentCategoryId, setCurrentCategoryId] = useState<number>()

  const { data: quizResponse, isValidating } = useSWR<
    TApiResponse<TPaginationResponse<TQuiz>>
  >(
    [
      `/api/quizzes`,
      false,
      {
        filter: {
          relations: ['questions', 'user', 'quizCategories'],
          where: {
            isPublic: true,
            isLocked: false,
          },
          order: {
            createdAt: 'DESC',
          },
        },
        quizFilter: currentCategoryId
          ? { quizCategoryIds: [currentCategoryId] }
          : undefined,
        q,
      },
    ],
    get,
    {
      revalidateOnFocus: false,
    }
  )

  const { data: categoryResponse } = useSWR<
    TApiResponse<TPaginationResponse<TQuizCategory>>
  >([`/api/quiz-categories`, false], get, { revalidateOnFocus: false })

  return (
    <DashboardLayout>
      <div className="w-100 bg-secondary bg-opacity-10 min-vh-100">
        <Container fluid="lg" className="p-3">
          <SearchBar pageUrl="explore" inputClassName="border-0" />

          <div className="fs-32px fw-medium mb-3">
            {q?.length ? q : 'Hãy tìm kiếm gì đó...'}
          </div>

          <Col xs="12" md="6" lg="4" className="position-relative pb-4">
            <div className="fw-medium mb-1">Thể loại quiz</div>
            <MyInput
              placeholder="Chọn một thể loại..."
              value={
                currentCategoryId !== undefined
                  ? categoryResponse?.response?.items?.find(
                      (item) => item.id === currentCategoryId
                    )?.name
                  : ''
              }
              iconClassName={
                currentCategoryId === undefined
                  ? 'bi bi-chevron-down'
                  : 'bi bi-x-circle-fill cursor-pointer'
              }
              readOnly
              onClick={() => {
                setShowCategories((prev) => !prev)
              }}
              handleIconClick={() =>
                currentCategoryId === undefined
                  ? setShowCategories((prev) => !prev)
                  : setCurrentCategoryId(undefined)
              }
            />
            <div
              className={classNames('position-absolute w-100 pt-2', {
                'd-none': !showCategories,
              })}
              style={{ zIndex: 2 }}
              tabIndex={-1}
              onBlur={() => setShowCategories(false)}
            >
              <div className="bg-white rounded-10px overflow-auto shadow">
                {categoryResponse?.response?.items?.map((category, key) => (
                  <div
                    key={key}
                    className={classNames('px-3 py-2 cursor-pointer', {
                      'bg-primary bg-opacity-10 text-primary':
                        currentCategoryId === category.id,
                    })}
                    onClick={() => {
                      setCurrentCategoryId(category.id)
                      setShowCategories(false)
                    }}
                  >
                    <div className="">{category.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Row>
            {quizResponse?.response?.items?.map((quiz, key) => (
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
