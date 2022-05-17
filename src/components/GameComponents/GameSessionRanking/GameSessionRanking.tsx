import classNames from 'classnames'
import { FC, memo } from 'react'
import { Modal, Table } from 'react-bootstrap'
import MyModal from '../../MyModal/MyModal'

type GameSessionRankingProps = {
  show: boolean
  onHide: () => void
  rankingData: any[]
}
const GameSessionRanking: FC<GameSessionRankingProps> = ({
  show,
  onHide,
  rankingData,
}) => {
  return (
    <MyModal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen
      header={<Modal.Title>Bảng xếp hạng</Modal.Title>}
    >
      <div className="rounded-14px border overflow-hidden">
        <Table borderless className="mb-0">
          <tbody>
            <tr className="border-bottom bg-primary bg-opacity-10 fw-medium">
              <td className="p-3">#</td>
              <td className="p-3">Tên người tham dự</td>
              <td className="p-3">Điểm số</td>
              <td className="p-3">Liên tiếp</td>
            </tr>
            {rankingData?.map((item, key) => (
              <tr
                key={key}
                className={classNames({
                  'border-top': key !== 0,
                })}
              >
                <td className="p-3">
                  <div
                    className={classNames(
                      'd-flex justify-content-center align-items-center fw-medium',
                      {
                        'rounded-circle text-white': key < 3,
                        'bg-warning': key === 0,
                        'bg-secondary bg-opacity-50': key === 1,
                        'bg-bronze': key === 2,
                      }
                    )}
                    style={{ width: 30, height: 30 }}
                  >
                    {key + 1}
                  </div>
                </td>
                <td className="p-3">{item?.nickname}</td>
                <td className="p-3">
                  <div
                    className={classNames(
                      'py-1 px-2 fw-medium text-center rounded-10px overflow-hidden',
                      {
                        'text-white': key < 3,
                        'bg-warning': key === 0,
                        'bg-secondary bg-opacity-50': key === 1,
                        'bg-bronze': key === 2,
                        'bg-secondary bg-opacity-75': key > 2,
                      }
                    )}
                    style={{ width: 90 }}
                  >
                    {Math.round(item?.score)}
                  </div>
                </td>
                <td className="p-3">{item?.currentStreak}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </MyModal>
  )
}

export default memo(GameSessionRanking)
