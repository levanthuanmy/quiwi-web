import classNames from 'classnames'
import { FC } from 'react'
import { Image } from 'react-bootstrap'
import styles from './AvatarSelection.module.css'
type IItem = {
  name: string
  des: string
  avatar: string
  type: string
  price: number
  choose: boolean
  isUsed: boolean
}

const AvatarItem: FC<IItem> = (props) => {
  return (
    <div className={classNames(styles.avatarItem)}>
      <div className="position-relative">
        <Image
          loading="lazy"
          className={classNames('')}
          src={props.avatar}
          width={124}
          height={124}
          alt="coin"
        ></Image>
      </div>
    </div>
  )
}

export default AvatarItem
