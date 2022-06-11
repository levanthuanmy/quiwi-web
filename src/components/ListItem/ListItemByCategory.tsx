/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import { Col, Collapse, Row } from 'react-bootstrap'
import { TItem, TUserItems } from '../../types/types'
import Item from '../Item/Item'
import styles from './ListItemByCategory.module.css'

type IListItem = {
  name: string
  id: number
  userItems: TUserItems[]
}

const ListItemByCategory: FC<IListItem> = (props) => {
  const [isCollapse, setIsCollapse] = useState(false)
  const setCollapse = () => {
    setIsCollapse(!isCollapse)
  }
  const [itemsRes, setItemsRes] = useState<Array<TUserItems>>()

  useEffect(() => {
    const getItems = () => {
      try {
        if (props.userItems) {
          let items: TUserItems[] = []
          props.userItems.forEach((element) => {
            if (element.item != null)
              if (element.item.itemCategoryId === props.id) items.push(element)
          })
          setItemsRes(items)
        }
      } catch (error) {
        alert('Có lỗi nè')
        console.log(error)
      }
    }

    getItems()
  }, [props.userItems])

  return (
    <div className={classNames('cursor-pointer', styles.listItem)}>
      <div onClick={setCollapse} aria-expanded={isCollapse}>
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
        <div className="justify-content-md-center">
          <div className={classNames('', styles.itemList)}>
            {itemsRes?.length === 0 ? (
              <div>Không có vật phẩm</div>
            ) : (
              itemsRes?.map((item, idx) => (
                <Item
                  key={idx}
                  name={item.item.name}
                  des={item.item.description}
                  avatar={item.item.avatar}
                  type={item.item.type}
                  price={item.item.price}
                  quantity={item.quantity}
                ></Item>
              ))
            )}
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default ListItemByCategory
