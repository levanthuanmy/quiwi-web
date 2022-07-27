import { GameManager } from '../useGameSession/useGameSession'
import { TSocketType } from '../useSocket/socketManager'

export class PracticeGameManager extends GameManager {
  override get key(): string {
    return 'PRACTICE-'
  }
  override get socketKey(): TSocketType {
    return 'COMMUNITY-GAMES'
  }

  // override connectGameSocket() {
  //   super.connectGameSocket()
  //   if (!this.gameSocket || this.gameSocket?.disconnected) {
  //     this.gameSocket?.onAny((event, data) => {
  //
  //     })
  //   }
  // }
}

class PracticeGameManagerSingleton extends PracticeGameManager {
  private static _instance?: PracticeGameManagerSingleton

  constructor() {
    if (PracticeGameManagerSingleton._instance)
      throw new Error('Use PracticeGameManagerSingleton.instance instead of new.')
    super()
    PracticeGameManagerSingleton._instance = this
  }

  static get instance() {
    return (
      PracticeGameManagerSingleton._instance ??
      (PracticeGameManagerSingleton._instance = new PracticeGameManagerSingleton())
    )
  }
}

export const usePracticeGameSession = () => PracticeGameManagerSingleton.instance
