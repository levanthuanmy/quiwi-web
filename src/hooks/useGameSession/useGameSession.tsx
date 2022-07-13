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

export type TGameSession = {}

export class GameManager {
  private static lsKey = "game-session"
  private static lsQuestionKey = "current-question"
  private static lsSubmitedAnswerKey = "recent-submit-question"
  private static _instance?: GameManager;


  private _gameSession: TGameLobby | null = null;
  get gameSession(): TGameLobby | null {
    if (!this._gameSession) {
      this.readGSLS()
    }
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

  private _currentQuestion: TQuestion | null = null
  get currentQuestion(): TQuestion | null {
    return this._currentQuestion;
  }

  set currentQuestion(value: TQuestion | null) {
    this._currentQuestion = value;
    this.writeGSLS()
  }
  //

  private _submittedAnswer: TAnswerSubmit | null = null
  get submittedAnswer(): TAnswerSubmit | null {
    console.log("=>(useGameSession.tsx:87) get this._submittedAnswer", this._submittedAnswer);
    return this._submittedAnswer;
  }

  set submittedAnswer(value: TAnswerSubmit | null) {
    console.log("=>(useGameSession.tsx:87) set this._submittedAnswer", this._submittedAnswer);
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

  private constructor() {
    if (GameManager._instance)
      throw new Error("Use GameManager.instance instead of new.");
    GameManager._instance = this;
  }

  static get instance() {
    return GameManager._instance ?? (GameManager._instance = new GameManager());
  }

  private readGSLS() {
    if (typeof window !== 'undefined') {
      const ls = window.localStorage.getItem(GameManager.lsKey)
      if (ls) {
        this._gameSession = JsonParse(ls) as TGameLobby
        this.nickName = this._gameSession.nickName;
      }
      const currentQuestionLs = window.localStorage.getItem(GameManager.lsQuestionKey)
      if (currentQuestionLs)
        this._currentQuestion = JsonParse(currentQuestionLs) as TQuestion

      const submittedAnswerLs = window.localStorage.getItem(GameManager.lsSubmitedAnswerKey)
      if (submittedAnswerLs)
        this._submittedAnswer = JsonParse(submittedAnswerLs) as TAnswerSubmit
    }
  }

  private writeGSLS() {
    console.log("=>(useGameSession.tsx:154) writeGSLS");
    if (typeof window !== 'undefined') {
      if (this.gameSession) {
        this.gameSession.nickName = this.nickName;
      }
      window.localStorage.setItem(GameManager.lsKey, JSON.stringify(this.gameSession))
      window.localStorage.setItem(GameManager.lsQuestionKey, JSON.stringify(this.currentQuestion))
      window.localStorage.setItem(GameManager.lsSubmitedAnswerKey, JSON.stringify(this.submittedAnswer))
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
    if (this._gameSession) {
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

export const useGameSession = () => GameManager.instance