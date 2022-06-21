import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import _ from 'lodash'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, memo, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { EditorProps } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { post } from '../../libs/api'
import { TEditQuestion } from '../../pages/quiz/creator/[id]'
import {
  TAnswer,
  TApiResponse,
  TQuestion,
  TQuestionType,
  TQuiz,
} from '../../types/types'
import { MAPPED_QUESTION_TYPE } from '../../utils/constants'
import {
  getUrl,
  storage,
  storageRef,
  uploadFile,
} from '../../utils/firebaseConfig'
import { getCurrentTrueAnswer } from '../../utils/helper'
import { QuestionType, questionTypeStyles } from '../IconQuestion/IconQuestion'
import MyButton from '../MyButton/MyButton'
import AnswerEditorSection from './AnswerEditorSection/AnswerEditorSection'
import { defaultAnswer, defaultQuestion } from './QuestionCreator.constants'
import QuestionEditorSection from './QuestionEditorSection/QuestionEditorSection'

const Editor: React.ComponentType<EditorProps> = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)
const htmlToDraft =
  typeof window === 'object' && require('html-to-draftjs').default

type QuestionCreatorProps = {
  show: boolean
  onHide: () => void
  setQuiz: React.Dispatch<React.SetStateAction<TQuiz | undefined>>
  quiz: TQuiz | undefined
  isEditQuestion: TEditQuestion
}
const QuestionCreator: FC<QuestionCreatorProps> = ({
  show,
  onHide,
  setQuiz,
  quiz,
  isEditQuestion,
}) => {
  const router = useRouter()
  const quizId = Number(router.query.id)
  const [fillAnswers, setFillAnswers] = useState<string[]>([])
  const [answers, setAnswers] = useState<TAnswer[]>([
    { ...defaultAnswer, orderPosition: 0 },
    // { ...defaultAnswer, orderPosition: 1 },
    // { ...defaultAnswer, orderPosition: 2 },
  ])
  const [newQuestion, setNewQuestion] = useState<TQuestion>(defaultQuestion)
  const type: QuestionType = isEditQuestion.isEdit
    ? MAPPED_QUESTION_TYPE[newQuestion?.type]
    : (router.query?.type?.toString() as QuestionType) || 'single'
  const [isScoreError, setIsScoreError] = useState<boolean>(false)
  const [richTextQuestion, setRichTextQuestion] = useState(
    EditorState.createEmpty()
  )
  const [correctIndexes, setCorrectIndexes] = useState<number[]>([]) // 21ODMUL

  useEffect(() => {
    const handleEditQuestion = () => {
      try {
        if (isEditQuestion.isEdit) {
          const _ques = quiz?.questions.find(
            (question) => question.id === isEditQuestion.questionId
          ) as TQuestion
          const _ans = _ques?.questionAnswers

          setNewQuestion(_ques)
          setAnswers(_ans)

          setRichTextQuestion(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(
                htmlToDraft(_ques?.question).contentBlocks
              )
            )
          )

          if (_ques?.type === '30TEXT') {
            setFillAnswers(_ans?.map((an) => an.answer))
          }

          if (_ques?.type === '21ODMUL') {
            const countCorrect = _ques.questionAnswers.filter(
              (ans) => ans.isCorrect === true
            ).length
            let _correctIndexes = Array<number>(countCorrect).fill(0)
            for (let i = 0; i < _ques.questionAnswers.length; i++) {
              if (_ques.questionAnswers[i].isCorrect) {
                _correctIndexes[_ques.questionAnswers[i].orderPosition] = i
              }
            }
            setCorrectIndexes(_correctIndexes)
          }
        } else {
          setNewQuestion(defaultQuestion)
        }
      } catch (error) {
        console.log('handleEditQuestion - error', error)
      }
    }

    handleEditQuestion()
  }, [isEditQuestion, quiz?.questions])

  const resetStates = () => {
    setAnswers([
      { ...defaultAnswer, orderPosition: 0 },
      // { ...defaultAnswer, orderPosition: 1 },
      // { ...defaultAnswer, orderPosition: 2 },
    ])
    setFillAnswers([])
    setRichTextQuestion(EditorState.createEmpty())
    setCorrectIndexes([])
  }

  const removeAnswerAtIndex = (index: number) => {
    try {
      const cloneAnswers = [...answers]
      cloneAnswers.splice(index, 1)

      if (type === 'single' || type === 'multiple') {
        for (let i = 0; i < cloneAnswers.length; i++) {
          cloneAnswers[i].orderPosition = i
        }
      }

      if (type === 'conjunction') {
        if (answers[index].isCorrect) {
          setCorrectIndexes((prev) => prev.filter((item) => !(item === index)))
        }
      }

      setAnswers(cloneAnswers)
    } catch (error) {
      console.log('removeAnswerAtIndex - error', error)
    }
  }

  const onSaveQuestion = async () => {
    try {
      if (!quiz) return
      if (
        type !== 'fill' &&
        type !== 'essay' &&
        type !== 'poll' &&
        getCurrentTrueAnswer(answers) < 1
      ) {
        alert('Bạn cần có ít nhất 1 câu trả lời là đúng')
        return
      }
      if (isScoreError) {
        alert('Điểm của câu hỏi cần nằm trong khoảng từ 0 đến 100')
        return
      }

      let _newQuestion: TQuestion = {
        ...newQuestion,
        question: draftToHtml(
          convertToRaw(richTextQuestion.getCurrentContent())
        ),
        questionAnswers: answers,
        type: isEditQuestion.isEdit
          ? newQuestion.type
          : (Object.keys(MAPPED_QUESTION_TYPE).find(
              (key) => _.get(MAPPED_QUESTION_TYPE, key) === type
            ) as TQuestionType),
        orderPosition: isEditQuestion.isEdit
          ? newQuestion.orderPosition
          : quiz.questions.length,
      }

      if (type === 'fill') {
        const _fillAnswer: TAnswer[] = fillAnswers.map((value, index) => ({
          answer: value,
          isCorrect: true,
          orderPosition: index,
          media: '',
          type: '10TEXT',
        }))

        _newQuestion['questionAnswers'] = [..._fillAnswer]
      }

      if (type === 'conjunction') {
        _newQuestion['questionAnswers'] = answers.filter(
          (answer) => answer.answer.length > 0
        )
      }

      if (type === 'essay') {
        _newQuestion.questionAnswers = []
      }

      if (type === 'poll') {
        _newQuestion.questionAnswers = _newQuestion.questionAnswers.map(
          (ans) => {
            let _ans = { ...ans }
            _ans.isCorrect = true
            return _ans
          }
        )
      }

      let body = {}
      if (isEditQuestion.isEdit) {
        const _questions = [...quiz.questions]
        for (let i = 0; i < _questions.length; i++) {
          if (_questions[i].id === isEditQuestion.questionId) {
            _questions[i] = { ..._newQuestion, id: isEditQuestion.questionId }
          }
        }
        body = { ...quiz, questions: [..._questions] }
      } else {
        body = { ...quiz, questions: [...quiz.questions, _newQuestion] }
      }

      onHide()

      const res = await post<TApiResponse<TQuiz>>(
        `/api/quizzes/${quizId}`,
        {},
        body,
        true
      )

      setQuiz(res.response)
      setNewQuestion(defaultQuestion)
    } catch (error) {
      console.log('onSaveQuestion - error', error)
    }
  }

  useEffect(() => {
    if (!show) {
      resetStates()
    }
  }, [show])

  const handleUploadImage = async (evt: any) => {
    try {
      evt.preventDefault()
      const data: File = evt.target.files[0]

      const path = `/images/${data.name}`
      const ref = await storageRef(storage, path)
      console.log('=>(QuestionCreator.tsx:241) ref', storage, ref)
      await uploadFile(ref, data)
      const url = await getUrl(ref)

      setNewQuestion((prev) => ({
        ...prev,
        media: url,
      }))
    } catch (error) {
      console.log('handleUploadImage - error', error)
    }
  }

  const handleScoreInputChange = (e: any) => {
    const value = Number(e?.target?.value)
    const isValid = value >= 0 && value <= 100
    setIsScoreError(!isValid)
    setNewQuestion((prev) => ({
      ...prev,
      score: Number(e?.target?.value),
    }))
  }

  return (
    <Modal
      show={show}
      onHide={() => onHide()}
      centered
      contentClassName="rounded-10px border-0 shadow overflow-hidden"
      backdrop="static"
      keyboard={false}
      size="xl"
      fullscreen="lg-down"
    >
      <Modal.Body className="p-0">
        <QuestionEditorSection
          type={type}
          questionTypeStyles={questionTypeStyles}
          handleUploadImage={handleUploadImage}
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          isScoreError={isScoreError}
          handleScoreInputChange={handleScoreInputChange}
          setRichTextQuestion={setRichTextQuestion}
          richTextQuestion={richTextQuestion}
          Editor={Editor}
        />

        <AnswerEditorSection
          type={type}
          answers={answers}
          setAnswers={setAnswers}
          removeAnswerAtIndex={removeAnswerAtIndex}
          setNewQuestion={setNewQuestion}
          newQuestion={newQuestion}
          fillAnswers={fillAnswers}
          setFillAnswers={setFillAnswers}
          setCorrectIndexes={setCorrectIndexes}
          correctIndexes={correctIndexes}
        />
      </Modal.Body>

      <Modal.Footer>
        <MyButton
          className="bg-danger shadow-none border-danger text-white flex-fill"
          onClick={() => onHide()}
        >
          Huỷ
        </MyButton>
        <MyButton className="text-white flex-fill" onClick={() => onSaveQuestion()}>
          Lưu
        </MyButton>
      </Modal.Footer>
    </Modal>
  )
}

export default memo(QuestionCreator)
