import classNames from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import { Col, Collapse, Row } from 'react-bootstrap'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'
import { TApiResponse, TItem, TUserItems } from '../../types/types'
import Item from '../Item/Item'
import styles from './ListItemByCategory.module.css'

type IListItem = {
  name: string
  id: number
}

const ListItemByCategory: FC<IListItem> = (props) => {
  const [isCollapse, setIsCollapse] = useState(false)
  const authContext = useAuth()
  const setCollapse = () => {
    setIsCollapse(!isCollapse)
  }
  const [itemsRes, setItemsRes] = useState<Array<TItem>>()

  useEffect(() => {
    const getItems = async () => {
      try {
        if (authContext !== undefined) {
          let userId = authContext.getUser()?.id || null
          const params = {
            userId: userId,
          }
          const res: TApiResponse<TUserItems[]> = await get(
            `/api/items/user-items`,
            true,
            params
          )

          if (res.response) {
            let items: Array<TItem> = []
            res.response.forEach((element) => {
              if (element.item.itemCategoryId === props.id)
                items.push(element.item)
            })
            setItemsRes(items)
          }
        }
      } catch (error) {
        alert('Có lỗi nè')
        console.log(error)
      }
    }

    getItems()
  }, [])

  return (
    <div className={classNames('', styles.listItem)}>
      <div onClick={() => setCollapse()}>
        <Row className="bg-primary py-2 text-white">
          <Col sm={11}>
            <div>{props.name}</div>
          </Col>
          <Col sm={1}>
            <div>
              <address></address>
            </div>
          </Col>
        </Row>
      </div>

      <Collapse in={isCollapse} className={classNames('', styles.content)}>
        <Row className="justify-content-md-center">
          <Col>
            <div className={classNames('badges-list')}>
              {itemsRes?.map((item, idx) => (
                <Item
                  key={idx}
                  name={item.name}
                  des={item.description}
                  avatar={item.avatar}
                  type={item.type}
                  price={item.price}
                ></Item>
              ))}
            </div>
          </Col>
        </Row>
      </Collapse>
    </div>
  )
}

export default ListItemByCategory
