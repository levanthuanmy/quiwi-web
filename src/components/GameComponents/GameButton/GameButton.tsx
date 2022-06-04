import classNames from 'classnames'
import React, { FC } from 'react'
import { Button, ButtonProps } from 'react-bootstrap'
import styles from "./GameButton.module.css"

type GameButtonProps = {
  iconClassName: string
  className?: string
  onClick?: () => void
  title?: string
  isEnable?: boolean
}

const GameButton: FC<GameButtonProps> = (props) => {
  return (
    <Button    
      disabled={!(props.isEnable ?? true)}  
      className={classNames(styles.moreButton, props.className)}
      onClick={props.onClick}
    >
      <div className={classNames("fw-bold",styles.moreTitle)}>{props.title}</div>
      <i className={classNames("fw-bold", props.iconClassName, styles.moreButtonIcon)} />
    </Button>
  )
}

export default GameButton
