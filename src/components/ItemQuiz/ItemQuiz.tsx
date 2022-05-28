import classNames from 'classnames'
import { useRouter } from 'next/router'
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
  const BANNER_HEIGHT = 160
  const router = useRouter()

  return (
    <div className="bg-white h-100 rounded-14px shadow-sm overflow-hidden">
      <div
        className={classNames('p-12px cursor-pointer', styles.infoContainer)}
        onClick={() => (exploreMode ? router.push(`/quiz/${quiz.id}`) : {})}
      >
        <p className="fw-medium fs-18px d-flex justify-content-between align-items-center">
          {quiz.title}
          {!exploreMode && (
            <Button
              variant="outline-secondary"
              className={classNames(
                'shadow-sm d-flex justify-content-center align-items-center cursor-pointer rounded-8px',
                styles.editBtn
              )}
              onClick={() => {
                authNavigate.navigate(`/quiz/creator/${quiz.id}`)
              }}
            >
              <div className="bi bi-pen fs-16px"></div>
            </Button>
          )}
        </p>

        <div className="fs-14px text-secondary d-flex">
          {exploreMode ? (
            <div className="bi bi-person-fill text-truncate d-flex align-items-center w-100 justify-content-center">
              <span className="ps-1">{quiz.user?.name}</span>
            </div>
          ) : (
            <div
              className={classNames(
                'bi text-truncate d-flex align-items-center w-100 justify-content-center',
                {
                  'bi-lock-fill': !quiz.isPublic,
                  'bi-globe': quiz.isPublic,
                }
              )}
            >
              <span className="fs-14px ps-1">
                {quiz.isPublic ? 'Công khai' : 'Riêng tư'}
              </span>
            </div>
          )}

          <div className="bi bi-play-fill text-truncate d-flex align-items-center w-100 justify-content-center">
            <span className="ps-1">{quiz.numPlayed} lượt chơi</span>
          </div>
          <div className="bi bi-stack text-truncate d-flex align-items-center w-100 justify-content-center">
            <span className="ps-1">{quiz.questions?.length} câu hỏi</span>
          </div>
        </div>
      </div>

      <div
        style={{ height: BANNER_HEIGHT }}
        className="bg-secondary bg-opacity-50 overflow-hidden position-relative d-flex justify-content-center align-items-center shadow-sm"
      >
        {quiz.banner?.length ? (
          <Image
            alt=""
            src={quiz.banner}
            width="100%"
            height={BANNER_HEIGHT}
            className="object-fit-cover position-absolute"
          />
        ) : (
          <></>
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

      <div className="p-12px fs-24px line-height-normal text-secondary d-flex align-items-center fw-medium ">
        <div className="bi bi-arrow-up-short text-truncate d-flex align-items-center w-100 justify-content-center text-primary">
          <span className="ps-1 fs-18px">{quiz.numUpvotes}</span>
        </div>
        <div className="bi bi-arrow-down-short text-truncate d-flex align-items-center w-100 justify-content-center text-danger">
          <span className="ps-1 fs-18px">{quiz.numDownvotes}</span>
        </div>
      </div>
    </div>
  )
}

export default memo(ItemQuiz)
