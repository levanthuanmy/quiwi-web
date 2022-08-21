import classNames from 'classnames'
import { FC, useState } from 'react'
import { TGameHistory, TGameModeEnum } from '../../types/types'
import { GAME_MODE_MAPPING } from '../../utils/constants'
import { getPlayerFinalScore } from '../../utils/exportToExcel2'
import { formatDate_DDMMMMYYYY, renderPercentage } from '../../utils/helper'
import DetailedPlayerModal from '../DetailedHistoryComponents/PlayerTab.tx/DetailedPlayerModal'
import styles from './HistoryGameRow.module.css'

const HistoryGameRowByQuiz: FC<{
  gameHistory: TGameHistory
}> = ({ gameHistory }) => {
  const [showDetailedPlayerModal, setShowDetailedPlayerModal] = useState(false)

  const player = gameHistory.players[0]
  const data = getPlayerFinalScore(player, 1)

  return (
    <>
      <tr
        className="bg-light rounded-14px cursor-pointer"
        onClick={() => {
          setShowDetailedPlayerModal(true)
        }}
      >
        <td
          className={classNames(styles.firstCell, styles.cell, 'd-table-cell ')}
        >
          <div className={classNames('py-3 ps-2')}>{player.nickname}</div>
        </td>

        <td className={classNames(styles.cell, 'd-none d-lg-table-cell')}>
          <div className={classNames('py-3')}>
            <span>{formatDate_DDMMMMYYYY(gameHistory.createdAt)}</span>
          </div>
        </td>

        <td className={classNames(styles.cell)}>
          <div className={classNames('py-3 ')}>
            {renderPercentage(player.score)}
          </div>
        </td>

        <td className={classNames(styles.cell)}>
          <div className={classNames('py-3', styles.borderRadiusSm)}>
            {data[5]}
          </div>
        </td>

        <td className={classNames(styles.cell, 'd-none d-lg-table-cell')}>
          <div className={classNames('py-3', styles.borderRadiusSm)}>
            {GAME_MODE_MAPPING[gameHistory.mode as TGameModeEnum] ??
              'Truyền Thống'}
          </div>
        </td>
      </tr>
      {showDetailedPlayerModal && (
        <DetailedPlayerModal
          show={showDetailedPlayerModal}
          onHide={() => setShowDetailedPlayerModal(false)}
          player={player}
          rank={1}
        />
      )}
    </>
  )
}

export { HistoryGameRowByQuiz }
