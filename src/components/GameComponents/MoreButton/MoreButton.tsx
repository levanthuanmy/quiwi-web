import classNames from 'classnames'
import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Button, ButtonProps } from 'react-bootstrap'
import styles from "./MoreButton.module.css"

type MoreButtonProps = {
  iconClassName: string
  className?: string
  onClick?: () => void
  title?: string
}

const MoreButton: FC<MoreButtonProps> = (props) => {
  return (
    <Button      
      className={classNames(styles.moreButton, props.className)}
      onClick={props.onClick}
    >
      <div className={classNames("fw-bold fs-5",styles.moreTitle)}>{props.title}</div>
      <i className={classNames("fs-5 fw-bold", props.iconClassName, styles.moreButtonIcon)} />
    </Button>
  )
}

export default MoreButton
