import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
import Cookies from 'universal-cookie'
import { TUser } from '../../types/types'
import { JsonParse } from '../../utils/helper'
import { useLocalStorage } from '../useLocalStorage/useLocalStorage'
import { useSocket } from '../useSocket/useSocket'

type UseAuthValue = {
  isAuth: boolean
  toPrevRoute: () => Promise<void>
  navigate: (navigateTo: string) => Promise<void>
  signOut: () => Promise<void>
  signIn: () => Promise<void>
  getUser: () => TUser | undefined
  setUser: (data: TUser) => void
}
const AuthContext = React.createContext<UseAuthValue>({
  isAuth: false,
  toPrevRoute: async () => {},
  navigate: async () => {},
  signOut: async () => {},
  signIn: async () => {},
  getUser: () => undefined,
  setUser: () => {},
})

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const { socket } = useSocket()
  const router = useRouter()
  const [prevRoute, setPrevRoute] = useLocalStorage('prev-route', '/')
  const [lsUser, setLsUser] = useLocalStorage('user', '')
  const cookies = new Cookies()

  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [userState, setUserState] = useState<TUser | undefined>()

  useEffect(() => {
    setIsAuth(
      Boolean(
        userState?.token?.accessToken?.length ||
          cookies.get('access-token')?.length
      )
    )
  }, [userState])

  useEffect(() => {
    const _lsUser = JsonParse(lsUser) as TUser
    if (_lsUser?.username?.length) {
      setUserState(_lsUser)
    }
  }, [lsUser])

  const navigate = async (navigateTo: string) => {
    if (!isAuth) {
      setPrevRoute(navigateTo)
      await router.push(`/sign-in`)
    } else {
      await router.push(navigateTo)
    }
  }

  const toPrevRoute = async () => {
    const temp = prevRoute
    setPrevRoute('/')
    await router.push(temp)
  }

  const signOut = async () => {
    cookies.remove('access-token')
    cookies.remove('refresh-token')
    setLsUser('')
    socket?.disconnect()
    setUserState(undefined)
    await router.push('/')
  }

  const signIn = async () => {
    await router.push('/sign-in')
  }

  const getUser = () => {
    return userState
  }

  const setUser = (data: TUser) => {
    try {
      setUserState(data)
      cookies.set('access-token', data.token.accessToken)
      cookies.set('refresh-token', data.token.refreshToken)
      setLsUser(JSON.stringify({ ...data, token: undefined }))
    } catch (error) {
      console.log('setUser - error', error)
    }
  }

  const value = {
    isAuth,
    navigate,
    toPrevRoute,
    signOut,
    getUser,
    setUser,
    signIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => React.useContext(AuthContext)
