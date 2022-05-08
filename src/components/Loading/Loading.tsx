import React, { FC } from "react"
import styles from "./Loading.module.css"

const Loading: FC = () => {
  return (
    <div className={styles.ldEllipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Loading
