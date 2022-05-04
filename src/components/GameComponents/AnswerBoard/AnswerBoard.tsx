import React, { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import styles from './AnswerBoard.module.css'
import classNames from 'classnames'
import MultipleChoiceAnswerSection from '../AnswerQuestionComponent/SelectionQuestion/MultipleChoiceAnswerSection'

type AnswerBoardProps = {
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  title?: string
}
const AnswerBoard: FC<AnswerBoardProps> = ({ className, onClick, title }) => {
  return (
    <div
      className={classNames(className, 'rounded-20px bg-white py-50px px-20px')}
    >
      {/* thứ tự câu hỏi */}
      <div className="fs-4 fw-semiBold">Câu hỏi số #1</div>
      {/* nội dung câu hỏi */}
      <div className="fs-4 fw-semiBold">Tại sao trái đất hình tròn?</div>
      {/* 4 câu trả lời */}
      <MultipleChoiceAnswerSection
      options={["Tại vì nó tròn", "Tại vì nó không vuông", "Tại vì sách giáo khoa dạy thế", "Cả 3 đáp án trên"]}
      ></MultipleChoiceAnswerSection>
    </div>
  )
}

export default AnswerBoard
