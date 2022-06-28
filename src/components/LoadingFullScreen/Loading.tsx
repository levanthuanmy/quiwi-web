import React, { FC } from 'react'
import styles from './Loading.module.css'

const LoadingFullScreen: FC = () => {
  return (
    <div className={styles.ldEllipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default LoadingFullScreen
