import classNames from 'classnames'
import React, {FC, useState} from 'react'
import styles from './MyInput.module.css'
import {JsonParse} from "../../utils/helper";

type MyInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement> & {
  iconClassName?: string
  handleIconClick?: () => void | undefined
  errorText?: string
}
const MyInput: FC<MyInputProps> = (props: MyInputProps) => {
  const {iconClassName, handleIconClick, errorText, ...inputProps} = props;
  return (
    <div className={classNames(
      props.className,
     "position-relative")}>
      <div
        className={classNames(
          'form-control rounded-10px h-50px d-flex p-0 overflow-hidden',
          styles.input,
          errorText ? styles.inputError : null
        )}
      >
        <input {...inputProps} className="w-100 outline-none border-0 px-12px"/>
        {(handleIconClick && iconClassName) && <div
            className={classNames(
              'align-self-center fs-24px pe-12px',
              styles.icon,
              iconClassName
            )}
            onClick={handleIconClick}
        />}
      </div>
      {errorText && <div className={classNames("text-danger", styles.error)}>{"*" + errorText}</div>}
    </div>

  )
}

export default MyInput
