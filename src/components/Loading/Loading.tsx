import React, { FC } from 'react'
import styles from './Loading.module.css'

const Loading: FC<{ color?: string }> = ({ color = '#fff' }) => {
  return (
    <div className={styles.ldEllipsis}>
      <div style={{ backgroundColor: color }}></div>
      <div style={{ backgroundColor: color }}></div>
      <div style={{ backgroundColor: color }}></div>
      <div style={{ backgroundColor: color }}></div>
    </div>
  )
}

export default Loading
