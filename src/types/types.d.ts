export interface TUser {
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
  gameLobbyId?: number
  nickname: string
  user?: TUser
  userId?: number
  score: number
  currentStreak?: number
}

export type TQuiz = {
  id: number
  title: string
  description: string
  user?: TUser
  userId: number
  isPublic: boolean
  isLocked: boolean
  numPlayed: number
  numUpvotes: number
  numDownvotes: number
  questions: TQuestion[]
  gameLobby: GameLobby[]
  banner: string
  quizCategories?: TQuizCategory[]
}

export type TGameModeEnum = '10CLASSIC' | '20MRT' | '30EXAM'

export type TGameStatus = '00WAITING' | '10PLAYING' | '20END'

export type TStartQuizRequest = {
  userId?: number
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
  chats: MessageProps[]
  gameRoundStatistics: TGameRoundStatistic[]
  deadline?: {
    duration?: number //minutes
    timeEnd?: number // timestamp
    timeStart?: number // timestamp
  }
}

export type QuestionGameResponse = {
  currentQuestionIndex: number
  question: TQuestion
}

export type TStartCommunityQuizResponse = {
  room: TStartQuizResponse
  questionGameResponse: QuestionGameResponse
  // gameRoundStatistics: TGameRoundStatistic[]
}

export type TGameRoundStatistic = {
  playersWithAnswer: TPlayer[]
  playersWithoutAnswer: TPlayer[]

  numberOfCorrectAnswers: number
  numberOfSubmission: number
  numberOfTimeout: number

  roundNumber: number

  answersStatistic?: Record<number, number>

  answerTextStatistic?: Record<string, number>
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
  badges: TUserBadge[]
  currentBadge: TBadge | null
  isFollowing?: boolean
}

export type TUserBadge = {
  id: number
  badge: TBadge
  process: number
  isCurrent: boolean
  status: string
}

export type TBadge = {
  id: number
  title: string
  description: string
  picture: string
  badgeRequirements?: TBadgeRequirent[]
}

export type TBadgeRequirent = {
  code: string
  badgeId: number
  goal: number
  type: string
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
  itemCategoryId: number
  itemCategory: TItemCategory
  createdAt: Date
  updatedAt: Date
  isOwn?: boolean
  quantity: number
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
  questions: TQuestion[]
}

export type TQuestionType =
  | '10SG'
  | '20MUL'
  | '21ODMUL'
  | '22POLL'
  | '30TEXT'
  | '31ESSAY'
export type TMatcher = '10EXC' | '20CNT'

export type TQuestion = {
  id?: number
  question: string
  type: TQuestionType
  matcher?: TMatcher
  difficulty: number
  duration: number
  orderPosition: number
  questionAnswers: TAnswer[]
  media: string
  score: number
  matcher?: TMatcherQuestion
}

export type TMatcherQuestion = '10EXC' | '20CNT'

export type TAnswer = {
  id?: number
  answer: string
  isCorrect: boolean
  orderPosition: number
  media: string
  type: TAnswerType
}

export type TAnswerType = '10TEXT' | '20SELECTION' | '21PLHDR'

export type TUserItems = {
  id?: number
  itemId: number
  quantity: number
  item: TItem
  isUsed: boolean
  userId: number
  createdAt: Date
  updatedAt: Date
}

export type TGameRound = {
  score: number
  question?: TQuestion
  questionId: number
  playerId: number
  answer?: string
  answerIds: number[]
  selectionAnswers: Record<string, TAnswer>
  isCorrect: boolean
  useItem: boolean
  currentScore: number
  currentStreak: number
}

export type TDetailPlayer = TPlayer & {
  gameRounds: TGameRound[]
}

export type TGameHistory = {
  id: number
  nickName: string
  mode: string
  host: TUser
  hostId: number
  invitationCode: string
  players: TDetailPlayer[]
  quiz: TQuiz
  quizId: number
  status: TGameStatus
  chats: MessageProps[]
  gameRoundStatistics: TGameRoundStatistic[]
  createdAt: Date
  updatedAt: Date
  endedAt: Date
  time: number
  isCommunityPlay: boolean
}

export type TViewResult = {
  gameRoundStatistic: TGameRoundStatistic
  correctAnswers: number[]
  answersStatistic: Record<string, number>
  answerTextStatistic: Record<string, number>
  player?: TPlayer
}

export type TQuest = {
  id?: number
  questTitle: string
  type: string
  activityEvent: string
  typeActionDetail: string
  userQuest: TUserQuest[]
  questGoal: TQuestGoal[]
  spinNum: number
  coin: number
  questRequirement: TQuestRequirement[]
}

export type TQuestGoal = {
  id?: number
  questId: string
  type: string
  reward: TReward
}

export type TReward = {
  id: number
  name: string
  avatar: string
  type: string
  description: string
  price: number
  itemCategoryId: number
  itemCategory: TItemCategory
  createdAt: Date
  updatedAt: Date
  isOwn?: boolean
  coin: number
  quantity: number
}

export type TUserQuest = {
  id: number
  process: number
  status: string
  isReceivedReward: boolean
}

export type TQuestRequirement = {
  goal: number
  type: string
}

export type TNotification = {
  id: number
  user: TUser
  userId: number
  url: string
  title: string
  description: string
  isRead: boolean
  createdAt: string
}

export type TWheelFortune = {
  id: number
  jackpotTotalScore: number
  wheelSetting: any
  numberPlayerJoin: number
}

export type TUserWheelFortune = {
  id: number
  userId: number
  numberSpin: number
}

export type TResultWheelFortune = {
  prizeNumber: number
  isJackpot: boolean
  jackpotScore: number
  numberSpin: number
  score: number
  numberJoinSpinning: number
}

export type TQuizCategory = {
  id: number
  name: string
  keyword: string
}

export type TAnswerSubmit = {
  invitationCode: string
  nickname: string
  answerIds: number[]
  answer: string
  questionId?: number
}
