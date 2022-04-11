import classNames from 'classnames'
import React, { FC } from 'react'
import { FormControl, FormControlProps } from 'react-bootstrap'
import styles from './MyInput.module.css'

type MyInputProps = FormControlProps & { iconClassName?: string }
const MyInput: FC<MyInputProps> = (props) => {
  return (
    <div
      className={classNames(
        'form-control rounded-10px h-50px d-flex p-0 overflow-hidden',
        props.className,
        styles.input
      )}
    >
      <FormControl
        {...props}
        className="border-0 m-0 h-100 w-100 shadow-none px-12px"
      />
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
