import classNames from 'classnames'
import router from 'next/router'
import { FC } from 'react'
import { TGameHistory, TGameModeEnum } from '../../types/types'
import { GAME_MODE_MAPPING } from '../../utils/constants'
import {
  formatDate_DDMMMMYYYY,
  formatDate_HHmmDDMMMYYYY,
  renderPercentage,
} from '../../utils/helper'
import styles from './HistoryGameRow.module.css'

const HistoryGameRowByQuiz: FC<{
  gameHistory: TGameHistory
  secretKey?: string
}> = ({ gameHistory, secretKey }) => {
  const player = gameHistory.players[0]
  return (
    <tr className="bg-light rounded-14px">
      <td
        className={classNames(
          styles.firstCell,
          styles.cell,
          'cursor-pointer text-wrap px-0'
        )}
        onClick={() => {
          router.push(`/history/${gameHistory.id}?invitationCode=${secretKey}`)
        }}
      >
        <div className={classNames('ps-3 py-3 fw-medium ')}>
          {gameHistory.quiz.title}
        </div>
      </td>

      <td className={classNames(styles.cell, 'd-table-cell ')}>
        <div className={classNames('py-3 pe-3')}>{player.nickname}</div>
      </td>

      <td className={classNames(styles.cell)}>
        <div className={classNames('py-3')}>
          <span className="d-table-cell">
            {formatDate_DDMMMMYYYY(gameHistory.createdAt)}
          </span>
        </div>
      </td>

      <td className={classNames(styles.cell)}>
        <div className={classNames('py-3 ')}>
          {renderPercentage(player.score)}
        </div>
      </td>

      <td className={classNames(styles.cell)}>
        <div className={classNames('py-3', styles.borderRadiusSm)}>
          {GAME_MODE_MAPPING[gameHistory.mode as TGameModeEnum] ??
            'Truyền Thống'}
        </div>
      </td>
    </tr>
  )
}

export { HistoryGameRowByQuiz }
