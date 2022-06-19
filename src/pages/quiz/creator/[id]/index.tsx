import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import AddingQuestionButtons from '../../../../components/AddingQuestionButtons/AddingQuestionButtons'
import CardQuizInfo from '../../../../components/CardQuizInfo/CardQuizInfo'
import ItemQuestion from '../../../../components/ItemQuestion/ItemQuestion'
import MyButton from '../../../../components/MyButton/MyButton'
import MyModal from '../../../../components/MyModal/MyModal'
import NavBar from '../../../../components/NavBar/NavBar'
import QuestionCreator from '../../../../components/QuestionCreator/QuestionCreator'
import { useAuth } from '../../../../hooks/useAuth/useAuth'
import { get, post } from '../../../../libs/api'
import { TApiResponse, TQuestion, TQuiz } from '../../../../types/types'
import { indexingQuestionsOrderPosition } from '../../../../utils/helper'

export type TEditQuestion = {
  isEdit: boolean
  questionId: number | null
}

const QuizCreatorPage: NextPage = () => {
  const router = useRouter()
  const quizId = Number(router.query?.id)
  const [isShowQuestionCreator, setIsShowQuestionCreator] =
    useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [quiz, setQuiz] = useState<TQuiz>()
  const [isValidating, setIsValidating] = useState<boolean>(true)
  const [showModalAlert, setShowModalAlert] = useState<{
    show: boolean
    questionId: number | null
  }>({
    show: false,
    questionId: null,
  }) // use when removing question
  const [showQuizModalAlert, setShowQuizModalAlert] = useState<boolean>(false) // use when removing quiz
  const [isEditQuestion, setIsEditQuestion] = useState<TEditQuestion>({
    isEdit: false,
    questionId: null,
  })
  const addQuestionRef = useRef<any>(null)
  const authContext = useAuth()

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
          `/api/quizzes/my-quizzes/${quizId}`,
          true,
          { filter: { relations: ['quizCategories'] } }
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

  const onRemoveQuestion = (questionId: number) => {
    setShowModalAlert({ show: true, questionId })
  }

  const onAcceptRemoveAlert = async () => {
    try {
      if (showModalAlert.questionId === null) return

      let questions = [...(quiz?.questions as TQuestion[])]

      _.remove(questions, (item) => item.id === showModalAlert.questionId)
      questions = [...indexingQuestionsOrderPosition(questions)]

      const body = { ...quiz, questions }
      const res = await post<TApiResponse<TQuiz>>(
        `/api/quizzes/${quizId}`,
        {},
        body,
        true
      )

      setQuiz(res.response)
    } catch (error) {
      console.log('onRemoveQuestion - error', error)
    } finally {
      setShowModalAlert({ show: false, questionId: null })
    }
  }

  const onAcceptRemoveQuizAlert = async () => {
    try {
      await post<TApiResponse<TQuiz>>(
        `/api/quizzes/${quizId}/delete`,
        {},
        {},
        true
      )
      router.back()
    } catch (error) {
      console.log('onAcceptRemoveQuizAlert - error', error)
    }
  }

  const onEditQuestion = (questionId: number) => {
    setIsEditQuestion({ isEdit: true, questionId })
    setIsShowQuestionCreator(true)
  }

  return (
    <>
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container fluid="lg" className="pt-80px min-vh-100">
        <div className="pt-5 pb-4 fs-22px fw-medium">Tạo Bộ Câu Hỏi Mới</div>
        <Row className="flex-column-reverse flex-lg-row py-3">
          <Col xs="12" lg="8">
            {quiz?.questions?.map((question, key) => (
              <ItemQuestion
                key={key}
                question={question}
                onRemove={() => onRemoveQuestion(question.id!)}
                onEditQuestion={() => onEditQuestion(question.id!)}
              />
            ))}

            <div ref={addQuestionRef}>
              <AddingQuestionButtons quizId={quizId} />
            </div>
          </Col>
          <Col xs="12" lg="4" className="mb-3 mb-lg-0 ps-12px ps-lg-0">
            <CardQuizInfo
              quiz={quiz}
              isValidating={isValidating}
              setQuiz={setQuiz}
            />
            <div className="mt-3">
              <MyButton
                className="text-white w-100 d-flex align-items-center justify-content-between"
                onClick={() => setShowQuizModalAlert(true)}
                variant="danger"
              >
                Xoá quiz này
                <div className="bi bi-trash" />
              </MyButton>
            </div>
            <div className="mt-3">
              <MyButton
                className="text-white w-100 d-flex align-items-center justify-content-between"
                onClick={() => router.push(`/quiz/creator/${quizId}/sort`)}
                variant="secondary"
              >
                Thay đổi thứ tự câu hỏi
                <div className="bi bi-arrow-down-up" />
              </MyButton>
            </div>
            <div className="mt-3">
              <MyButton
                className="text-white w-100 d-flex align-items-center justify-content-between"
                onClick={() => addQuestionRef.current?.scrollIntoView()}
              >
                Thêm câu hỏi mới
                <div className="bi bi-plus-lg" />
              </MyButton>
            </div>
            <div className="mt-3">
              <MyButton
                className="text-white w-100 d-flex align-items-center justify-content-between"
                onClick={() => {
                  authContext.navigate(`/host/lobby?quizId=${quizId}`)
                }}
              >
                Bắt đầu ngay
                <div className="bi bi-play-fill" />
              </MyButton>
            </div>
          </Col>
        </Row>
      </Container>

      <QuestionCreator
        show={isShowQuestionCreator}
        onHide={() => {
          setIsShowQuestionCreator(false)
          setIsEditQuestion({ isEdit: false, questionId: null })
          router.replace(`/quiz/creator/${quizId}`, undefined, {
            scroll: false,
          })
          // addQuestionRef.current?.scrollIntoView()
        }}
        quiz={quiz}
        setQuiz={setQuiz}
        isEditQuestion={isEditQuestion}
      />

      <MyModal
        show={showModal}
        onHide={() => setShowModal(false)}
        activeButtonTitle="Quay lại trang chủ"
        activeButtonCallback={() => router.push('/')}
      >
        <div className="text-center h3">Quiz không hợp lệ</div>
      </MyModal>

      <MyModal
        show={showModalAlert.show}
        onHide={() => setShowModalAlert({ show: false, questionId: null })}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={onAcceptRemoveAlert}
        inActiveButtonCallback={() =>
          setShowModalAlert({ show: false, questionId: null })
        }
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center h3">
          Bạn có chắc chắn muốn xoá câu hỏi này
        </div>
        <div className="text-center">
          Bạn không thể hoàn tác lại hành động này
        </div>
      </MyModal>

      <MyModal
        show={showQuizModalAlert}
        onHide={() => setShowQuizModalAlert(false)}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={onAcceptRemoveQuizAlert}
        inActiveButtonCallback={() => setShowQuizModalAlert(false)}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center h3">
          Bạn có chắc chắn muốn xoá bộ quiz này
        </div>
        <div className="text-center">
          Bạn không thể hoàn tác lại hành động này
        </div>
      </MyModal>
    </>
  )
}

export default QuizCreatorPage
