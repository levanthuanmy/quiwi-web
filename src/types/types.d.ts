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
  token: string
}

export type TApiResponse<T> = {
  code: number
  message: string
  response: T
}
