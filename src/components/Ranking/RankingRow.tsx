import React, { FC } from 'react'

export type RankingProps = {
  rank: number
  username: string
  quantity: string
}

const RankingRow: FC<RankingProps> = ({ rank, username, quantity }) => {
  return (
    <tr key={rank}>
      <td>{rank}</td>
      <td>{username}</td>
      <td>{quantity}</td>
    </tr>
  )
}

export default RankingRow
