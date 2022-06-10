import classNames from 'classnames'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { Dropdown, Modal } from 'react-bootstrap'
import { get } from '../../libs/api'
import { TGameHistory } from '../../types/types'
import { getExcelFile } from '../../utils/exportToExcel2'
import { formatDate_DDMMYYYY } from '../../utils/helper'
import MyModal from '../MyModal/MyModal'
import styles from './HistoryDropdownButton.module.css'

const HistoryDropdownButton: FC<{
  gameHistory: TGameHistory
  isFromHistoryPage: boolean
}> = ({ gameHistory, isFromHistoryPage = true }) => {
  const [confirmationModal, setConfirmationModal] = useState(false)
  const router = useRouter()
  const deleteHistory = async () => {
    try {
      const rs = await get(
        `/api/games/delete-game-lobby/${gameHistory.id}`,
        true
      )
      router.push('/history')
    } catch (error) {
      alert((error as Error).message)
    }
  }
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

        <Dropdown.Item
          onClick={async () => {
            const buffer = await getExcelFile(gameHistory)

            var blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            let a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = `${formatDate_DDMMYYYY(gameHistory.createdAt)} ${
              gameHistory.quiz.title
            }.xlsx`
            a.click()
            a.remove()
          }}
        >
          Tải xuống
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setConfirmationModal(true)}>
          Xóa khỏi lịch sử
        </Dropdown.Item>
      </Dropdown.Menu>
      <MyModal
        show={confirmationModal}
        onHide={() => {
          setConfirmationModal(false)
        }}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={() => {
          setConfirmationModal(false)
          deleteHistory()
        }}
        inActiveButtonTitle="Hủy bỏ"
        inActiveButtonCallback={() => {
          setConfirmationModal(false)
        }}
        size="sm"
        header={<Modal.Title className={'text-primary'}>Xác nhận</Modal.Title>}
      >
        <div className="text-center fw-medium">
          Bạn có chắc xóa lịch sử này?{' '}
        </div>
      </MyModal>
    </Dropdown>
  )
}

export { HistoryDropdownButton }
