import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'
import { Image, Table } from 'react-bootstrap'
import { TRankingItem } from '../../pages/ranking'

const RankingBoard: FC<{ rankingList: TRankingItem[] }> = ({ rankingList }) => {
  const router = useRouter()

  return (
    <Table borderless>
      <tbody>
        <tr className="fw-medium">
          <td className="text-center">#</td>
          <td>Tên</td>
          <td>Số lượng đạt được</td>
        </tr>
        {rankingList?.map((user) => (
          <tr
            key={user.id}
            className={classNames('cursor-pointer')}
            onClick={() => {
              router.push(user?.isHighlight ? `/profile` : `/users/${user?.id}`)
            }}
          >
            <td className="pb-1 px-0">
              <div
                className={classNames(
                  'text-center py-3 fw-medium rounded-start-14px',
                  {
                    'text-white bg-primary': user?.isHighlight,
                    'bg-light': !user?.isHighlight,
                  }
                )}
              >
                {user?.rank}
              </div>
            </td>
            <td className="pb-1 px-0">
              <div
                className={classNames('py-3 ps-2 text-nowrap', {
                  'text-white bg-primary': user?.isHighlight,
                  'bg-light': !user?.isHighlight,
                })}
              >
                <Image
                  src={user.avatar || '/assets/default-avatar.png'}
                  width={20}
                  height={20}
                  alt="avatar"
                  className="rounded-circle"
                />
                <span className={classNames('ps-2 pe-1 fw-medium')}>
                  {user?.username}
                </span>
              </div>
            </td>
            <td className="pb-1 px-0">
              <div
                className={classNames('py-3 ps-2 rounded-end-14px', {
                  'text-white bg-primary': user?.isHighlight,
                  'bg-light': !user?.isHighlight,
                })}
              >
                {user?.quantity}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default memo(RankingBoard)
