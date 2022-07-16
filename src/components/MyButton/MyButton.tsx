import classNames from 'classnames'
import React, { FC } from 'react'
import { Button, ButtonProps } from 'react-bootstrap'

type MyButtonProps = ButtonProps
const MyButton: FC<MyButtonProps> = (props) => {
  return (
    <Button
      {...props}
      className={classNames('rounded-8px h-50px shadow-sm', props.className)}
    >
      {props.children}
    </Button>
  )
}

export default MyButton
