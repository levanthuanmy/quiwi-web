import classNames from 'classnames'
import React, { FC, memo, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import Confetti from 'react-confetti'
import { useToasts } from 'react-toast-notifications'
import { useWindowSize } from 'react-use'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import { useLocalStorage } from '../../../hooks/useLocalStorage/useLocalStorage'
import { get } from '../../../libs/api'
import { TPlayer } from '../../../types/types'
import { SOUND_EFFECT } from '../../../utils/constants'
import { JsonParse } from '../../../utils/helper'
import MyButton from '../../MyButton/MyButton'
import styles from './EndGameBoard.module.css'
import { useSound } from '../../../hooks/useSound/useSound'

type EndGameBoardProps = {
  className?: string
}

const EndGameBoard: FC<EndGameBoardProps> = ({ className }) => {
  const { width, height } = useWindowSize()
  const gameManager = useGameSession()
  const { isAuth } = useAuth()
  const [isVote, setIsVote] = useState<boolean>(false)
  const { addToast } = useToasts()
  const sound = useSound()
  const player = gameManager.player

  useEffect(() => {
    sound?.playSound(SOUND_EFFECT['END_GAME'])
    sound?.playSound(SOUND_EFFECT['CONGRATULATION_RANKING'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderList = () => {
    if (!gameManager.gameSession) return
    const players = gameManager.gameSession.players

    return (
      <>
        {players[1] && (
          <ItemChart
            point={players[1].score}
            name={players[1].nickname}
            position="2nd"
          />
        )}

        {players[0] && (
          <ItemChart
            point={players[0].score}
            name={players[0].nickname}
            position="1st"
          />
        )}

        {players[2] && (
          <ItemChart
            point={players[2].score}
            name={players[2].nickname}
            position="3rd"
          />
        )}
      </>
    )
  }

  const handleVoting = async (type: 'UP' | 'DOWN') => {
    try {
      if (isAuth) {
        await get(
          `/api/quizzes/vote-quiz-auth/${gameManager.gameSession?.quizId}?vote=${type}`,
          isAuth
        )
      } else {
        const playerName = player?.nickname || 'Ẩn danh'
        await get(
          `/api/quizzes/vote-quiz-unauth?vote=${type}&nickname=${playerName}&invitationCode=${gameManager.gameSession?.invitationCode}`,
          isAuth
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

  return (
    <div
      className={classNames(
        className,
        'd-flex flex-column bg-white',
        styles.container
      )}
    >
      <div className={`${styles.rankingChart} p-5`}>
        <Confetti width={width} height={height} />
        <div className="fs-1 fw-bold text-center">
          <Image
            src={`/assets/congrat-ribbon.png`}
            alt=""
            width="174"
            height="83"
          />
          <br />
          Tổng kết
        </div>
        <div className="d-flex align-items-end">{renderList()}</div>

        {!gameManager.isHost &&
          (!isVote ? (
            <div className="bg-light p-3 px-4 rounded-10px border text-center">
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
            <div className="bg-light p-3 px-4 rounded-10px border text-center">
              <div className="h2">
                Phản hồi của bạn đã được ghi nhận.
                <br />
                Cảm ơn bạn đã tham gia quiz này.
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default memo(EndGameBoard)

type TPositionRanking = '1st' | '2nd' | '3rd'
const ItemChart: FC<{
  position: TPositionRanking
  point: number
  name: string
  // eslint-disable-next-line react/display-name
}> = memo(({ position, point, name }) => {
  const game = useGameSession()
  point = Math.round(point)
  name = name.length > 4 ? name.substring(0, 4) + '...' : name

  const medalImage: Record<TPositionRanking, { image: string; color: string }> =
    {
      '1st': { image: '/assets/gold-medal.png', color: 'gold' },
      '2nd': { image: '/assets/silver-medal.png', color: 'silver' },
      '3rd': { image: '/assets/bronze-medal.png', color: 'brown' },
    }

  const getSize = () => {
    if (!game.gameSession) return
    if (position === '1st') return { height: 300, width: 100 }
    else {
      return {
        height: Math.max(Math.floor((point / (game.players[0].score + 1)) * 300), 150),
        width: 90,
      }
    }
  }

  return (
    <div
      className={classNames('position-relative text-center')}
      style={getSize()}
    >
      <div className={classNames(styles.ranking)}>
        <Image
          src={medalImage[position].image}
          alt=""
          width="80"
          height="90"
          className="align-self-center"
        />
        <div className={styles.rankingName}>{name}</div>
      </div>

      <div
        className={classNames(styles.rankingScore, styles.pillar)}
        style={{
          backgroundColor: medalImage[position].color,
        }}
      >
        {point}
      </div>
    </div>
  )
})
