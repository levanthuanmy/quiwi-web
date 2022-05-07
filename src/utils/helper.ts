import { TAnswerRequest } from '../types/types'

export const JsonParse = (input: string | null) => {
  try {
    if (!input) return {}
    return JSON.parse(input)
  } catch (error) {
    console.log('JsonParse - error', error)
    return {}
  }
}

export const getCurrentTrueAnswer = (answers: TAnswerRequest[]): number => {
  let numTrueAnswer = 0

  for (let answer of answers) {
    if (answer.isCorrect) {
      numTrueAnswer++
    }
  }
  return numTrueAnswer
}
