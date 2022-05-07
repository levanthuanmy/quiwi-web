import React, { FC, memo } from 'react'
import { Image } from 'react-bootstrap'
import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
import { TQuiz } from '../../types/types'
import MyButton from '../MyButton/MyButton'

type ItemQuizProps = {
  quiz: TQuiz
}
const ItemQuiz: FC<ItemQuizProps> = ({ quiz }) => {
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
      <div className="fw-medium fs-18px">{quiz.title}</div>
      <div>Số câu: {quiz.questions.length}</div>
      <div>Trạng thái: {quiz.isPublic ? 'Công khai' : 'Riêng tư'}</div>

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
