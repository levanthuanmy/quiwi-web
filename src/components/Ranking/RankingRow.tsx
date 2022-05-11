import React, { FC } from 'react'
import { Image } from 'react-bootstrap'

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
    <tr className={isHighlight ? 'bg-primary' : ''}>
      <td>{rank}</td>
      <td>
        <Image
          src={'/assets/default-logo.png'}
          width={30}
          height={30}
          alt="avatar"
          className="rounded-circle"
        />
        <span className="text-white ps-2 pe-1 fw-medium">{username}</span>
      </td>
      <td>{quantity}</td>
    </tr>
  )
}

export default RankingRow
