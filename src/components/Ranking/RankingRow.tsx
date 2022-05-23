import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import styles from './ranking.module.css'

export type RankingProps = {
  id: number
  rank: number
  username: string
  quantity: string
  isHighlight: boolean
}

const RankingRow: FC<RankingProps> = ({
  id,
  rank,
  username,
  quantity,
  isHighlight,
}) => {
  const router = useRouter()
  return (
    <tr
      className={classNames(
        {
          'text-white bg-primary': isHighlight,
        },
        styles.zoom
      )}
      onClick={() => {
        if (isHighlight) {
          router.push(`/profile`)
        } else {
          router.push(`/users/${id}`)
        }
      }}
    >
      <td className={classNames('p-2', styles.MarginLeft)}>{rank}</td>
      <td>
        <Image
          src={'/assets/default-logo.png'}
          width={30}
          height={30}
          alt="avatar"
          className="rounded-circle"
        />
        <span
          className={classNames('ps-2 pe-1 fw-medium', {
            'text-white': isHighlight,
          })}
        >
          {username}
        </span>
      </td>
      <td>{quantity}</td>
    </tr>
  )
}

export default RankingRow
