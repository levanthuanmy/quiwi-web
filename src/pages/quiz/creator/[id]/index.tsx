import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import AddingQuestionButtons from '../../../../components/AddingQuestionButtons/AddingQuestionButtons'
import QuizBannerWithTitle from '../../../../components/CardQuizInfo/QuizBannerWithTitle/QuizBannerWithTitle'
import ItemQuestion from '../../../../components/ItemQuestion/ItemQuestion'
import MyButton from '../../../../components/MyButton/MyButton'
import MyModal from '../../../../components/MyModal/MyModal'
import NavBar from '../../../../components/NavBar/NavBar'
import QuestionCreator from '../../../../components/QuestionCreator/QuestionCreator'
import { useAuth } from '../../../../hooks/useAuth/useAuth'
import { get, post } from '../../../../libs/api'
import * as gtag from '../../../../libs/gtag'
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

    gtag.event({ action: '[access quiz creator]', params: { quizId } })
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

  const onEditQuestion = (questionId: number) => {
    setIsEditQuestion({ isEdit: true, questionId })
    setIsShowQuestionCreator(true)
  }

  const { addToast } = useToasts()

  const handlePlay = () => {
    try {
      if (quiz && quiz?.questions?.length > 0) {
        authContext.navigate(`/host/lobby?quizId=${quiz?.id}`)
      } else {
        addToast('B??? c??u h???i c???n c?? ??t nh???t 1 c??u h???i ????? c?? th??? b???t ?????u', {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    } catch (error) {
      console.log('handlePlay - error', error)
    }
  }

  return (
    <div className="min-vh-100">
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <QuizBannerWithTitle
        isValidating={isValidating}
        quiz={quiz}
        setQuiz={setQuiz}
      />

      <Container fluid="lg" className="">
        <Row className="flex-column-reverse flex-lg-row py-3">
          <Col xs="12" lg="8">
            <div className="pb-3 fs-22px fw-medium">Danh s??ch c??u h???i</div>

            {quiz?.questions?.map((question, key) => (
              <ItemQuestion
                key={key}
                question={question}
                onRemove={() => onRemoveQuestion(question.id!)}
                onEditQuestion={() => onEditQuestion(question.id!)}
              />
            ))}
          </Col>
          <Col xs="12" lg="4" className="mb-3 mb-lg-0 ps-12px ps-lg-0">
            <div className="fs-22px fw-medium">Tu??? ch???n</div>

            <div className="mt-3">
              <MyButton
                className="text-white w-100 d-flex align-items-center justify-content-between text-uppercase fw-medium"
                onClick={() => router.push(`/quiz/creator/${quizId}/sort`)}
                variant="secondary"
              >
                Thay ?????i th??? t??? c??u h???i
                <div className="bi bi-arrow-down-up" />
              </MyButton>
            </div>
            <div ref={addQuestionRef} className="mt-3">
              <AddingQuestionButtons quizId={quizId} />
            </div>
            <div className="mt-3">
              <MyButton
                className="text-white w-100 d-flex align-items-center justify-content-between text-uppercase fw-medium"
                onClick={handlePlay}
              >
                B???t ?????u ngay
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
        activeButtonTitle="Quay l???i trang ch???"
        activeButtonCallback={() => router.push('/home')}
      >
        <div className="text-center h3">Quiz kh??ng h???p l???</div>
      </MyModal>

      <MyModal
        show={showModalAlert.show}
        onHide={() => setShowModalAlert({ show: false, questionId: null })}
        activeButtonTitle="?????ng ??"
        activeButtonCallback={() => onAcceptRemoveAlert()}
        inActiveButtonCallback={() =>
          setShowModalAlert({ show: false, questionId: null })
        }
        inActiveButtonTitle="Hu???"
      >
        <div className="text-center h3">
          B???n c?? ch???c ch???n mu???n xo?? c??u h???i n??y
        </div>
        <div className="text-center">
          B???n kh??ng th??? ho??n t??c l???i h??nh ?????ng n??y
        </div>
      </MyModal>
    </div>
  )
}

export default QuizCreatorPage
