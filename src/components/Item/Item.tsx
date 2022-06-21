import classNames from 'classnames'
import { FC, useState } from 'react'
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap'
import ItemDetail from '../ItemDetail/ItemDetail'
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

  return (
    <div className={classNames('', styles.layoutImage)}>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip>
            <ItemDetail props={props}></ItemDetail>
          </Tooltip>
        }
      >
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
              {props.quantity > 0 ? props.quantity : null}
            </div>
          </div>
        </div>
      </OverlayTrigger>
    </div>
  )
}

export default Item
