import { GameManager } from '../useGameSession/useGameSession'
import { TSocketType } from '../useSocket/socketManager'

type TExamDeadline = {
  duration: number
  timeStart: number
  timeEnd: number
}
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

  protected _examDeadline: TExamDeadline | null = null
  get examDeadline(): TExamDeadline | null {
    return this._examDeadline
  }

  set examDeadline(value: TExamDeadline | null) {
    this._examDeadline = value
    this.writeGSLS()
  }

  override writeGSLS() {
    super.writeGSLS()
    localStorage.setItem(
      this.lsExamDeadline,
      JSON.stringify(this._examDeadline)
    )
  }

  override readGSLS() {
    super.readGSLS()
    const examDeadline = localStorage.getItem(this.lsExamDeadline)
    if (examDeadline) {
      this._examDeadline = JSON.parse(examDeadline)
    }
  }

  override connectGameSocket() {
    super.connectGameSocket()
    if (!this.gameSocket || this.gameSocket?.disconnected) {
      this.gameSocket?.onAny((event, data) => {
        console.log('🌎🌎 Event:', event)
        console.log('🌎🌎 Data:', data)
        if (event === 'game-started' && data.deadline) {
          this.examDeadline = data.deadline
        }
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
