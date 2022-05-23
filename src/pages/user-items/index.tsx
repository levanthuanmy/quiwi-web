import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import ListItemByCategory from '../../components/ListItem/ListItemByCategory'
import ModalBadge from '../../components/ModalBadge/ModalBadge'
import { get } from '../../libs/api'
import {
    TApiResponse,
    TItem,
    TItemCategory,
    TPaginationResponse
} from '../../types/types'

const UserItemPage: NextPage = () => {
  const [toggleState, setToggleState] = useState<number>(1)
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const [itemsResponse, setItemsResponse] =
    useState<TPaginationResponse<TItem>>()
  const [itemCategoriesResponse, setItemCategoriesResponse] =
    useState<TPaginationResponse<TItemCategory>>()

  useEffect(() => {
    const getItemCategories = async () => {
      try {
        const res: TApiResponse<TPaginationResponse<TItemCategory>> = await get(
          `/api/items/categories`,
          true
        )
        if (res.response) {
          setItemCategoriesResponse(res.response)
          //Lấy category đầu tiên để lấy ra dữ liệu item mặc định khi vào trang Shop
        }
      } catch (error) {
        alert('Có lỗi nè')
        console.log(error)
      }
    }

    getItemCategories()
    // if (!itemsResponse){
    //   getItems()
    // }
  }, [])

  return (
    <div>
      <div className="w-100">
        <Row className="justify-content-md-center">
          <Col>
            {itemCategoriesResponse?.items.map((category, idx) => (
              <ListItemByCategory
                key={idx}
                name={category.name}
                id={category.id}
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
