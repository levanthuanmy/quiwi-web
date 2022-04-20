import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'

type QuestionConfigBtnProps = {
  prefixIcon: ReactNode
  title: ReactNode
  suffixIcon: ReactNode
  className?: string
}
const QuestionConfigBtn: FC<QuestionConfigBtnProps> = ({
  prefixIcon,
  suffixIcon,
  title,
  className,
}) => {
  return (
    <Row
      className={classNames(
        'm-0 border bg-white rounded-10px d-flex p-2 align-items-center cursor-pointer',
        className
      )}
    >
      <Col xs="auto" className="ps-0">
        {prefixIcon}
      </Col>
      <Col className="text-secondary p-0 fs-14px">{title}</Col>
      <Col xs="auto" className="pe-0">
        {suffixIcon}
      </Col>
    </Row>
  )
}

export default QuestionConfigBtn
