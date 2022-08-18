import classNames from 'classnames'
import _ from 'lodash'
import router from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import { GameManager } from '../../../hooks/useGameSession/useGameSession'
import useScreenSize from '../../../hooks/useScreenSize/useScreenSize'
import { get } from '../../../libs/api'
import { TApiResponse, TGameRound, TPlayer } from '../../../types/types'
import MyButton from '../../MyButton/MyButton'

const CommunityEndGameBoard: FC<{
  gameSessionHook: GameManager
  onOutRoomInEndGameBoard: () => void
  showEndGame: boolean
}> = ({ gameSessionHook, onOutRoomInEndGameBoard, showEndGame }) => {
  const auth = useAuth()
  const [isVote, setIsVote] = useState<boolean>(false)
  const { addToast } = useToasts()
  const { fromMedium } = useScreenSize()

  const [leaderboard, setLeaderboard] = useState<TPlayer[]>()

  const handleVoting = async (type: 'UP' | 'DOWN') => {
    try {
      const { isAuth } = auth
      const player = gameSessionHook.player
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

  useEffect(() => {
    const getLeaderboard = async () => {
      const { id } = router.query
      try {
        const res = await get<TApiResponse<TPlayer[]>>(
          `api/games/leaderboard/${id}`,
          false,
          {
            mode: gameSessionHook.gameSession?.mode,
          }
        )
        console.log('==== ~ getLeaderboard ~ res', res)
        setLeaderboard(res.response)
      } catch (error) {
        addToast('Có lỗi trong quá trình thực hiện. Vui lòng thử lại sau.', {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    }
    getLeaderboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mappedEndGameQuestion = useMemo(() => {
    const gameRounds: TGameRound[] = gameSessionHook.player?.gameRounds || []
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

  // let totalScore = gameSessionHook.gameSession?.quiz.questions.reduce((p, c) => p+c.score, 0)
  return (
    <div
      className={classNames(
        ' d-flex flex-column gap-3 align-items-center p-5 text-center bg-white ',
        {
          'rounded-8px': fromMedium,
        }
      )}
    >
      {/* <div className="h1 py-5">Chúc mừng bạn đã hoàn thành bộ câu hỏi</div> */}
      <div className=" text-center   ">
        <div className="text-center">
          <div className="h2">Kết quả của bạn</div>
          <div className="d-table shadow overflow-hidden text-start mb-5 mx-auto ">
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

            <div className="d-table-row">
              <div className="d-table-cell py-1 bg-primary bg-opacity-10 px-3 fs-18px fw-medium">
                Số câu sai
              </div>
              <div className="d-table-cell ps-3 pe-2 fs-18px fw-medium">
                {_.get(mappedEndGameQuestion, 'numIncorrect')}
              </div>
            </div>

            <div className="d-table-row">
              <div className="d-table-cell py-1 bg-primary bg-opacity-10 px-3 fs-18px fw-medium">
                Đúng liên tục nhiều nhất
              </div>
              <div className="d-table-cell ps-3 pe-2 fs-18px fw-medium">
                {_.get(gameSessionHook, 'player.maxStreak')}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="h2">Bảng xếp hạng</div>
          <div className="d-table shadow">
            <thead className="bg-primary bg-opacity-10">
              <div className="d-table-row ">
                <th className="d-table-cell py-2 px-3 ">#</th>
                <th className="d-table-cell py-2 px-3">Tên người chơi</th>
                <th className="d-table-cell py-2 px-3">Số điểm</th>
                <th className="d-table-cell py-2 px-3">Số phần trăm đúng</th>
              </div>
            </thead>

            <tbody>
              {leaderboard?.map((p, index) => {
                return (
                  <div className="d-table-hover d-table-row my-3" key={index}>
                    <td className="d-table-cell">{index + 1}</td>
                    <td className="d-table-cell">{p.nickname}</td>
                    <td className="d-table-cell">{p.score.toFixed(2)}</td>
                    <td className="d-table-cell">{p.score.toFixed(2)}</td>
                  </div>
                )
              })}
            </tbody>
          </div>
        </div>
      </div>

      {!isVote ? (
        <div className="">
          <div className="h2">Đánh giá quiz</div>
          <div className="p-12px justify-content-center line-height-normal text-secondary d-flex align-items-center gap-3">
            <MyButton
              variant="outline-danger"
              className="bi bi-arrow-down-short fs-32px d-flex align-items-center justify-content-center"
              onClick={() => handleVoting('DOWN')}
            />
            <MyButton
              variant="outline-success"
              className="bi bi-arrow-up-short fs-32px d-flex align-items-center justify-content-center"
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
        className="text-white mt-4  text-uppercase"
        onClick={onOutRoomInEndGameBoard}
      >
        Rời phòng
      </MyButton>
    </div>
  )
}

export default CommunityEndGameBoard
