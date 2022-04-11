import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import ItemMenuBar from '../ItemMenuBar/ItemMenuBar'
import styles from './MenuBar.module.css'

type MenuBarProps = {
  isExpand: boolean
  setIsExpand: React.Dispatch<React.SetStateAction<boolean>>
}
const MenuBar: FC<MenuBarProps> = ({ isExpand, setIsExpand }) => {
  const router = useRouter()
  const menuOptions = [
    { title: 'Trang chủ', url: '/', iconClassName: 'bi bi-house' },
    {
      title: 'Thư viện của tôi',
      url: '/lib',
      iconClassName: 'bi bi-bookmarks',
    },
    { title: 'Khám phá', url: '/ex', iconClassName: 'bi bi-compass' },
  ]

  return (
    <div
      className={classNames(
        'border-end position-fixed h-100 bg-white overflow-hidden text-nowrap',
        styles.container
      )}
      style={{ width: isExpand ? 240 : 48 }}
    >
      <div
        className="position-relative cursor-pointer"
        style={{ height: 48 }}
        onClick={() => setIsExpand((prev) => !prev)}
      >
        <i
          className={classNames(
            'fs-18px position-absolute d-flex justify-content-center align-items-center',
            styles.button,
            {
              'bi bi-chevron-double-left': isExpand,
              'bi bi-chevron-double-right': !isExpand,
            }
          )}
        />
      </div>

      {menuOptions.map((item, key) => (
        <ItemMenuBar
          key={key}
          {...item}
          isActive={router.pathname === item.url}
        />
      ))}
    </div>
  )
}

export default MenuBar
