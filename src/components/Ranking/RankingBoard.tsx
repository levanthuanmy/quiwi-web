import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'
import { Col, Image, Row, Table } from 'react-bootstrap'
import { TRankingItem } from '../../pages/ranking'

const RankingBoard: FC<{ rankingList: TRankingItem[] }> = ({ rankingList }) => {
  const router = useRouter()

  return (
    <>
      <Row className="mb-3 align-items-center fw-bold h5">
        <Col xs={1}>#</Col>
        <Col xs="7" md="5">
          Tên
        </Col>
        <Col md="3" className="d-none d-md-block">
          Định danh
        </Col>
        <Col xs="4" md="3">
          Số lượng đạt được
        </Col>
      </Row>
      {rankingList?.map((user) => (
        <Row key={user.rank} className="mb-3 align-items-center bg-light py-2 mx-0 rounded-8px shadow-sm">
          <Col xs={1} className="fw-bold fs-5">
            {user.rank}
          </Col>
          <Col
            xs="7"
            md="5"
            className="d-flex align-items-center gap-2 fw-bold"
          >
            <Image
              src={user.avatar || '/assets/default-avatar.png'}
              width={60}
              height={60}
              alt="avatar"
              style={{ objectFit: 'scale-down' }}
              className="rounded-circle bg-info"
              loading="lazy"
            />
            {user.name}
          </Col>
          <Col md="3" className="d-none d-md-block text-truncate">
            {user.username}
          </Col>
          <Col xs="4" md="3">
            {user.quantity.toLocaleString('en-US')}
          </Col>
        </Row>
      ))}
    </>
  )
}

export default memo(RankingBoard)
