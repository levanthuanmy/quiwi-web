import classNames from 'classnames'
import router from 'next/router'
import { FC } from 'react'
import { TGameHistory, TGameModeEnum } from '../../types/types'
import { GAME_MODE_MAPPING } from '../../utils/constants'
import {
  formatDate_DDMMMMYYYY,
  formatDate_HHmmDDMMMYYYY,
} from '../../utils/helper'
import { HistoryDropdownButton } from '../HistoryDropdownButton/HistoryDropdownButton'
import styles from './HistoryGameRow.module.css'

const HistoryGameRow: FC<{
  gameHistory: TGameHistory
}> = ({ gameHistory }) => {
  return (
    <tr className="bg-light rounded-14px">
      <td
        className={classNames(
          styles.firstCell,
          styles.cell,
          'cursor-pointer text-wrap px-0'
        )}
        onClick={() => {
          router.push(`/history/${gameHistory.id}`)
        }}
      >
        <div className={classNames('ps-3 py-3 fw-medium rounded-start-14px')}>
          {gameHistory.quiz.title}
        </div>
      </td>

      <td className={classNames(styles.cell)}>
        <div className={classNames('py-3')}>
          <span className="d-none d-lg-table-cell">
            {formatDate_HHmmDDMMMYYYY(gameHistory.createdAt)}
          </span>
          <span className="d-table-cell d-lg-none">
            {formatDate_DDMMMMYYYY(gameHistory.createdAt)}
          </span>
        </div>
      </td>

      <td className={classNames(styles.cell)}>
        <div className={classNames('py-3  text-center', styles.borderRadiusSm)}>
          {GAME_MODE_MAPPING[gameHistory.mode as TGameModeEnum] ??
            'Truyền Thống'}
        </div>
      </td>
      <td
        className={classNames(styles.cell, 'd-none d-lg-table-cell text-end ')}
      >
        <div className={classNames('py-3 ')}>{gameHistory.players.length}</div>
      </td>
      <td className={classNames(styles.cell, 'd-none d-md-table-cell')}>
        <HistoryDropdownButton
          key={gameHistory.id}
          gameHistory={gameHistory}
          isFromHistoryPage={true}
        />
      </td>
    </tr>
  )
}

export { HistoryGameRow }
