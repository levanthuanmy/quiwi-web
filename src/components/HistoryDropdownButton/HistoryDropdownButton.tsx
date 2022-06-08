import classNames from 'classnames'
import { FC } from 'react'
import { Dropdown } from 'react-bootstrap'
import { TGameHistory } from '../../types/types'
import { getExcelFile } from '../../utils/exportToExcel'
import styles from './HistoryDropdownButton.module.css'

const HistoryDropdownButton: FC<{
  gameHistory: TGameHistory
  isFromHistoryPage: boolean
}> = ({ gameHistory, isFromHistoryPage = true }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="white"
        className={classNames(
          styles.dropdown,
          isFromHistoryPage ? styles.borderRadius : '',
       
          'py-3 m-0 text-end'
        )}
      >
        <div>
          <i
            className={classNames(
              'bi bi-three-dots-vertical',
              isFromHistoryPage ? 'fs-14px' : 'fs-22px fw-bold'
            )}
          ></i>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {isFromHistoryPage ? (
          <Dropdown.Item href={`/history/${gameHistory.id}`}>
            Xem chi tiết
          </Dropdown.Item>
        ) : (
          <Dropdown.Item href={`/history`}>Xem các lịch sử khác</Dropdown.Item>
        )}

        <Dropdown.Item onClick={() => getExcelFile(gameHistory)}>
          Tải xuống
        </Dropdown.Item>
        <Dropdown.Item href="#/action-3">Xóa khỏi lịch sử</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export { HistoryDropdownButton }
