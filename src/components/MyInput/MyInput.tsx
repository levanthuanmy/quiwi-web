import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './MyInput.module.css'

type MyInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  iconClassName?: string
}
const MyInput: FC<MyInputProps> = (props) => {
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
      />
    </div>
  )
}

export default MyInput
