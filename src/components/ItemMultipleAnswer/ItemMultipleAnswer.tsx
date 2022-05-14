import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC, memo, useEffect, useState } from 'react'
import { Form, Image } from 'react-bootstrap'
import { TAnswer } from '../../types/types'
import {
  getUrl,
  storage,
  storageRef,
  uploadFile,
} from '../../utils/firebaseConfig'
import { getCurrentTrueAnswer } from '../../utils/helper'
import { QuestionType } from '../IconQuestion/IconQuestion'
import QuestionActionButton from '../QuestionActionButton/QuestionActionButton'

type ItemMultipleAnswerProps = {
  answers: TAnswer[]
  setAnswers: React.Dispatch<React.SetStateAction<TAnswer[]>>
  index: number
  onRemove: () => void
}
const ItemMultipleAnswer: FC<ItemMultipleAnswerProps> = ({
  answers,
  setAnswers,
  index,
  onRemove,
}) => {
  const router = useRouter()
  const type: QuestionType =
    (router.query?.type?.toString() as QuestionType) || 'single'
  const [isCorrectAns, setIsCorrectAns] = useState(answers[index].isCorrect)

  useEffect(() => {
    setIsCorrectAns(answers[index].isCorrect)
  }, [answers])

  const handleUploadImage = async (evt: any) => {
    try {
      const data: File = evt.target.files[0]

      const path = `/images/${data.name}`
      const ref = storageRef(storage, path)
      await uploadFile(ref, data)
      const url = await getUrl(ref)

      const newAnswer = { ...answers[index], media: url }

      editAnswer(newAnswer)
    } catch (error) {
      console.log('handleUploadImage - error', error)
    }
  }

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newAnswer = { ...answers[index], answer: e.target.value }

      editAnswer(newAnswer)
    } catch (error) {
      console.log('handleAnswerChange - error', error)
    }
  }

  const editAnswer = (newAnswer: TAnswer) => {
    try {
      const cloneAnswers = [...answers]

      cloneAnswers[index] = { ...newAnswer }
      setAnswers(cloneAnswers)
    } catch (error) {
      console.log('editAnswer - error', error)
    }
  }

  const validateMarkingTrueAnswer = (mark: boolean) => {
    if (mark) {
      const numTrueAnswer = getCurrentTrueAnswer(answers)
      if (type === 'single' && numTrueAnswer === 0) {
        return true
      }
      if (type === 'multiple') {
        return true
      }
    }
    if (!mark) {
      return true
    }
    return false
  }

  const handleMarkTrueAnswer = () => {
    try {
      if (validateMarkingTrueAnswer(!isCorrectAns)) {
        const newAnswer = { ...answers[index], isCorrect: !isCorrectAns }
        setIsCorrectAns(!isCorrectAns)
        editAnswer(newAnswer)
      } else {
        alert('Bạn chỉ có thể chọn cùng lúc 1 câu trả lời đúng')
      }
    } catch (error) {
      console.log('handleMarkTrueAnswer - error', error)
    }
  }

  return (
    <div className="rounded-10px border bg-secondary bg-opacity-10 overflow-hidden h-100">
      <div className="d-flex p-12px">
        <QuestionActionButton
          iconClassName="bi bi-check-lg"
          className={classNames('me-2', {
            'bg-primary text-white': isCorrectAns,
            'bg-white text-black': !isCorrectAns,
          })}
          onClick={handleMarkTrueAnswer}
        />
        <div className="position-relative">
          <input
            type="file"
            onChange={handleUploadImage}
            onDropCapture={handleUploadImage}
            className="position-absolute top-0 w-100 h-100 opacity-0 cursor-pointer"
            accept="image/png, image/jpeg, image/jpg"
            style={{ left: 0 }}
          />
          <QuestionActionButton
            iconClassName="bi bi-image"
            className="me-2 bg-white"
          />
        </div>
        <QuestionActionButton
          iconClassName="bi bi-trash"
          className="me-2 bg-danger text-white"
          onClick={onRemove}
        />
      </div>
      <Form.Control
        as="textarea"
        placeholder="Nhập câu trả lời của bạn ở đây..."
        defaultValue={answers[index].answer}
        style={{
          height: answers[index]?.media?.length ? 100 : 280,
          resize: 'none',
        }}
        onChange={handleAnswerChange}
        className="shadow-none border-0 rounded-0 bg-transparent"
      />
      {answers[index]?.media?.length ? (
        <Image
          src={answers[index].media}
          width="100%"
          height="180"
          className="object-fit-cover"
          alt=""
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default memo(ItemMultipleAnswer)
