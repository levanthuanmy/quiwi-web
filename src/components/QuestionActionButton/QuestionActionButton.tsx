import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './QuestionActionButton.module.css'

type QuestionActionButtonProps = {
  iconClassName: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  title?: string
}
const QuestionActionButton: FC<QuestionActionButtonProps> = ({
  iconClassName,
  className,
  onClick,
  title,
}) => {
  return (
    <div
      className={classNames(
        'rounded-6px d-flex justify-content-center align-items-center fs-18px cursor-pointer border',
        styles.container,
        className,
        { 'w-auto px-2': title?.length }
      )}
      onClick={onClick}
    >
      <i className={classNames(iconClassName, { 'me-2': title?.length })} />
      <span className="fw-medium fs-16px">{title}</span>
    </div>
  )
}

export default QuestionActionButton
