import classNames from 'classnames'
import React, { Dispatch, FC, memo, SetStateAction, useMemo } from 'react'
import { Form } from 'react-bootstrap'
import { TAnswer } from '../../../types/types'
import QuestionActionButton from '../../QuestionActionButton/QuestionActionButton'

const ItemConjunctionAnswer: FC<{
  correctIndexes: number[]
  conjunctionAnswers: TAnswer[]
  setCorrectIndexes: Dispatch<SetStateAction<number[]>>
  currentIndex: number
  setConjunctionAnswers: Dispatch<SetStateAction<TAnswer[]>>
}> = ({
  correctIndexes,
  setCorrectIndexes,
  currentIndex,
  setConjunctionAnswers,
  conjunctionAnswers,
}) => {
  const currentCorrectIndex = useMemo(() => {
    if (conjunctionAnswers[currentIndex].isCorrect) {
      return correctIndexes.findIndex((item) => item === currentIndex)
    }
    return -1
  }, [conjunctionAnswers, correctIndexes, currentIndex])

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newAnswer: TAnswer = {
        ...conjunctionAnswers[currentIndex],
        answer: e.target.value,
        type: '10TEXT',
      }

      editAnswer(newAnswer)
    } catch (error) {
      console.log('handleAnswerChange - error', error)
    }
  }

  const editAnswer = (newAnswer: TAnswer) => {
    try {
      const cloneAnswers = [...conjunctionAnswers]

      cloneAnswers[currentIndex] = { ...newAnswer }
      setConjunctionAnswers(cloneAnswers)
    } catch (error) {
      console.log('editAnswer - error', error)
    }
  }

  return (
    <div className="rounded-10px border bg-secondary bg-opacity-10 overflow-hidden h-100">
      <div className="d-flex p-12px">
        <QuestionActionButton
          iconClassName="bi bi-check-lg"
          className={classNames('me-2', {
            'bg-primary text-white': currentCorrectIndex !== -1,
            'bg-white text-black': currentCorrectIndex === -1,
          })}
          title={
            currentCorrectIndex !== -1
              ? (currentCorrectIndex + 1).toString()
              : undefined
          }
          onClick={() => {
            if (conjunctionAnswers[currentIndex].isCorrect === false) {
              setConjunctionAnswers((prev) => {
                prev[currentIndex].isCorrect = true
                return prev
              })
              setCorrectIndexes((prev) => [...prev, currentIndex])
            } else {
              setConjunctionAnswers((prev) => {
                prev[currentIndex].isCorrect = false
                return prev
              })
              setCorrectIndexes((prev) =>
                prev.filter((item) => !(item === currentIndex))
              )
            }
          }}
        />
        <QuestionActionButton
          iconClassName="bi bi-trash"
          className="me-2 bg-danger text-white"
          // onClick={onRemove}
        />
      </div>
      <Form.Control
        as="textarea"
        placeholder="Nhập câu trả lời..."
        defaultValue={conjunctionAnswers[currentIndex].answer}
        style={{
          height: 60,
          resize: 'none',
        }}
        onChange={handleAnswerChange}
        className="shadow-none border-0 rounded-0 bg-transparent"
      />
    </div>
  )
}

export default memo(ItemConjunctionAnswer)
