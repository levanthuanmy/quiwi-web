import classNames from 'classnames'
import React, { FC, memo } from 'react'
import { Button, Image } from 'react-bootstrap'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { TQuiz } from '../../types/types'
import MyButton from '../MyButton/MyButton'
import styles from './ItemQuiz.module.css'

type ItemQuizProps = {
  quiz: TQuiz
  exploreMode?: boolean
}
const ItemQuiz: FC<ItemQuizProps> = ({ quiz, exploreMode = false }) => {
  const authNavigate = useAuth()

  return (
    <div className="bg-white h-100 rounded-20px shadow-sm overflow-hidden">
      <div
        style={{ height: 220 }}
        className="bg-secondary bg-opacity-50 overflow-hidden rounded-20px position-relative d-flex justify-content-center align-items-center shadow-sm"
      >
        {quiz.banner?.length ? (
          <Image
            alt=""
            src={quiz.banner}
            width="100%"
            height={220}
            className="object-fit-cover position-absolute"
          />
        ) : (
          <></>
        )}
        <div
          style={{ left: 12, right: 12, bottom: 12 }}
          className="bg-white p-12px rounded-14px shadow-sm position-absolute d-flex justify-content-around bg-opacity-75"
        >
          <div className="bi bi-caret-up fs-20px">
            <span className="fs-16px ps-1">{quiz.numUpvotes}</span>
          </div>
          <div className="bi bi-caret-down fs-20px">
            <span className="fs-16px ps-1">{quiz.numDownvotes}</span>
          </div>
          <div className="bi bi-play-circle fs-20px">
            <span className="fs-16px ps-1">{quiz.numPlayed}</span>
          </div>
          <div
            className={classNames('bi fs-20px', {
              'bi-lock': !quiz.isPublic,
              'bi-globe': quiz.isPublic,
            })}
          >
            <span className="fs-14px ps-1">
              {quiz.isPublic ? 'Công khai' : 'Riêng tư'}
            </span>
          </div>
        </div>

        {!exploreMode && (
          <Button
            variant="light"
            className={classNames(
              'rounded-circle shadow-sm position-absolute d-flex justify-content-center align-items-center cursor-pointer',
              styles.editBtn
            )}
            onClick={() => {
              authNavigate.navigate(`/quiz/creator/${quiz.id}`)
            }}
          >
            <div className="bi bi-pen fs-16px"></div>
          </Button>
        )}

        <MyButton
          className={classNames(
            'text-white text-nowrap rounded-circle bi bi-play-fill fs-32px shadow d-flex justify-content-center align-items-center',
            styles.startBtn
          )}
          onClick={() => {
            authNavigate.navigate(`/host/lobby?quizId=${quiz.id}`)
          }}
        ></MyButton>
      </div>
      <div className="p-12px">
        <div className="fw-medium fs-18px">{quiz.title}</div>
        <div className="fs-14px text-secondary">{quiz.description}</div>
      </div>
    </div>
  )
}

export default memo(ItemQuiz)
