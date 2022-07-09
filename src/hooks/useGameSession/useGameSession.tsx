import {Socket} from "socket.io-client";
import {
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
    curIndexQuestion: number
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

  updateGameSession(updateBlock: (gameSession: TGameLobby) => void) {
    if (this._gameSession)
      updateBlock(this._gameSession)
    this.writeGSLS()
  }

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
      }
    }
  }

  private writeGSLS() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(GameManager.lsKey, JSON.stringify(this.gameSession))
    }
  }

  connectGameSocket() {
    if (!this.gameSocket || this.gameSocket?.disconnected) {
      this.sk.connect("GAMES")
      this.soundManager?.setGameSoundOn(true)
      this.gameSocket?.offAny()
      this.gameSocket?.onAny(function (event, data) {
        console.log("🌎🌎 Event:", event);
        console.log("🌎🌎 Data:", data);
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
    }
  }

  getQuestionWithID(qid: number): (TQuestion | null) {
    return this.gameSession?.quiz?.questions[qid] || null
  }

}

export const useGameSession = () => GameManager.instance