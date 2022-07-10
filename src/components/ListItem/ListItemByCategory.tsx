/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import { Collapse, Row } from 'react-bootstrap'
import { TUserItems } from '../../types/types'
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

          for (const userItem of props.userItems) {
            if (userItem.item != null)
              if (userItem.item.itemCategoryId === props.id) {
                items.push(userItem)
              }
          }
          setItemsRes(items)
        }
      } catch (error) {
        // alert('Có lỗi nè')
        console.log(error)
      }
    }

    getItems()
  }, [props.userItems])

  return (
    <div className={classNames('cursor-pointer', styles.listItem)}>
      <div onClick={setCollapse} aria-expanded={isCollapse}>
        <Row className="bg-primary py-2 text-white">
          <div>
            {props.name}{' '}
            <span
              style={{ width: 30, height: 30 }}
              className="mx-1 bg-dark bg-opacity-25 rounded-10px d-inline-flex justify-content-center align-items-center"
            >
              {itemsRes?.length ?? 0}
            </span>
          </div>
        </Row>
      </div>

      <div className={classNames('', styles.content)}>
        <div className="d-flex ">
          <div className={classNames('d-flex', styles.itemList)}>
            {itemsRes?.length === 0 ? (
              <div>Không có vật phẩm</div>
            ) : (
              itemsRes?.map((item, idx) => (
                <div key={idx} className="px-1">
                  <Item
                    name={item.item.name}
                    des={item.item.description}
                    avatar={item.item.avatar}
                    type={item.item.type}
                    price={item.item.price}
                    quantity={item.quantity}
                  ></Item>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListItemByCategory
