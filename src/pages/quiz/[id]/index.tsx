import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Button } from 'react-bootstrap'

const QuizDetailPage: NextPage = () => {
  const router = useRouter()
  const query = router.query

  const { id } = query

  return (
    <div>
      <div>QuizDetailPage: ID {id}</div>
      <Button
        onClick={() => {
          router.push(`/quiz/${id}/play`)
        }}
      >
        Play
      </Button>
    </div>
  )
}

export default QuizDetailPage
