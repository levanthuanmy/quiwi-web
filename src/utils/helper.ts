import { TAnswer, TQuestion } from '../types/types'

export const JsonParse = (input: string | null) => {
  try {
    if (!input) return {}
    return JSON.parse(input)
  } catch (error) {
    console.log('JsonParse - error', error)
    return {}
  }
}

export const getCurrentTrueAnswer = (answers: TAnswer[]): number => {
  let numTrueAnswer = 0

  for (let answer of answers) {
    if (answer.isCorrect) {
      numTrueAnswer++
    }
  }
  return numTrueAnswer
}

export const indexingQuestionsOrderPosition = (
  questions: TQuestion[]
) => {
  const len = questions.length
  let _q = [...questions]
  for (let i = 0; i < len; i++) {
    _q[i].orderPosition = i
  }

  return _q
}
