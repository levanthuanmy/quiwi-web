import {Socket} from "socket.io-client";
import {
  TAnswerSubmit,
  TGameModeEnum,
  TGameRoundStatistic,
  TGameStatus,
  TPlayer,
  TQuestion,
  TQuiz,
  TUser
} from '../../types/types'
import {SocketManager} from '../useSocket/socketManager'
import {useSound} from "../useSound/useSound";
import {useUser} from "../useUser/useUser";
import {JsonParse} from "../../utils/helper";
import {MessageProps} from "../../components/GameComponents/ChatWindow/Message";

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
    return "GAME-";
  }

  get lsKey(): string {
    return this.key + "game-session";
  }

  get lsQuestionKey(): string {
    return this.key + "current-question";
  }

  get lsSubmitedAnswerKey(): string {
    return this.key + "recent-submit-question";
  }

  constructor() {
    this.readGSLS()
  }

  protected _gameSession: TGameLobby | null = null;
  get gameSession(): TGameLobby | null {
    return this._gameSession;
  }

  set gameSession(value: TGameLobby | null) {
    if ((this._gameSession && this._gameSession != value) || !this._gameSession) {
      this._gameSession = value;
      this.writeGSLS()
    }
  }

  get players(): TPlayer[] {
    if (this._gameSession) {
      return this._gameSession.players;
    }
    return [];
  }

  set players(value: TPlayer[]) {
    if (this._gameSession) {
      this._gameSession.players = value;
      this.writeGSLS()
    }
  }

  //

  updateGameSession(updateBlock: (gameSession: TGameLobby) => void) {
    if (this._gameSession)
      updateBlock(this._gameSession)
    this.writeGSLS()
  }

//

  protected _currentQuestion: TQuestion | null = null
  get currentQuestion(): TQuestion | null {
    return this._currentQuestion;
  }

  set currentQuestion(value: TQuestion | null) {
    this._currentQuestion = value;
    this.writeGSLS()
  }

  //
  protected _submittedAnswer: TAnswerSubmit | null = null
  get submittedAnswer(): TAnswerSubmit | null {
    return this._submittedAnswer;
  }

  set submittedAnswer(value: TAnswerSubmit | null) {
    this._submittedAnswer = value;
    this.writeGSLS()
  }

  nickName: string = "Ẩn danh"

  sk = SocketManager()
  soundManager = useSound()
  user = useUser()
  player: TPlayer | null = null;

  get isHost(): boolean {
    if (this.gameSession) {
      return this.user.id == this.gameSession.hostId
    }
    return false;
  }

  get gameSocket(): (Socket | null) {
    return this.sk.socketOf("GAMES")
  }

  set gameSocket(value: Socket | null) {

  }

  protected readGSLS() {
    if (typeof window !== 'undefined') {
      const ls = window.localStorage.getItem(this.lsKey)
      if (ls) {
        this._gameSession = JsonParse(ls) as TGameLobby
        if (this._gameSession)
          this.nickName = this._gameSession.nickName;
      }
      const currentQuestionLs = window.localStorage.getItem(this.lsQuestionKey)
      if (currentQuestionLs)
        this._currentQuestion = JsonParse(currentQuestionLs) as TQuestion

      const submittedAnswerLs = window.localStorage.getItem(this.lsSubmitedAnswerKey)
      if (submittedAnswerLs)
        this._submittedAnswer = JsonParse(submittedAnswerLs) as TAnswerSubmit
    }
  }

  protected writeGSLS() {
    // console.log("=>(useGameSession.tsx:154) writeGSLS");
    // console.log("=>(useGameSession.tsx:156) gameSession", this._gameSession);
    // console.log("=>(useGameSession.tsx:156) currentQuestion", this._currentQuestion);
    // console.log("=>(useGameSession.tsx:156) submittedAnswer", this._submittedAnswer);
    if (typeof window !== 'undefined') {
      if (this.gameSession) {
        this.gameSession.nickName = this.nickName;
      }
      window.localStorage.setItem(this.lsKey, JSON.stringify(this._gameSession))
      window.localStorage.setItem(this.lsQuestionKey, JSON.stringify(this._currentQuestion))
      window.localStorage.setItem(this.lsSubmitedAnswerKey, JSON.stringify(this._submittedAnswer))
    }
  }

  connectGameSocket() {
    if (!this.gameSocket || this.gameSocket?.disconnected) {
      this.sk.connect("GAMES")
      this.soundManager?.setGameSoundOn(true)
      this.gameSocket?.offAny()
      this.gameSocket?.onAny((event, data) => {
        console.log("🌎🌎 Event:", event);
        console.log("🌎🌎 Data:", data);
        if (event === "loading" && data.question?.question) {
          this.currentQuestion = data.question?.question
        } else if (data.question as TQuestion) {
          this.currentQuestion = data.question
          this.gameSession = data.gameLobby
        } else if (data.game?.question as TQuestion) {
          this.currentQuestion = data.game.question
        }
        // console.log("=>(useGameSession.tsx:181) this.currentQuestion", this.currentQuestion);
      });
    } else {
      console.log("=>(useGameSession.tsx:106) connect Failed", this, this.gameSession, this.gameSocket);
    }
  }

  disconnectGameSocket() {
    if (this.gameSocket?.connected) {
      this.sk.disconnect("GAMES")
    }
  }

  gameSkEmit(ev: string, msg: any) {
    console.log("📨📨 Event:", ev);
    console.log("📨📨 Message:", msg);
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
      this.submittedAnswer = null
    }
  }

  getQuestionWithID(qid: number): (TQuestion | null) {
    return this.gameSession?.quiz?.questions[qid] || null
  }

}

class GameManagerSingleton extends GameManager {
  private static _instance?: GameManagerSingleton;

  constructor() {
    if (GameManagerSingleton._instance)
      throw new Error("Use GameManagerSingleton.instance instead of new.");
    super();
    GameManagerSingleton._instance = this;
  }

  static get instance() {
    return GameManagerSingleton._instance ?? (GameManagerSingleton._instance = new GameManagerSingleton());
  }
}

export const useGameSession = () => GameManagerSingleton.instance