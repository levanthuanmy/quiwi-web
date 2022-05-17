import classNames from 'classnames'
import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import styles from './ranking.module.css'

export type RankingProps = {
  rank: number
  username: string
  quantity: string
  isHighlight: boolean
}

const RankingRow: FC<RankingProps> = ({
  rank,
  username,
  quantity,
  isHighlight,
}) => {
  return (
    <tr
      className={classNames({
        'text-white bg-primary': isHighlight,
      }, styles.zoom)} onClick= {()=>{console.log('click')}}
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
