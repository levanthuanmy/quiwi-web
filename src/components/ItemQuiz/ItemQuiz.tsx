import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'
import { Button, Image } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
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
  const { addToast } = useToasts()

  const handlePlay = () => {
    try {
      if (quiz?.questions?.length > 0) {
        if (exploreMode) {
          router.push(`/quiz/${quiz?.id}/play`)
        } else {
          authNavigate.navigate(`/host/lobby?quizId=${quiz?.id}`)
        }
      } else {
        addToast('Bộ câu hỏi cần có ít nhất 1 câu hỏi để có thể bắt đầu', {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    } catch (error) {
      console.log('handlePlay - error', error)
    }
  }

  return (
    <div className="bg-white h-100 rounded-14px shadow-sm overflow-hidden">
      <div
        className={classNames('p-12px cursor-pointer', styles.infoContainer)}
      >
        <div className="fw-medium d-flex justify-content-between align-items-center">
          <div
            title={exploreMode ? 'Bấm vào để xem chi tiết Quiz' : ''}
            className="w-100"
            onClick={() =>
              exploreMode ? router.push(`/quiz/${quiz.id}`) : null
            }
          >
            {quiz.title}
          </div>
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
        </div>

        <div className="fs-14px text-secondary d-flex justify-content-between">
          {exploreMode ? (
            <div
              title={quiz.user?.name}
              className="bi bi-person-fill text-truncate d-flex align-items-center justify-content-center"
              onClick={() => {
                router.push(`/users/${quiz.user?.id}`)
              }}
            >
              <span className="ps-1">{quiz.user?.name}</span>
            </div>
          ) : (
            <div
              className={classNames(
                'bi text-truncate d-flex align-items-center justify-content-center',
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

          <div className="bi bi-play-fill text-truncate d-flex align-items-center justify-content-center">
            <span className="ps-1">{quiz.numPlayed} lượt chơi</span>
          </div>
          <div className="bi bi-stack text-truncate d-flex align-items-center justify-content-center">
            <span className="ps-1">{quiz.questions?.length} câu</span>
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
            loading="lazy"
          />
        ) : (
          <></>
        )}

        <MyButton
          title={
            exploreMode
              ? 'Bấm để làm Quiz này'
              : 'Bấm để bắt đầu tổ chức chơi Quiz này'
          }
          className={classNames(
            'text-white text-nowrap rounded-circle bi bi-play-fill fs-32px shadow d-flex justify-content-center align-items-center',
            styles.startBtn
          )}
          onClick={handlePlay}
        ></MyButton>
      </div>

      <div className="p-12px fs-24px line-height-normal text-secondary d-flex align-items-center fw-medium ">
        <div className="bi bi-hand-thumbs-up-fill text-truncate d-flex align-items-center w-100 justify-content-end text-primary padding-right-20">
          <span className="ps-1 fs-18px">{quiz.numUpvotes}</span>
        </div>
        <div className="bi bi-hand-thumbs-down-fill text-truncate d-flex align-items-center w-100 justify-content-start text-danger padding-left-20">
          <span className="ps-1 fs-18px">{quiz.numDownvotes}</span>
        </div>
      </div>
    </div>
  )
}

export default memo(ItemQuiz)
