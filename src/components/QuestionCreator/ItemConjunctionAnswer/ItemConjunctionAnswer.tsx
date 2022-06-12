import classNames from 'classnames'
import React, {Dispatch, FC, memo, SetStateAction, useMemo} from 'react'
import {Form} from 'react-bootstrap'
import {TAnswer} from '../../../types/types'
import QuestionActionButton from '../../QuestionActionButton/QuestionActionButton'

const ItemConjunctionAnswer: FC<{
  correctIndexes: number[]
  answer: TAnswer
  setCorrectIndexes: Dispatch<SetStateAction<number[]>>
  currentIndex: number
  setConjunctionAnswers: Dispatch<SetStateAction<TAnswer[]>>
  onRemove: Function
  couldDelete: boolean
}> = ({
        correctIndexes,
        setCorrectIndexes,
        currentIndex,
        setConjunctionAnswers,
        answer,
        onRemove,
        couldDelete
      }) => {

  return (
    <div className="d-flex rounded-10px border bg-secondary bg-opacity-10 overflow-hidden h-100">
      <Form.Control
        as="textarea"
        placeholder="Nhập câu trả lời..."
        key={answer.answer}
        defaultValue={answer.answer}
        style={{
          height: 60,
          resize: 'none',
        }}
        onChange={(e) => (answer.answer = e.target.value)}
        className="shadow-none border-0 rounded-0 bg-transparent"
      />
      {couldDelete ?
        <div className="d-flex p-12px">
          <QuestionActionButton
            iconClassName="bi bi-trash"
            className="me-2 bg-danger text-white"
            onClick={() => onRemove()}
          />
        </div>
        :
        <div className="d-flex p-12px">
          <QuestionActionButton
            iconClassName="bi bi-check-lg"
            className="me-2 bg-success text-white"
          />
        </div>
      }
    </div>
  )
}

export default memo(ItemConjunctionAnswer)
