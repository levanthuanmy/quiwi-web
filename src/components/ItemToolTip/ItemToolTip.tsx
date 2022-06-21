import classNames from 'classnames'
import { FC, ReactNode, useState } from 'react'
import ItemDetail from '../ItemDetail/ItemDetail'
import styles from './ItemToolTip.module.css'

type IItem = {
  name: string
  des: string
  avatar: string
  type: string
  price: number
}

const ItemToolTip: FC<{ children?: ReactNode; props: IItem }> = ({
  children,
  props,
}) => {
  const [isShow, setIsShow] = useState(false)
  const handleMouseIn = () => setIsShow(true)
  const handleMouseOut = () => setIsShow(false)
  return (
    <div
      className={classNames('', styles.tooltip)}
      onMouseOver={handleMouseIn}
      onMouseLeave={handleMouseOut}
    >
      {isShow && (
        <div className={classNames('', styles.tooltipContent, styles.right)}>
          <ItemDetail props={props}></ItemDetail>
        </div>
      )}
      {children}
    </div>
  )
}

export default ItemToolTip
