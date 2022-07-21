import classNames from 'classnames'
import _ from 'lodash'
import router from 'next/router'
import React, { FC, useMemo, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { get } from '../../../libs/api'
import { TGameRound } from '../../../types/types'
import MyButton from '../../MyButton/MyButton'

const CommunityEndGameBoard: FC<{
  gameSessionHook: any
  onOutRoomInEndGameBoard: () => void
  showEndGame: boolean
}> = ({ gameSessionHook, onOutRoomInEndGameBoard, showEndGame }) => {
  const auth = useAuth()
  const [isVote, setIsVote] = useState<boolean>(false)
  const { addToast } = useToasts()
  const { fromMedium } = useScreenSize()

  const handleVoting = async (type: 'UP' | 'DOWN') => {
    try {
      const { isAuth } = auth
      const { player } = gameSessionHook
      const { id } = router.query
      if (isAuth) {
        await get(`/api/quizzes/vote-quiz-auth/${id}?vote=${type}`, true)
      } else {
        const playerName = player?.nickname || 'Ẩn danh'
        await get(
          `/api/quizzes/vote-quiz-unauth?vote=${type}&nickname=${playerName}&invitationCode=${gameSessionHook.gameSession?.invitationCode}`,
          false
        )
      }
      setIsVote(true)
    } catch (error) {
      console.log('handleVoting - error', error)
      addToast('Có lỗi trong quá trình thực hiện. Vui lòng thử lại sau.', {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }

  const mappedEndGameQuestion = useMemo(() => {
    const gameRounds: TGameRound[] =
      _.get(gameSessionHook, 'player.gameRounds') || []
    let result: {
      correctQuestions: Record<number, TGameRound>
      incorrectQuestions: Record<number, TGameRound>
      numCorrect: number
      numIncorrect: number
    } = {
      correctQuestions: {},
      incorrectQuestions: {},
      numCorrect: 0,
      numIncorrect: 0,
    }

    if (!showEndGame) return result

    for (let index = 0; index < gameRounds.length; index++) {
      const gameRound = gameRounds[index]
      if (gameRound.isCorrect) {
        result.correctQuestions[index] = gameRound
        result.numCorrect++
      } else {
        result.incorrectQuestions[index] = gameRound
        result.numIncorrect++
      }
    }

    return result
  }, [showEndGame, gameSessionHook])
  return (
    <div
      className={classNames(
        'bg-white d-flex flex-column gap-3 align-items-center p-3 text-center',
        {
          'rounded-8px': fromMedium,
        }
      )}
    >
      <div className="h1 py-5">Chúc mừng bạn đã hoàn thành bộ câu hỏi</div>

      <div className="h2">Kết quả của bạn</div>
      <div className="d-table shadow rounded-8px overflow-hidden text-start mb-5">
        <div className="d-table-row">
          <div className="d-table-cell py-1 bg-primary bg-opacity-10 px-3 fs-18px fw-medium">
            Tổng điểm
          </div>
          <div className="d-table-cell ps-3 pe-2 text-primary fs-20px fw-bold fs-18px fw-medium">
            {Math.round(_.get(gameSessionHook, 'player.score'))}
          </div>
        </div>

        <div className="d-table-row">
          <div className="d-table-cell py-1 bg-primary bg-opacity-10 px-3 fs-18px fw-medium">
            Số câu đúng
          </div>
          <div className="d-table-cell ps-3 pe-2 fs-18px fw-medium">
            {_.get(mappedEndGameQuestion, 'numCorrect')}
          </div>
        </div>

        {/* {_.get(mappedEndGameQuestion, 'numCorrect') > 0 && (
                <div className="d-table-row">
                  <div className="d-table-cell py-1 bg-primary bg-opacity-10 px-3 fs-18px fw-medium">
                    Các câu đúng
                  </div>
                  <div className="d-table-cell ps-3 pe-2 text-wrap text-break">
                    {Object.keys(
                      _.get(mappedEndGameQuestion, 'correctQuestions')
                    ).map((item, key) => (
                      <span key={item}>
                        {item}
                        {key !== mappedEndGameQuestion.numCorrect - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}

        <div className="d-table-row">
          <div className="d-table-cell py-1 bg-primary bg-opacity-10 px-3 fs-18px fw-medium">
            Số câu sai
          </div>
          <div className="d-table-cell ps-3 pe-2 fs-18px fw-medium">
            {_.get(mappedEndGameQuestion, 'numIncorrect')}
          </div>
        </div>

        {/* {_.get(mappedEndGameQuestion, 'numIncorrect') > 0 && (
                <div className="d-table-row">
                  <div className="d-table-cell py-1 bg-primary bg-opacity-10 px-3 fs-18px fw-medium">
                    Các câu sai
                  </div>
                  <div className="d-table-cell ps-3 pe-2">
                    {Object.keys(
                      _.get(mappedEndGameQuestion, 'incorrectQuestions')
                    )}
                  </div>
                </div>
              )} */}

        <div className="d-table-row">
          <div className="d-table-cell py-1 bg-primary bg-opacity-10 px-3 fs-18px fw-medium">
            Đúng liên tục nhiều nhất
          </div>
          <div className="d-table-cell ps-3 pe-2 fs-18px fw-medium">
            {_.get(gameSessionHook, 'player.maxStreak')}
          </div>
        </div>
      </div>

      {!isVote ? (
        <div className="">
          <div className="h2">Đánh giá quiz</div>
          <div className="p-12px line-height-normal text-secondary d-flex align-items-center gap-3">
            <MyButton
              variant="outline-danger"
              className="bi bi-arrow-down-short fs-48px d-flex align-items-center justify-content-center"
              onClick={() => handleVoting('DOWN')}
            />
            <MyButton
              variant="outline-success"
              className="bi bi-arrow-up-short fs-48px d-flex align-items-center justify-content-center"
              onClick={() => handleVoting('UP')}
            />
          </div>
        </div>
      ) : (
        <div className="">
          <div className="h2">
            Phản hồi của bạn đã được ghi nhận.
            <br />
            Cảm ơn bạn đã tham gia quiz này.
          </div>
        </div>
      )}

      <MyButton
        className="text-white mt-4 text-uppercase"
        onClick={onOutRoomInEndGameBoard}
      >
        Rời phòng
      </MyButton>
    </div>
  )
}

export default CommunityEndGameBoard
