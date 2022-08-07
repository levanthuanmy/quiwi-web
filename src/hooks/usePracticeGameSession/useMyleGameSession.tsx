import { GameManager } from '../useGameSession/useGameSession'
import { TSocketType } from '../useSocket/socketManager'
import {TExamDeadline, TQuestion} from "../../types/types";
import {UserAnswer} from "../../components/CommunityGameComponents/ExamComponents/ExamAnswerBoard/ExamAnswerBoard";


export class MyLeGameManager extends GameManager {
  override get key(): string {
    return 'MYLE-'
  }
  override get socketKey(): TSocketType {
    return 'COMMUNITY-GAMES'
  }

  get lsExamDeadline(): string {
    return this.key + 'deadline'
  }

  override onListenLoading(data: any) {
    if (data.loading == 4) {
      if (this.gameSession?.quiz.questions[0])
        this.currentQuestion = this.gameSession.quiz.questions[0]
    }
  }

  getPlayerAnswerArray():UserAnswer[] {
    let submitAnswers:UserAnswer[] = []
    if (this.gameSession)
      for (let i = 0; i < this.gameSession?.quiz.questions.length; i++) {
        const answerToSubmit = {
          answerIds: [] as any[],
          answer: '',
        }
        const answer = this.playerAnswers[i]
        if (answer instanceof Set) {
          answerToSubmit.answerIds = Array.from(answer)
        } else if (answer instanceof Array) {
          answerToSubmit.answerIds = answer
        } else if (typeof answer === 'string') {
          answerToSubmit.answer = answer
        } else {
          continue
        }
        submitAnswers.push(answerToSubmit)
      }

    return submitAnswers;
  }

  playerAnswers: Record<number, any> = {}

  initDefaultAnswer (questions: TQuestion[]) {
    for (const question of questions) {
      switch (question.type) {
        case '10SG':
        case '20MUL':
        case '21ODMUL':
        case '22POLL':
          this.playerAnswers[question.orderPosition] = []
          break
        case '30TEXT':
        case '31ESSAY':
          this.playerAnswers[question.orderPosition] = ""
          break
      }
    }
  }

  override clearGameSession() {
    super.clearGameSession()
    this.playerAnswers = {}
  }

  override connectGameSocket() {
    super.connectGameSocket()
    if (!this.gameSocket || this.gameSocket?.disconnected) {
      this.gameSocket?.onAny((event, data) => {

      })
    }
  }


}

class MyLeGameManagerSingleton extends MyLeGameManager {
  private static _instance?: MyLeGameManagerSingleton

  constructor() {
    if (MyLeGameManagerSingleton._instance)
      throw new Error('Use MyLeGameManagerSingleton.instance instead of new.')
    super()
    MyLeGameManagerSingleton._instance = this
  }

  static get instance() {
    return (
      MyLeGameManagerSingleton._instance ??
      (MyLeGameManagerSingleton._instance = new MyLeGameManagerSingleton())
    )
  }
}

export const useMyleGameSession = () => MyLeGameManagerSingleton.instance
