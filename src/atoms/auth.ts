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

const userState = atom<TUser | undefined>({
  key: 'USER_STATE',
  default: defaultUserState,
  effects: [
    ({ onSet }) => {
      try {
        const cookies = new Cookies()
        onSet((newUser) => {
          if (newUser !== undefined) {
            cookies.set('access-token', newUser.token.accessToken)
            cookies.set('refresh-token', newUser.token.refreshToken)

            localStorage.setItem(
              'user',
              JSON.stringify({ ...newUser, token: undefined })
            )
          }
        })
      } catch (error) {
        console.log('error', error)
      }
    },
  ],
})

export { userState }
