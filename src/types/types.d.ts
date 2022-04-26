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

export type TGameModeEnum = '10CLASSIC' | '20MRT'

export type TGameStatus = '00WAITING' | '10PLAYING' | '20END'

export type TStartQuizRequest = {
  userId: number
  quizId: number
  mode: TGameModeEnum
  deadline?: number
  token?: string
}

export type TStartQuizResponse = {
  gameMode: {
    curIndexQuestion: number
  }
  mode: TGameModeEnum
  host: TUser
  hostId: number
  invitationCode: string
  players: []
  quiz: TQuiz
  quizId: number
  status: TGameStatus
}

export type TFollowUsers = {
  id?: number
  user?: TUser
  userId: number
  followingUser?: TUser
  followingUserId: number
}

export type TPaginationResponse<T> = {
  items: T[]
  pageSize: number
  pageIndex: number
  totalItems: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

export type TUserProfile = {
  user: TUser
  badges: []
  quests: []
  totalFollower: number
  totalFollowing: number
}

export type TJoinQuizResponse = {
  gameLobby: TStartQuizResponse
  player: TPlayer
}

export type TNewPlayerResponse = {
  newPlayer: {
    nickname: string
    score: number
    currentStreak: number
  }
}
