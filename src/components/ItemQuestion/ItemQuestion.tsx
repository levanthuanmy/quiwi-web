import cn from 'classnames'
import _ from 'lodash'
import React, { FC, memo, useRef, useState } from 'react'
import { Accordion, Col, Image, Row, useAccordionButton } from 'react-bootstrap'
import { useDrag, useDrop } from 'react-dnd'
import useScreenSize from '../../hooks/useScreenSize/useScreenSize'
import { TQuestion } from '../../types/types'
import {
  MAPPED_QUESTION_MATCHER,
  MAPPED_QUESTION_TYPE,
  QUESTION_TYPE_MAPPING_TO_TEXT,
} from '../../utils/constants'
import IconQuestion from '../IconQuestion/IconQuestion'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

type DragItem = {
  index: number
  id: string
  type: string
}

type ItemQuestionProps = {
  question: TQuestion
  onRemove?: () => void
  onEditQuestion?: () => void
  showActionBtn?: boolean
  index?: number
  move?: (dragIndex: number, hoverIndex: number) => void
}

const ItemQuestion: FC<ItemQuestionProps> = ({
  question,
  onRemove,
  onEditQuestion,
  showActionBtn = true,
  index,
  move,
}) => {
  const ref = useRef<any>(null)

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: any }>({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current || !index || !move) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      move(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [dragVal, drag] = useDrag({
    type: 'card',
    item: () => {
      return { index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <Accordion
      ref={ref}
      as="div"
      id="itemQuestion"
      // defaultActiveKey="0"
      className="mb-3"
      data-handler-id={handlerId}
    >
      <Accordion.Item eventKey="0" className="overflow-hidden">
        <CustomToggle
          eventKey="0"
          question={question}
          onRemove={onRemove}
          onEditQuestion={onEditQuestion}
          showActionBtn={showActionBtn}
        />
        <Accordion.Body className="p-3">
          <div className="fw-medium">
            <div className="">
              Câu trả lời{' '}
              {question.type === '30TEXT' && (
                <span className="text-uppercase">
                  {_.get(MAPPED_QUESTION_MATCHER, `${question?.matcher}`)}
                </span>
              )}
            </div>
            <Row>
              {question.questionAnswers.map(
                (answer, key) =>
                  answer.type !== '21PLHDR' && (
                    <Col key={key} xs="6" className="d-flex align-items-center">
                      <div
                        className={cn('bi me-2', {
                          'text-danger bi-x-circle-fill': !answer.isCorrect,
                          'text-primary bi-check-circle-fill': answer.isCorrect,
                        })}
                      />
                      <div>
                        <div>{answer.answer}</div>
                        {answer.media?.length ? (
                          <Image
                            src={answer.media}
                            alt=""
                            width="100%"
                            height="160"
                            className="object-fit-cover rounded border mt-2"
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </Col>
                  )
              )}
            </Row>
          </div>
        </Accordion.Body>
        <div className="bg-secondary p-12px bg-opacity-10 d-flex gap-2">
          <QuestionActionButton
            iconClassName="bi bi-clock"
            className="bg-white"
            title={`${question.duration.toString()} giây`}
          />
          <QuestionActionButton
            iconClassName="bi bi-bullseye"
            className="bg-white"
            title={`${question.score} điểm`}
          />
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default memo(ItemQuestion)

function CustomToggle({
  eventKey,
  question,
  onRemove,
  onEditQuestion,
  showActionBtn,
}: {
  eventKey: string
  question: TQuestion
  onRemove?: () => void
  onEditQuestion?: () => void
  showActionBtn: boolean
}) {
  const [isToggle, setIsToggle] = useState<boolean>(true)
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    setIsToggle((prev) => !prev)
  )

  const { isMobile } = useScreenSize()

  return (
    <>
      <Row className="w-100 m-0 bg-secondary p-12px bg-opacity-10 border-bottom">
        <Col className="d-flex align-items-center ps-0">
          <IconQuestion
            type={MAPPED_QUESTION_TYPE[question.type]}
            className="me-3"
          />
          <div className="fw-medium">Câu {question.orderPosition + 1} {!isMobile && " - " + QUESTION_TYPE_MAPPING_TO_TEXT[question?.type]}</div>
        </Col>
        <Col className="d-flex align-items-center justify-content-end pe-0 gap-2">
          {showActionBtn && (
            <>
              <QuestionActionButton
                iconClassName="bi bi-trash"
                className="bg-danger text-white border-0"
                onClick={onRemove}
              />
              <QuestionActionButton
                iconClassName="bi bi-pencil"
                className="bg-white"
                onClick={onEditQuestion}
              />
            </>
          )}
          <QuestionActionButton
            iconClassName={cn('bi fs-16px', {
              'bi-chevron-down': !isToggle,
              'bi-chevron-up': isToggle,
            })}
            className="bg-primary text-white fs-14px"
            onClick={decoratedOnClick}
            title={
              !isMobile
                ? isToggle
                  ? 'Hiện câu trả lời'
                  : 'Ẩn câu trả lời'
                : undefined
            }
          />
        </Col>
      </Row>

      <div className="fw-medium p-3 border-bottom">
        <div className="fw-medium">Câu hỏi</div>
        <div dangerouslySetInnerHTML={{ __html: question.question }} />
        {question.type === '21ODMUL' && (
          <div className={'d-flex gap-1 justify-content-center flex-wrap'}>
            {question.questionAnswers
              .filter((answer) => answer.isCorrect)
              .sort((a, b) => {
                return a.orderPosition - b.orderPosition
              })
              .map((answer, key) => (
                <span
                  key={key}
                  className={cn({ 'fw-bolder': answer.type === '10TEXT' })}
                  style={{
                    color: answer.type === '10TEXT' ? '#009883' : 'black',
                  }}
                >
                  {answer.answer}
                </span>
              ))}
          </div>
        )}
        {question.media?.length ? (
          <Image
            src={question.media}
            alt=""
            width="100%"
            height="160"
            className="object-fit-cover rounded border mt-2"
          />
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
