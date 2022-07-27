import {Socket} from 'socket.io-client'
import {MessageProps} from '../../components/GameComponents/ChatWindow/Message'
import {
  TAnswerSubmit, TDetailPlayer, TExamDeadline,
  TGameModeEnum,
  TGameRoundStatistic,
  TGameStatus,
  TPlayer,
  TQuestion,
  TQuiz,
  TUser,
} from '../../types/types'
import {JsonParse} from '../../utils/helper'
import {SocketManager, TSocketType} from '../useSocket/socketManager'
import {useSound} from '../useSound/useSound'
import {useUser} from '../useUser/useUser'

export type TGameLobby = {
  nickName: string
  gameMode: {
    currentQuestionIndex: number
  }
  mode: TGameModeEnum
  host: TUser
  hostId: number
  invitationCode: string
  players: TPlayer[]
  quiz: TQuiz
  quizId: number
  status: TGameStatus
  chats: MessageProps[]
  gameRoundStatistics: TGameRoundStatistic[]
}

export class GameManager {
  get key(): string {
    return 'GAME-'
  }

  get socketKey(): TSocketType {
    return 'GAMES'
  }

  get lsKey(): string {
    return this.key + 'game-session'
  }

  get lsQuestionKey(): string {
    return this.key + 'current-question'
  }

  get lsSubmitedAnswerKey(): string {
    return this.key + 'recent-submit-question'
  }

  get lsDeadline(): string {
    return this.key + 'deadline'
  }

  constructor() {
    this.readGSLS()
  }

  protected _gameSession: TGameLobby | null = null
  get gameSession(): TGameLobby | null {
    return this._gameSession
  }

  set gameSession(value: TGameLobby | null) {
    if (
      (this._gameSession && this._gameSession != value) ||
      !this._gameSession
    ) {
      this._gameSession = value
      this.writeGSLS()
    }
  }

  get players(): TPlayer[] {
    if (this._gameSession) {
      return this._gameSession.players
    }
    return []
  }

  set players(value: TPlayer[]) {
    if (this._gameSession) {
      this._gameSession.players = value
      this.writeGSLS()
    }
  }

  //

  updateGameSession(updateBlock: (gameSession: TGameLobby) => void) {
    if (this._gameSession) updateBlock(this._gameSession)
    this.writeGSLS()
  }

  //

  protected _currentQuestion: TQuestion | null = null
  get currentQuestion(): TQuestion | null {
    return this._currentQuestion
  }

  set currentQuestion(value: TQuestion | null) {
    this._currentQuestion = value
    this.writeGSLS()
  }

  //
  protected _submittedAnswer: TAnswerSubmit | null = null
  get submittedAnswer(): TAnswerSubmit | null {
    return this._submittedAnswer
  }

  set submittedAnswer(value: TAnswerSubmit | null) {
    this._submittedAnswer = value
    this.writeGSLS()
  }


  protected _deadline: TExamDeadline | null = null
  get deadline(): TExamDeadline | null {
    return this._deadline
  }

  set deadline(value: TExamDeadline | null) {
    this._deadline = value
    this.writeGSLS()
  }

  nickName: string = 'Ẩn danh'

  sk = SocketManager()
  soundManager = useSound()
  user = useUser()
  player: TDetailPlayer | null = null

  get isHost(): boolean {
    if (this.gameSession) {
      return this.user?.id == this.gameSession.hostId
    }
    return false
  }

  get gameSocket(): Socket | null {
    return this.sk.socketOf(this.socketKey)
  }

  set gameSocket(value: Socket | null) {
  }

  protected readGSLS() {
    if (typeof window !== 'undefined') {
      const ls = window.localStorage.getItem(this.lsKey)
      if (ls) {
        this._gameSession = JsonParse(ls) as TGameLobby
        if (this._gameSession) this.nickName = this._gameSession.nickName
      }
      const currentQuestionLs = window.localStorage.getItem(this.lsQuestionKey)
      if (currentQuestionLs)
        this._currentQuestion = JsonParse(currentQuestionLs) as TQuestion

      const submittedAnswerLs = window.localStorage.getItem(
        this.lsSubmitedAnswerKey
      )
      if (submittedAnswerLs)
        this._submittedAnswer = JsonParse(submittedAnswerLs) as TAnswerSubmit

      const lsdeadline = window.localStorage.getItem(this.lsDeadline)
      if (lsdeadline) {
        this._deadline = JSON.parse(lsdeadline) as TExamDeadline
      }
    }
  }

  protected writeGSLS() {
    if (typeof window !== 'undefined') {
      if (this.gameSession) {
        this.gameSession.nickName = this.nickName
      }
      window.localStorage.setItem(this.lsKey, JSON.stringify(this._gameSession))
      window.localStorage.setItem(
        this.lsQuestionKey,
        JSON.stringify(this._currentQuestion)
      )
      window.localStorage.setItem(
        this.lsSubmitedAnswerKey,
        JSON.stringify(this._submittedAnswer)
      )

      window.localStorage.setItem(
        this.lsDeadline,
        JSON.stringify(this._deadline)
      )
    }
  }

  onListenLoading(data: any) {
    if (data.question?.question)
      this.currentQuestion = data.question?.question
    if (data.game?.question)
      this.currentQuestion = data.game.question
  }

  onListenCurrentQuestion(data: any) {
    this.currentQuestion = data
  }

  connectGameSocket() {
    if (!this.gameSocket || this.gameSocket?.disconnected) {
      this.sk.connect(this.socketKey)
      this.soundManager?.setGameSoundOn(true)
      this.gameSocket?.offAny()
      this.gameSocket?.onAny((event, data) => {
        console.log(this.key, '🌎🌎 Event:', event)
        console.log(this.key, '🌎🌎 Data:', data)

        if (data.gameLobby) {
          this.gameSession = data.gameLobby
        }

        if (event === 'loading') {
          this.onListenLoading(data)
        } else if (data.question as TQuestion) {
          this.currentQuestion = data.question
        } else if (data.game?.question as TQuestion) {
          this.currentQuestion = data.game.question
        }

      })
    } else {
      console.log(
        '=>(useGameSession.tsx:106) connect Failed',
        this,
        this.gameSession,
        this.gameSocket
      )
    }
  }

  disconnectGameSocket() {
    if (this.gameSocket?.connected) {
      this.sk.disconnect(this.socketKey)
    }
  }

  gameSkEmit(ev: string, msg: any) {
    console.log('📨📨 Event:', ev)
    console.log('📨📨 Message:', msg)
    this.gameSocket?.emit(ev, msg)
  }

  gameSkOn(ev: string, listener: (...args: any[]) => void) {
    this.gameSocket?.off(ev)
    this.gameSocket?.on(ev, listener)
  }

  //
  gameSkOnce(ev: string, listener: (...args: any[]) => void) {
    this.gameSocket?.off(ev)
    this.gameSocket?.once(ev, listener)
  }

  clearGameSession() {
    if (this.gameSession) {
      console.log('🎯️ ️️GameSession :: Clear')
      this.soundManager?.setGameSoundOn(false)
      this.gameSession = null
      this.currentQuestion = null
      this.deadline = null
      this.submittedAnswer = null
    }
  }

  getQuestionWithID(qid: number): TQuestion | null {
    return this.gameSession?.quiz?.questions[qid] || null
  }

  submitAnswer(answer: any) {
    if (!this.gameSession) return

    let answerToSubmit: TAnswerSubmit = {
      invitationCode: this.gameSession.invitationCode,
      nickname: this.nickName,
      answerIds: [] as any[],
      answer: '',
    }

    if (answer instanceof Set) {
      console.log('=>(AnswerBoard.tsx:174) submit set "', answer, '"')
      answerToSubmit.answerIds = Array.from(answer)
    } else if (answer instanceof Array) {
      console.log('=>(AnswerBoard.tsx:174) submit array "', answer, '"')
      answerToSubmit.answerIds = answer
    } else if (typeof answer === 'string') {
      console.log('=>(AnswerBoard.tsx:174) submit text "', answer, '"')
      answerToSubmit.answer = answer
    } else {
      console.log('=>(AnswerBoard.tsx:191) not supported "', answer, '"')
      return
    }

    if (answerToSubmit.answer || answerToSubmit.answerIds) {
      this.gameSkEmit('submit-answer', answerToSubmit)
      answerToSubmit.questionId = this.currentQuestion?.orderPosition
      this.submittedAnswer = answerToSubmit
    }
  }
}

class GameManagerSingleton extends GameManager {
  private static _instance?: GameManagerSingleton

  constructor() {
    if (GameManagerSingleton._instance)
      throw new Error('Use GameManagerSingleton.instance instead of new.')
    super()
    GameManagerSingleton._instance = this
  }

  static get instance() {
    return (
      GameManagerSingleton._instance ??
      (GameManagerSingleton._instance = new GameManagerSingleton())
    )
  }
}

export const useGameSession = () => GameManagerSingleton.instance
