import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import ItemMenuBar from '../ItemMenuBar/ItemMenuBar'
import styles from './MenuBar.module.css'

type MenuBarProps = {
  isExpand: boolean
  menuOptions: {
    title: string
    url: string
    iconClassName: string
  }[]
}
const MenuBar: FC<MenuBarProps> = ({ isExpand, menuOptions }) => {
  const router = useRouter()

  return (
    <div
      className={classNames(
        'border-end position-fixed bg-white overflow-hidden text-nowrap d-flex flex-column py-3',
        styles.container,
        {
          'shadow-lg': isExpand,
        },
        `${isExpand ? styles.expandWidth : styles.normalWidth}`
      )}
    >
      <div>
        {menuOptions.map((item, key) => (
          <ItemMenuBar
            key={key}
            {...item}
            isActive={router.pathname === item.url}
          />
        ))}
      </div>
    </div>
  )
}

export default MenuBar
