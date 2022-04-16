import { atom, selector } from 'recoil'
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
    token: '',
  },
  username: '',
}

const userState = atom<TUser>({
  key: 'userState',
  default: defaultUserState,
})

const userTokensState = selector({
  key: 'userTokensState',
  get: ({ get }) => {
    const user = get(userState)
    return user.token
  },
})

export { userState, userTokensState }
