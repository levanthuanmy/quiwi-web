import classNames from 'classnames'
import router from 'next/router'
import { FC } from 'react'
import { Dropdown } from 'react-bootstrap'
import { TGameHistory } from '../../types/types'
import { GAME_MODE_MAPPING } from '../../utils/constants'
import { getExcelFile } from '../../utils/exportToExcel'
import {
  formatDate_HHmmDDMMMYYYY,
  formatDate_DDMMMMYYYY,
} from '../../utils/helper'
import styles from './HistoryGameRow.module.css'

const HistoryGameRow: FC<{
  gameHistory: TGameHistory
}> = ({ gameHistory }) => {
  return (
    <tr className="">
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
        <div
          className={classNames(
            'ps-3 py-3  fw-medium rounded-start-14px bg-light'
          )}
        >
          {gameHistory.quiz.title}
        </div>
      </td>

      <td className={classNames(styles.cell)}>
        <div className={classNames('py-3 bg-light')}>
          <span className="d-none d-lg-table-cell">
            {formatDate_HHmmDDMMMYYYY(gameHistory.createdAt)}
          </span>
          <span className="d-table-cell d-lg-none">
            {formatDate_DDMMMMYYYY(gameHistory.createdAt)}
          </span>
        </div>
      </td>

      <td className={classNames(styles.cell)}>
        <div
          className={classNames(
            'py-3 bg-light text-center',
            styles.borderRadiusSm
          )}
        >
          {GAME_MODE_MAPPING[gameHistory.mode] ?? 'Truyền Thống'}
        </div>
      </td>
      <td
        className={classNames(styles.cell, 'd-none d-lg-table-cell text-end ')}
      >
        <div className={classNames('py-3 bg-light')}>
          {gameHistory.players.length}
        </div>
      </td>
      <td className={classNames(styles.cell, 'd-none d-md-table-cell')}>
        <Dropdown>
          <Dropdown.Toggle
            variant="white"
            className={classNames(
              styles.dropdown,
              'bg-light py-3 m-0 text-end'
            )}
          >
            <div>
              <i className="bi bi-three-dots-vertical fs-14px"></i>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href={`/history/${gameHistory.id}`}>
              Xem chi tiết
            </Dropdown.Item>
            <Dropdown.Item onClick={() => getExcelFile(gameHistory)}>
              Tải xuống
            </Dropdown.Item>
            <Dropdown.Item href="#/action-3">Xóa khỏi lịch sử</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  )
}

export { HistoryGameRow }
