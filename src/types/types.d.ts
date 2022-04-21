export type TUser = {
  avatar: string
  coin: number
  id: number
  isBanned: boolean
  isLocked: boolean
  isVerified: boolean
  name: string
  role: string
  token: TToken
  username: string
}

export type TToken = {
  expiredIn: string
  refreshToken: string
  accessToken: string
}

export type TApiResponse<T> = {
  code: number
  message: string
  response: T
}

export type TPlayer = {
  id: number

  // gameLobby:

  // gameLobby: object

  gameLobbyId: number

  nickname: string

  user?: TUser

  userId?: number

  score: number
}

export type TQuiz = {
  id: number

  title: string

  description: string

  user?: User

  userId: number

  isPublic: boolean

  isLocked: boolean

  numPlayed: number

  numUpvotes: number

  numDownvotes: number

  questions: Question[]

  gameLobby: GameLobby[]
}



export type TGameLobby = {
  id?: number

  players: TPlayer[]

  // quiz: Quiz

  quizId: number

  host?: User

  hostId: number

  mode: string

  time: number

  invitationCode: string

  status: string

  gameMode?: BaseGameMode
}
