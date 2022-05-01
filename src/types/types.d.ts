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
  phoneNumber: string
  gender: string
  email: string
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

export type TStartQuizRequest = {
  userId: number
  quizId: number
  gameMode: string
  deadline?: number
  token?: string
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
  totalPages: number
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

export type TItemCategory = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export type TItem = {
  id: number
  name: string
  avatar: string
  type: string
  description: string
  price: number
  itemCategory: TItemCategory
  createdAt: Date
  updatedAt: Date
}
