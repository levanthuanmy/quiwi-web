import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './Loading.module.css'

const LoadingFullScreen: FC = () => {
  return (
    <div className="text-center">
      <div className={classNames(styles.ldEllipsis)}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default LoadingFullScreen
