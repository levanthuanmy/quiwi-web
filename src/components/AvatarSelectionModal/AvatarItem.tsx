import classNames from 'classnames'
import { FC } from 'react'
import { Image } from 'react-bootstrap'

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
    <div
      className={classNames(
        props.choose
          ? 'border border-3 border-primary'
          : props.isUsed
          ? 'border border-2 border-warning'
          : 'p-1'
      )}
    >
      <div className="position-relative">
        <Image
          className={classNames('')}
          src={props.avatar}
          width={64}
          height={64}
          alt="coin"
        ></Image>
      </div>
    </div>
  )
}

export default AvatarItem
