import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Container, Toast, ToastContainer } from 'react-bootstrap'
import useSWR from 'swr'
import ItemQuestion from '../../../../../components/ItemQuestion/ItemQuestion'
import { get, post } from '../../../../../libs/api'
import { TApiResponse, TQuestion, TQuiz } from '../../../../../types/types'
import update from 'immutability-helper'
import MyButton from '../../../../../components/MyButton/MyButton'
import { indexingQuestionsOrderPosition } from '../../../../../utils/helper'

const SortPage = () => {
  const router = useRouter()
  const quizId = Number(router.query?.id)
  const [toastHandler, setToastHandler] = useState<{
    show: boolean
    content: JSX.Element
  }>({ show: false, content: <></> })

  const { data, isValidating } = useSWR<TApiResponse<TQuiz>>(
    quizId ? [`/api/quizzes/my-quizzes/${quizId}`, true] : null,
    get
  )

  const [questions, setQuestions] = useState<TQuestion[]>()

  useEffect(() => {
    if (data?.response) {
      setQuestions(data.response.questions)
    }
  }, [data?.response])

  const move = useCallback((dragIndex: number, hoverIndex: number) => {
    setQuestions(
      (prev) =>
        prev &&
        update(prev, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prev[dragIndex] as TQuestion],
          ],
        })
    )
  }, [])

  const onUpdatePosition = async () => {
    try {
      if (!data?.response || !questions) return

      const body = {
        ...data?.response,
        questions: indexingQuestionsOrderPosition(questions),
      }
      const res = await post<TApiResponse<TQuiz>>(
        `/api/quizzes/${quizId}`,
        {},
        body,
        true
      )

      setQuestions(res.response.questions)

      setToastHandler({
        show: true,
        content: (
          <div className="d-flex justify-content-between align-items-center w-100 fs-18px py-3 text-primary">
            Lưu thành công <div className="bi bi-check-circle-fill" />
          </div>
        ),
      })
    } catch (error) {
      console.log('onUpdatePosition - error', error)
      setToastHandler({
        show: true,
        content: (
          <div className="d-flex justify-content-between align-items-center w-100 fs-18px py-3 text-danger">
            Lưu thất bại <div className="bi bi-x-lg" />
          </div>
        ),
      })
    }
  }

  return (
    <>
      <Container fluid="lg" className="mt-80px min-vh-100">
        {questions?.map((question, key) => (
          <ItemQuestion
            key={key}
            question={question}
            showActionBtn={false}
            index={key}
            move={move}
          />
        ))}

        <div className="d-flex gap-3 mb-3">
          <MyButton
            variant="secondary"
            className="w-100 text-white"
            onClick={() => router.back()}
          >
            Quay Lại
          </MyButton>
          <MyButton className="w-100 text-white" onClick={onUpdatePosition}>
            Lưu
          </MyButton>
        </div>

        <Toast
          show={toastHandler.show}
          onClose={() => setToastHandler({ show: false, content: <></> })}
          delay={2000}
          autohide
          className="position-fixed rounded-14px overflow-hidden"
          style={{ right: 16, top: 16 }}
        >
          <Toast.Header closeButton={false}>
            {toastHandler.content}
          </Toast.Header>
        </Toast>
      </Container>
    </>
  )
}

export default SortPage
