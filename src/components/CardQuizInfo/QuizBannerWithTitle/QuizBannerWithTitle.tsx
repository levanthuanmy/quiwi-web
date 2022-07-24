import React, { Dispatch, FC, SetStateAction } from 'react'
import { Container, Image } from 'react-bootstrap'
import { TQuiz } from '../../../types/types'
import CardQuizInfo from '../CardQuizInfo'

const QuizBannerWithTitle: FC<{
  quiz?: TQuiz
  setQuiz?: Dispatch<SetStateAction<TQuiz | undefined>>
  isValidating: boolean
}> = ({ quiz, setQuiz, isValidating }) => {
  return (
    <>
      <div
        className="pt-80px position-relative bg-transparent"
        style={{ height: 460 }}
      >
        <Image
          src={quiz?.banner || '/assets/default-question-image.png'}
          className="w-100 h-100 object-fit-cover"
          alt="banner"
        />
        <div className="position-absolute top-0 w-100 h-100 overlay-bot-to-top" />
        <div
          className="position-absolute bottom-0 text-white w-100 py-3"
          style={{ left: 0 }}
        >
          <Container fluid="lg" className="h1">
            {quiz?.title}
          </Container>
        </div>
      </div>

      <div className="border-bottom">
        <CardQuizInfo
          quiz={quiz}
          isValidating={isValidating}
          setQuiz={setQuiz}
        />
      </div>
    </>
  )
}

export default QuizBannerWithTitle
