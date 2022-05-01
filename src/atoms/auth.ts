import { atom, selector } from 'recoil'
import Cookies from 'universal-cookie'
import { TUser } from '../types/types'

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
  email: '',
  gender: '',
  phoneNumber: '',
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

        localStorage.setItem(
          'user',
          JSON.stringify({ ...newUser, token: null })
        )
      })
    },
  ],
})

const isAuthState = selector<boolean>({
  key: 'isAuthState',
  get: ({ get }) => {
    const user = get(userState)
    const cookies = new Cookies()
    const accessTokenCookie: string = cookies.get('access-token')
    const accessToken: string = user.token.accessToken

    const isAuth =
      Boolean(accessTokenCookie.length) || Boolean(accessToken.length)
    return isAuth
  },
})

export { userState, isAuthState }
