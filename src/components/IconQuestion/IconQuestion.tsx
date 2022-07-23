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
  { icon: string; colorClassName: string; title: string; description: string }
> = {
  single: {
    icon: 'bi bi-check2',
    colorClassName: 'bg-primary',
    title: 'Một đáp án đúng',
    description: 'Loại câu hỏi chọn một đáp án đúng chỉ hỗ trợ chọn duy nhất một đáp án đúng'
  },
  multiple: {
    icon: 'bi bi-check2-all',
    colorClassName: 'bg-info',
    title: 'Nhiều đáp án đúng',
    description: `Loại câu hỏi chọn nhiều đáp án đúng cho phép 
    tạo nhiều đáp án đúng. Người chơi phải chọn đúng tất cả thì 
    mới được cho là đúng`
  },
  fill: {
    icon: 'bi bi-pencil-square',
    colorClassName: 'bg-warning',
    title: 'Điền vào chỗ trống',
    description: `Loại câu hỏi điền vào chỗ trống cho phép tạo 
    nhiều đáp án đúng. Người chơi chỉ cần điền đúng một trong 
    các đáp án sẽ được cho là đúng`
  },
  conjunction: {
    icon: 'bi bi-reception-1',
    colorClassName: 'bg-success',
    title: 'Nối từ',
    description: `Loại câu hỏi nối từ, các đáp án sẽ được tách 
    câu theo từng từ, người chơi cần nối các từ để tạo thành một 
    câu, được cho là đúng khi người chơi tạo thành câu đúng hoàn 
    chỉnh`
  },
  poll: {
    icon: 'bi bi-file-earmark-bar-graph',
    colorClassName: 'bg-danger',
    title: 'Bình chọn ý kiến',
    description: `Loại câu hỏi bình chọn không có đáp án đúng, 
    người chơi sẽ chọn và chủ phòng sẽ xem được số lượng câu trả 
    lời của từng đáp án được chọn`
  },
  essay: {
    icon: 'bi bi-justify-left',
    colorClassName: 'bg-secondary',
    title: 'Trả lời tự do',
    description: `Loại câu trả lời tự do không có đáp án đúng, 
    cho phép người chơi nhập tự do các câu trả lời, chủ phòng 
    sẽ xem được các đáp án được trả lời`
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
