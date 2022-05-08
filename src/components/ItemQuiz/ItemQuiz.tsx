import React, { FC, memo } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
import { TQuiz } from '../../types/types'
import MyButton from '../MyButton/MyButton'

type ItemQuizProps = {
  quiz: TQuiz
  exploreMode?: boolean
}
const ItemQuiz: FC<ItemQuizProps> = ({ quiz, exploreMode = false }) => {
  const authNavigate = useAuthNavigation()

  return (
    <div className="bg-white h-100 p-12px border rounded-10px">
      <div
        style={{ height: 160 }}
        className="bg-secondary bg-opacity-50 rounded-8px overflow-hidden border"
      >
        {quiz.banner?.length ? (
          <Image
            alt=""
            src={quiz.banner}
            width="100%"
            height={160}
            className="object-fit-cover"
          />
        ) : (
          <></>
        )}
      </div>
      <Row>
        <Col>
          <div className="fw-medium fs-18px">{quiz.title}</div>
          <div className="fs-14px text-secondary mt-2">
            <div>Số câu: {quiz.questions.length}</div>
            <div>
              {!exploreMode && (
                <>Trạng thái: {quiz.isPublic ? 'Công khai' : 'Riêng tư'}</>
              )}
            </div>
            <div>Lượt chơi: {quiz.numPlayed}</div>
          </div>
        </Col>
        <Col
          xs="auto"
          className="text-secondary fs-14px ps-0 d-flex flex-column justify-content-center"
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-arrow-up-short fs-24px" /> {quiz.numUpvotes}
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-arrow-down-short fs-24px" /> {quiz.numDownvotes}
          </div>
        </Col>
      </Row>

      <div className="d-flex gap-3 mt-3">
        <MyButton
          variant="secondary"
          className="text-white w-100 text-nowrap"
          onClick={(e) => {
            authNavigate.navigate(`/quiz/creator/${quiz.id}`)
          }}
        >
          Chỉnh Sửa
        </MyButton>
        <MyButton
          className="text-white w-100 text-nowrap"
          onClick={(e) => {
            authNavigate.navigate(`/host?quizId=${quiz.id}`)
          }}
        >
          Bắt Đầu
        </MyButton>
      </div>
    </div>
  )
}

export default memo(ItemQuiz)
