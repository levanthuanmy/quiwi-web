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
        className="bg-secondary bg-opacity-50 rounded-8px overflow-hidden"
      ></div>
      {quiz.banner?.length ? (
        <Image alt="" src={quiz.banner} width="100%" height={160} />
      ) : (
        <></>
      )}
      <div className="fw-medium fs-18px">{quiz.title}</div>
      <div>Số câu: {quiz.questions.length}</div>
      <div>Trạng thái: {quiz.isPublic ? 'Công khai' : 'Riêng tư'}</div>
      <MyButton
        className="text-white mt-3 w-100"
        onClick={(e) => {
          authNavigate.navigate(`/host?quizId=${quiz.id}`)
        }}
      >
        Bắt đầu ngay
      </MyButton>
    </div>
  )
}

export default memo(ItemQuiz)
