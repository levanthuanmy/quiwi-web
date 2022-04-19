import { atom, selector } from 'recoil'
import { TUser } from '../types/types'
import Cookies from 'universal-cookie'

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
    accessToken: '',
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
        cookies.set('access-token', newUser.token.accessToken)
        cookies.set('refresh-token', newUser.token.refreshToken)
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

export { userState, userTokensState }
