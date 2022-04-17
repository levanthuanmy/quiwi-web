import { atom, selector } from 'recoil'
import { TUser } from '../types/types'
import Cookies from 'universal-cookie'
import { JsonParse } from '../utils/helper'

const defaultUserState: TUser = {
  avatar: '',
  coin: 0,
  id: 0,
  isBanned: false,
  isLocked: false,
  isVerified: false,
  name: '',
  role: '',
  token: {
    expiredIn: '',
    refreshToken: '',
    token: '',
  },
  username: '',
}

const userState = atom<TUser>({
  key: 'userState',
  default: defaultUserState,
  effects: [
    ({ onSet }) => {
      const cookies = new Cookies()
      onSet((newUser) => {
        cookies.set('access-token', newUser.token.token)
        cookies.set('refresh-token', newUser.token.refreshToken)
        localStorage.setItem('user', JSON.stringify(newUser))
      })
    },
  ],
})

const userTokensState = selector({
  key: 'userTokensState',
  get: ({ get }) => {
    const user = get(userState)
    return user.token
  },
})

const userInfoState = selector({
  key: 'userInfoState',
  get: ({ get }) => {
    const storedUser = localStorage.getItem('user')
    const user = get(userState)
    if (user.username.length) {
      return user
    } else {
      return JsonParse(storedUser)
    }
  },
})

export { userState, userTokensState, userInfoState }
