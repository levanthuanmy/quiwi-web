import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import AddingQuestionButtons from '../../../components/AddingQuestionButtons/AddingQuestionButtons'
import CardQuizInfo from '../../../components/CardQuizInfo/CardQuizInfo'
import ItemQuestion from '../../../components/ItemQuestion/ItemQuestion'
import NavBar from '../../../components/NavBar/NavBar'
import QuestionCreator from '../../../components/QuestionCreator/QuestionCreator'

const QuizCreatorPage: NextPage = () => {
  const router = useRouter()
  const [isShowQuestionCreator, setIsShowQuestionCreator] =
    useState<boolean>(false)

  useEffect(() => {
    const questionType = router.query?.type?.toString()
    if (questionType?.length) {
      setIsShowQuestionCreator(true)
    }
  }, [router.query])

  return (
    <>
      <NavBar />
      <Container fluid="lg" className="pt-64px min-vh-100">
        <Row className="flex-column-reverse flex-lg-row py-3">
          <Col xs="12" lg="8">
            <ItemQuestion />
            <ItemQuestion />
            <ItemQuestion />

            <AddingQuestionButtons />
          </Col>
          <Col xs="12" lg="4" className="mb-3 mb-lg-0 ps-12px ps-lg-0">
            <CardQuizInfo />
          </Col>
        </Row>
      </Container>

      <QuestionCreator
        show={isShowQuestionCreator}
        onHide={() => {
          setIsShowQuestionCreator(false)
          router.replace('/quiz/creator')
          const a = document.createElement('a')
          a.href = '#addingQuestion'
          a.click()
          a.remove()
        }}
      />
    </>
  )
}

export default QuizCreatorPage
