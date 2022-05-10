import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import AddingQuestionButtons from '../../../components/AddingQuestionButtons/AddingQuestionButtons'
import CardQuizInfo from '../../../components/CardQuizInfo/CardQuizInfo'
import ItemQuestion from '../../../components/ItemQuestion/ItemQuestion'
import MyModal from '../../../components/MyModal/MyModal'
import NavBar from '../../../components/NavBar/NavBar'
import QuestionCreator from '../../../components/QuestionCreator/QuestionCreator'
import { get } from '../../../libs/api'
import { TApiResponse, TQuestionRequest, TQuiz } from '../../../types/types'

const QuizCreatorPage: NextPage = () => {
  const router = useRouter()
  const quizId = Number(router.query?.id)
  const [isShowQuestionCreator, setIsShowQuestionCreator] =
    useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [quiz, setQuiz] = useState<TQuiz>()
  const [isValidating, setIsValidating] = useState<boolean>(true)

  useEffect(() => {
    const questionType = router.query?.type?.toString()
    if (questionType?.length) {
      setIsShowQuestionCreator(true)
    }
  }, [router.query])

  useEffect(() => {
    const getQuiz = async () => {
      try {
        setIsValidating(true)
        const res = await get<TApiResponse<TQuiz>>(
          `/api/quizzes/quiz/${quizId}`,
          true
        )

        if (res.response === null) {
          setShowModal(true)
        }
        if (res.response) {
          setQuiz(res.response)
        }
      } catch (error) {
        console.log('getQuiz - error', error)
      } finally {
        setIsValidating(false)
      }
    }

    quizId && getQuiz()
  }, [quizId])

  return (
    <>
      <NavBar />
      <Container fluid="lg" className="pt-64px min-vh-100">
        <Row className="flex-column-reverse flex-lg-row py-3">
          <Col xs="12" lg="8">
            {quiz?.questions?.map((question, key) => (
              <ItemQuestion key={key} question={question} />
            ))}

            <AddingQuestionButtons quizId={quizId} />
          </Col>
          <Col xs="12" lg="4" className="mb-3 mb-lg-0 ps-12px ps-lg-0">
            <CardQuizInfo
              quiz={quiz}
              isValidating={isValidating}
              setQuiz={setQuiz}
            />
          </Col>
        </Row>
      </Container>

      <QuestionCreator
        show={isShowQuestionCreator}
        onHide={() => {
          setIsShowQuestionCreator(false)
          router.replace(`/quiz/creator/${quizId}`)
          const a = document.createElement('a')
          a.href = '#addingQuestion'
          a.click()
          a.remove()
        }}
        quiz={quiz}
        setQuiz={setQuiz}
      />

      <MyModal
        show={showModal}
        onHide={() => setShowModal(false)}
        activeButtonTitle="Quay lại trang chủ"
        activeButtonCallback={() => router.push('/')}
      >
        <div className="text-center h3">Quiz không hợp lệ</div>
      </MyModal>
    </>
  )
}

export default QuizCreatorPage
