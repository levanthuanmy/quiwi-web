import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './IconQuestion.module.css'

type QuestionType = 'multiple' | 'survey' | 'fill' | 'essay'
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
  const typeStyles: Record<
    QuestionType,
    { icon: string; colorClassName: string; title: string }
  > = {
    multiple: {
      icon: 'bi bi-check2-circle',
      colorClassName: 'bg-primary',
      title: 'Nhiều lựa chọn',
    },
    survey: {
      icon: 'bi bi-bar-chart',
      colorClassName: 'bg-info',
      title: 'Thăm dò ý kiến',
    },
    fill: {
      icon: 'bi bi-pencil-square',
      colorClassName: 'bg-warning',
      title: 'Điền chỗ trống',
    },
    essay: {
      icon: 'bi bi-justify-left',
      colorClassName: 'bg-secondary',
      title: 'Kết thúc mở',
    },
  }

  return (
    <>
      <div
        className={classNames(
          'rounded-6px text-white d-flex justify-content-center align-items-center fs-18px cursor-pointer',
          typeStyles[type].colorClassName,
          styles.container,
          className
        )}
        onClick={onClick}
      >
        <i className={typeStyles[type].icon} />
      </div>
      {showTitle && (
        <div className="fs-14px fw-medium pt-2">{typeStyles[type].title}</div>
      )}
    </>
  )
}

export default IconQuestion
