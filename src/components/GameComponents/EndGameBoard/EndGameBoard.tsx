import classNames from 'classnames'
import React, {FC, memo} from 'react'
import {useGameSession} from '../../../hooks/useGameSession/useGameSession'
import styles from './EndGameBoard.module.css'
import {TStartQuizResponse} from "../../../types/types";

type EndGameBoardProps = {
  className?: string
  gameSession: TStartQuizResponse
}

const EndGameBoard: FC<EndGameBoardProps> = ({className}) => {
  const {
    gameSession,
  } = useGameSession()

  const renderChart = (name: string, score: number, color: string, className: string) => {
    return <div
      className={classNames(className, "d-flex flex-column h-100")}
    >
      <div className={styles.rankingName}>{name}</div>
      <div className={styles.rankingScore} style={{backgroundColor: color}}>{score}</div>
    </div>
  }

  return (
    <div
      className={classNames(
        className,
        "d-flex flex-column h-50 bg-primary position-relative",
        styles.container
      )}
    >
      <div className={"pt-1 fs-1 fw-bold w-100 text-center"}>top 3 là</div>
      <div className={`${styles.rankingChart}`}>
        {renderChart("Thiện", 1000, "#2BAFA0", "")}
        {renderChart("Thiện", 1000, "#2AAF0A", "")}
        {renderChart("Thiện", 1000, "#2DAFDC", "")}
      </div>

    </div>
  )
}

export default memo(EndGameBoard)
