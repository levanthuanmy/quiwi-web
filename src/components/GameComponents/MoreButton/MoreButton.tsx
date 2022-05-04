import classNames from 'classnames'
import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Button, ButtonProps } from 'react-bootstrap'
import styles from "./MoreButton.module.css"

type MoreButtonProps = {
  iconClassName: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  title?: string
}

const MoreButton: FC<MoreButtonProps> = ({
  iconClassName,
  className,
  onClick,
  title,
}) => {
  return (
    <Button      
      className={classNames(styles.moreButton, className)}
    >
      <div className={classNames("fw-bold fs-5",styles.moreTitle)}>{title}</div>
      <i className={classNames("fs-5 fw-bold", iconClassName, styles.moreButtonIcon)} />
    </Button>
  )
}

export default MoreButton
