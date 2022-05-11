import React, { FC } from 'react'
import { Table } from 'react-bootstrap'
import RankingRow, { RankingProps } from './RankingRow'

type RankingList = {
  rankingList?: RankingProps[]
}

const RankingBoard: FC<RankingList> = ({ rankingList }) => {
  // console.log('ashgcshabcascsbcsahcb', JSON.stringify(rankingList))
  const list = rankingList?.map((d) => 
    <RankingRow key={d.rank}
    rank={d.rank}
    username={d.username}
    quantity={d.quantity} 
    isHighlight={d.isHighlight}    />
  )

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Thứ hạng</th>
          <th>Tên</th>
          <th>Số lượng đạt được</th>
        </tr>
      </thead>
      <tbody>
        {list}
      </tbody>
    </Table>
  )
}

export default RankingBoard
