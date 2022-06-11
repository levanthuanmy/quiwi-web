import classNames from 'classnames'
import { FC, useState } from 'react'
import { Image } from 'react-bootstrap'
import ItemToolTip from '../ItemToolTip/ItemToolTip'
import styles from './Item.module.css'

type IItem = {
  name: string
  des: string
  avatar: string
  type: string
  price: number
  quantity: number
}

const Item: FC<IItem> = (props) => {
  const [isCollapse, setIsCollapse] = useState(false)
  const setCollapse = () => {
    setIsCollapse(!isCollapse)
  }
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  return (
    <div>
      <div className={classNames('', styles.layoutImage)}>
        <ItemToolTip props={props}>
          <div className="position-relative">
            <Image
              className={classNames(
                '',
                props.type === 'RARE'
                  ? styles.imageTypeRare
                  : props.type === 'EPIC'
                  ? styles.imageTypeEpic
                  : props.type === 'LEGENDARY'
                  ? styles.imageTypeLegendary
                  : styles.imageTypeNormal
              )}
              src={props.avatar}
              width={50}
              height={50}
              alt="coin"
            ></Image>
            <div className={styles.itemQuantity}>
              <div className={styles.overlay}>
                {props.quantity > 0 ? props.quantity : 1}
              </div>
            </div>
          </div>
        </ItemToolTip>
      </div>
    </div>
  )
}

export default Item
