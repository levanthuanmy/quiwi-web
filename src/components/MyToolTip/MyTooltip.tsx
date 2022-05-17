import { FC, ReactNode } from 'react'
import styles from './MyTooltip.module.css'

const MyTooltip: FC<{ children?: ReactNode, title: string }> = ({ children, title }) => {
  return (
    <div className={styles.tooltip}>
      {children}
      <span className={styles.tooltiptext}>{title}</span>
    </div>
  )
}

export { MyTooltip }
