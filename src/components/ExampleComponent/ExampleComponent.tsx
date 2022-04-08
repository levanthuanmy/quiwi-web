import React, { FC, ReactNode } from 'react'

type ExampleComponentProps = {
  children?: ReactNode
}
const ExampleComponent: FC<ExampleComponentProps> = ({ children }) => {
  return <div>{children}</div>
}

export default ExampleComponent
