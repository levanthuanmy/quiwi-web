import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import styles from './ItemMenuBar.module.css'

type ItemMenuBarProps = {
  title: string
  iconClassName: string
  url: string
  isActive?: boolean
}
const ItemMenuBar: FC<ItemMenuBarProps> = ({
  title,
  iconClassName,
  url,
  isActive,
}) => {
  const router = useRouter()
  const activeStyle = isActive
    ? `${styles.active} border-end border-5 border-primary text-primary fw-medium`
    : ''
  return (
    <div
      className={classNames(
        'd-flex align-items-center px-3 cursor-pointer text-secondary text-truncate',
        styles.container,
        activeStyle
      )}
      onClick={() => router.push(url)}
    >
      <i className={classNames('fs-18px pe-3', iconClassName)} />
      {title}
    </div>
  )
}

export default ItemMenuBar
