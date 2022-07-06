import classNames from 'classnames'
import { FC } from 'react'
import { Image } from 'react-bootstrap'
import FlyingAnimation from '../GameComponents/FlyingAnimation/FlyingAnimation'
import styles from './Item.module.css'

type IItem = {
  name: string
  des: string
  avatar: string
  type: string
  price: number
  quantity: number
  onClick: () => void
}

const Item: FC<IItem> = (props) => {
  return (
    <div
      onClick={props.onClick}
      style={{ width: 60, height: 60 }}
      className={classNames(
        'rounded-6px cursor-pointer overflow-hidden',
        styles.imageTypeNormal,
        {
          [styles.imageTypeRare]: props.type === 'RARE',
          [styles.imageTypeEpic]: props.type === 'EPIC',
          [styles.imageTypeLegendary]: props.type === 'LEGENDARY',
        }
      )}
    >
      <Image
        className={classNames('w-100 h-100 object-fit-cover')}
        src={props.avatar}
        alt="coin"
      />
    </div>
  )
}

export default Item
