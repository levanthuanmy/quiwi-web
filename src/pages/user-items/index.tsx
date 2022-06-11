import { NextPage } from 'next'
import React, { FC, useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import ListItemByCategory from '../../components/ListItem/ListItemByCategory'
import ModalBadge from '../../components/ModalBadge/ModalBadge'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TItem,
  TItemCategory,
  TPaginationResponse,
  TUserItems,
} from '../../types/types'

const UserItemPage: FC<{
  itemCategories: TPaginationResponse<TItemCategory>
  userItems: TUserItems[]
}> = ({ itemCategories, userItems }) => {
  const [toggleState, setToggleState] = useState<number>(1)
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <div className="w-100">
        <Row className="justify-content-md-center">
          <Col>
            {itemCategories?.items.map((category, idx) => (
              <ListItemByCategory
                key={idx}
                name={category.name}
                id={category.id}
                userItems={userItems}
              />
            ))}
          </Col>
        </Row>
      </div>

      <Modal
        show={show}
        size="sm"
        centered
        onShow={() => setShow(true)}
        onHide={() => setShow(false)}
      >
        <ModalBadge onClose={() => setShow(false)}></ModalBadge>
      </Modal>
    </div>
  )
}

export default UserItemPage
