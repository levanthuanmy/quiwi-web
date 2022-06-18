import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './IconQuestion.module.css'

export type QuestionType =
  | 'single'
  | 'multiple'
  | 'fill'
  | 'conjunction'
  | 'essay'
  | 'poll'

export const questionTypeStyles: Record<
  QuestionType,
  { icon: string; colorClassName: string; title: string }
> = {
  single: {
    icon: 'bi bi-check2',
    colorClassName: 'bg-primary',
    title: 'Một đáp án đúng',
  },
  multiple: {
    icon: 'bi bi-check2-all',
    colorClassName: 'bg-info',
    title: 'Nhiều đáp án đúng',
  },
  fill: {
    icon: 'bi bi-pencil-square',
    colorClassName: 'bg-warning',
    title: 'Điền vào chỗ trống',
  },
  conjunction: {
    icon: 'bi bi-reception-1',
    colorClassName: 'bg-success',
    title: 'Nối từ',
  },
  poll: {
    icon: 'bi bi-file-earmark-bar-graph',
    colorClassName: 'bg-danger',
    title: 'Bình chọn ý kiến',
  },
  essay: {
    icon: 'bi bi-justify-left',
    colorClassName: 'bg-secondary',
    title: 'Trả lời tự do',
  },
}

type IconQuestionProps = {
  type: QuestionType
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  showTitle?: boolean
}
const IconQuestion: FC<IconQuestionProps> = ({
  type,
  className,
  onClick,
  showTitle = false,
}) => {
  return (
    <>
      <div
        className={classNames(
          'rounded-6px text-white d-flex justify-content-center align-items-center fs-18px cursor-pointer',
          questionTypeStyles[type].colorClassName,
          styles.container,
          className
        )}
        onClick={onClick}
      >
        <i className={questionTypeStyles[type].icon} />
      </div>
      {showTitle && (
        <div className="fs-14px fw-medium pt-2">
          {questionTypeStyles[type].title}
        </div>
      )}
    </>
  )
}

export default IconQuestion
