import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import styles from './MultipleChoiceAnswerSection.module.css'
import classNames from 'classnames'

type MultipleChoiceAnswerSectionProps = {
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  options: Array<string>
}
const colorArray: Array<string> = ['#009883', '#563429', '#B89A61', '#A9C77E']
const MultipleChoiceAnswerSection: FC<MultipleChoiceAnswerSectionProps> = ({
  className,
  onClick,
  options,
}) => {
  return (
    <div className={classNames(className, 'rounded-20px bg-white pt-20px')}>
      {/* 4 câu trả lời */}
      <Row className="pt-20px ">
        {options.map((item, index) => {
          return (
            <Col
              md="6"
              xs="12"
              className={classNames(styles.selectionItem)}
              key={index}
            >
              <div
                className={classNames(
                  'rounded-20px d-flex align-items-center py-20px px-20px h-100'
                )}
                style={{
                  background: colorArray[index],
                }}
              >
                <div
                  className={classNames(
                    'fw-bold fs-4',
                    styles.alphaBetContainer
                  )}
                >
                  <div className={styles.alphaBetText}>A</div>
                </div>
                <div className={'ps-12px text-white fs-4 fw-semiBold'}>
                  {item}
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default MultipleChoiceAnswerSection
