import classNames from 'classnames'
import React, { FC, memo } from 'react'
import { Image } from 'react-bootstrap'
import { useGameSession } from '../../../hooks/useGameSession/useGameSession'
import { TStartQuizResponse } from '../../../types/types'
import styles from './EndGameBoard.module.css'

type EndGameBoardProps = {
  className?: string
}

const EndGameBoard: FC<EndGameBoardProps> = ({ className }) => {
  const { gameSession } = useGameSession()

  const renderList = () => {
    if (!gameSession) return
    const { players } = gameSession

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

  return (
    <div
      className={classNames(
        className,
        'd-flex flex-column bg-white',
        styles.container
      )}
    >
      <div className={`${styles.rankingChart} p-5`}>
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
  const { gameSession } = useGameSession()
  point = Math.round(point)
  name = name.length > 4 ? name.substring(0, 4) + '...' : name

  const medalImage: Record<TPositionRanking, { image: string; color: string }> =
    {
      '1st': { image: '/assets/gold-medal.png', color: 'gold' },
      '2nd': { image: '/assets/silver-medal.png', color: 'silver' },
      '3rd': { image: '/assets/bronze-medal.png', color: 'brown' },
    }

  const getSize = () => {
    if (!gameSession) return

    if (position === '1st') return { height: 300, width: 100 }
    else {
      return {
        height: Math.floor((point / gameSession.players[0].score) * 300),
        width: 90,
      }
    }
  }

  return (
    <div
      className={classNames('d-flex flex-column text-center justify-content-end')}
      style={getSize()}
    >
      <Image src={medalImage[position].image} alt="" width="80" height="90" className='align-self-center'/>
      <div className={styles.rankingName}>{name}</div>
      <div
        className={styles.rankingScore}
        style={{
          backgroundColor: medalImage[position].color,
        }}
      >
        {point}
      </div>
    </div>
  )
})
