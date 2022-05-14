import classNames from 'classnames'
import React, { FC, memo, ReactNode, useState } from 'react'
import { HOME_MENU_OPTIONS } from '../../utils/constants'
import MenuBar from '../MenuBar/MenuBar'
import NavBar from '../NavBar/NavBar'
import styles from './DashboardLayout.module.css'

type DashboardLayoutProps = {
  children?: ReactNode
}
const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [isExpand, setIsExpand] = useState<boolean>(false)

  return (
    <>
      <NavBar isExpand={isExpand} setIsExpand={setIsExpand} />
      <div className="d-flex min-vh-100" style={{ paddingTop: 80 }}>
        <MenuBar isExpand={isExpand} menuOptions={HOME_MENU_OPTIONS} />
        <div className={classNames('w-100 ps-0', styles.padOnSma)}>
          {children}
        </div>
      </div>
    </>
  )
}

export default memo(DashboardLayout)
