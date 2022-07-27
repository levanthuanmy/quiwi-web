import { GameManager } from '../useGameSession/useGameSession'
import { TSocketType } from '../useSocket/socketManager'
import {TExamDeadline} from "../../types/types";


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

  // override onListenCurrentQuestion(data: any) {
  //
  // }

  override clearGameSession() {
    super.clearGameSession()
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
