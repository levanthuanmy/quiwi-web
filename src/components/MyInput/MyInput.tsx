import classNames from 'classnames'
import React, { FC, useState } from 'react'
import styles from './MyInput.module.css'

type MyInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  iconClassName?: string
  onIconClick?: React.MouseEventHandler<HTMLDivElement>
}
const MyInput: FC<MyInputProps> = (props) => {
  let value = ''
  return (
    <div
      className={classNames(
        'form-control rounded-10px h-50px d-flex p-0 overflow-hidden',
        props.className,
        styles.input
      )}
    >
      <input {...props} className="w-100 outline-none border-0 px-12px" />
      <div
        className={classNames(
          'align-self-center fs-24px pe-12px',
          styles.icon,
          props.iconClassName
        )}
        onClick={props.onIconClick}
      />
    </div>
  )
}

export default MyInput
