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
  questions: TQuestionResponse[]
  gameLobby: GameLobby[]
  banner: string
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

export type TGamePlayBodyRequest<T> = {
  socketId: string
  data: T
}

export type TStartGameRequest = {
  userId: number
  invitationCode: string
  token?: string
}

export type TQuizBodyRequest = {
  title: string
  description: string
  isPublic: boolean
  isLocked: boolean
  numPlayed: number
  numUpvotes: number
  numDownvotes: number
  questions: TQuestionRequest[]
}

export type TQuestionType = '10SG' | '20MUL' | '30TEXT'

export type TQuestionRequest = {
  question: string
  type: TQuestionType
  difficulty: number
  duration: number
  orderPosition: number
  questionAnswers: TAnswerRequest[]
  media: string
}

export type TQuestionResponse = {
  question: string
  type: TQuestionType
  difficulty: number
  duration: number
  orderPosition: number
  questionAnswers: TAnswerResponse[]
  media: string
  id: number
}

export type TAnswerRequest = {
  answer: string
  isCorrect: boolean
  orderPosition: number
  media: string
  type: '10TEXT' | '20SELECTION'
}

export type TAnswerResponse = {
  id: number
  answer: string
  isCorrect: boolean
  questionId: number
  media: string
  type: string  
}