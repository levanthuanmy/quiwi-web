import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import useSWR from 'swr'
import QuizBannerWithTitle from '../../../components/CardQuizInfo/QuizBannerWithTitle/QuizBannerWithTitle'
import ItemQuestion from '../../../components/ItemQuestion/ItemQuestion'
import LoadingFullScreen from '../../../components/LoadingFullScreen/Loading'
import MyButton from '../../../components/MyButton/MyButton'
import MyModal from '../../../components/MyModal/MyModal'
import NavBar from '../../../components/NavBar/NavBar'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import { get } from '../../../libs/api'
import { TApiResponse, TQuiz } from '../../../types/types'

const QuizDetailPage: NextPage = () => {
  const router = useRouter()
  const query = router.query
  const { id } = query
  const { addToast } = useToasts()
  const auth = useAuth()
  const user = auth.getUser()

  const [forbiddenError, setForbiddenError] = useState('')
  const [errorMessage, setError] = useState('')
  //
  // useEffect(() => {
  //   window.addEventListener("storage", (e) => {
  //     if (e.key == "currentQID") {
  //       setCurrentQID(Number(e.newValue))
  //     }
  //   });
  // }, []);

  const cloneQuiz = async () => {
    try {
      if (quiz && auth.isAuth && user) {
        const res = await get<TApiResponse<TQuiz>>(
          `/api/quizzes/quiz/${quiz.id}/clone`,
          true
        )
        if (res.response) {
          router.push(`/quiz/creator/${res.response.id}`)
        } else {
          setError(_.get(res, 'message', 'Có lỗi xảy ra'))
        }
      }
    } catch (error) {
      setError(_.get(error, 'message', 'Có lỗi xảy ra'))
    }
  }

  const { data, isValidating, error } = useSWR<TApiResponse<TQuiz>>(
    id ? [`/api/quizzes/quiz/${id}`, false] : null,
    get,
    {
      revalidateOnFocus: false,
    }
  )

  useEffect(() => {
    if (error) {
      if (_.get(error, 'code') === 403) {
        setForbiddenError(_.get(error, 'message'))
      }
    }
  }, [error])

  const quiz = data?.response

  return (
    <>
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />

      <QuizBannerWithTitle quiz={quiz} isValidating={isValidating} />
      <Container fluid="lg" className="pt-80px min-vh-100">
        {!error ? (
          <Row className="flex-column-reverse flex-lg-row py-3">
            <Col xs="12" lg="8">
              <div className="pb-3 fs-22px fw-medium">Danh sách câu hỏi</div>

              {quiz?.questions?.map((question, key) => (
                <ItemQuestion
                  key={key}
                  question={question}
                  showActionBtn={false}
                  fromCommunity
                />
              ))}
            </Col>
            <Col xs="12" lg="4" className="mb-3 mb-lg-0 ps-12px ps-lg-0">
              <div className="pb-3 fs-22px fw-medium">Tuỳ chọn</div>

              <div>
                <MyButton
                  className="text-white w-100 d-flex align-items-center justify-content-between"
                  onClick={() => {
                    router.push(`/quiz/${id}/play`)
                  }}
                >
                  Chơi ngay
                  <div className="bi bi-play-fill" />
                </MyButton>
              </div>
              {auth.isAuth ? (
                <div>
                  <MyButton
                    className="text-white w-100 mt-2 d-flex align-items-center justify-content-between"
                    onClick={cloneQuiz}
                  >
                    Tải về thư viện của mình
                    <div className="bi bi-play-fill" />
                  </MyButton>
                </div>
              ) : null}
            </Col>
          </Row>
        ) : null}
        {!error && !data ? <LoadingFullScreen /> : null}

        <MyModal
          show={forbiddenError?.length > 0}
          onHide={() => {
            setForbiddenError('')
            router.push('/home')
          }}
          size="sm"
          header={<Modal.Title className="text-danger">Thông báo</Modal.Title>}
        >
          <div className="text-center fw-medium fs-16px">{forbiddenError}</div>
        </MyModal>

        <MyModal
          show={errorMessage?.length > 0}
          onHide={() => {
            setError('')
          }}
          size="sm"
          header={<Modal.Title className="text-danger">Thông báo</Modal.Title>}
        >
          <div className="text-center fw-medium fs-16px">{errorMessage}</div>
        </MyModal>
      </Container>
    </>
  )
}

export default QuizDetailPage
