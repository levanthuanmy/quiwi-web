import classNames from 'classnames'
import React, { FC, memo } from 'react'
import { useAuth } from '../../hooks/useAuth/useAuth'
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
  const authNavigate = useAuth()
  return (
    <div
      className={classNames(
        'd-flex align-items-center px-3 py-2 cursor-pointer text-secondary text-truncate gap-3',
        styles.container,
        {
          'fw-medium': isActive,
        }
      )}
      onClick={() => authNavigate.navigate(url)}
      title={title}
    >
      <div
        className={classNames(
          'fs-20px d-flex justify-content-center align-items-center bg-primary rounded-10px',
          {
            'bg-opacity-100 text-white': isActive,
            'bg-opacity-10 text-primary': !isActive,
          },
          styles.item,
          iconClassName
        )}
      />
      <div className="fs-18px">{title}</div>
    </div>
  )
}

export default memo(ItemMenuBar)
