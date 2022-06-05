import { TAnswer, TQuestion } from '../../types/types'


export const defaultAnswer: TAnswer = {
  answer: '',
  isCorrect: false,
  orderPosition: 0,
  media: '',
  type: '20SELECTION',
}

export const defaultQuestion: TQuestion = {
  type: '10SG',
  difficulty: 1,
  duration: 30,
  orderPosition: 0,
  question: '',
  questionAnswers: [
    { ...defaultAnswer, orderPosition: 0 },
    { ...defaultAnswer, orderPosition: 1 },
    { ...defaultAnswer, orderPosition: 2 },
  ],
  media: '',
  score: 100,
  matcher: '10EXC',
}
