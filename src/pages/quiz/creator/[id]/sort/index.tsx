import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import useSWR from 'swr'
import ItemQuestion from '../../../../../components/ItemQuestion/ItemQuestion'
import { get, post } from '../../../../../libs/api'
import {
  TApiResponse,
  TQuestion,
  TQuiz,
} from '../../../../../types/types'
import update from 'immutability-helper'
import MyButton from '../../../../../components/MyButton/MyButton'
import { indexingQuestionsOrderPosition } from '../../../../../utils/helper'

const SortPage = () => {
  const router = useRouter()
  const quizId = Number(router.query?.id)

  const { data, isValidating } = useSWR<TApiResponse<TQuiz>>(
    quizId ? [`/api/quizzes/quiz/${quizId}`, true] : null,
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
    } catch (error) {
      console.log('onUpdatePosition - error', error)
    }
  }

  return (
    <>
      <Container fluid="lg" className="pt-64px min-vh-100">
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
      </Container>
    </>
  )
}

export default SortPage
