/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
import Cookies from 'universal-cookie'
import { get } from '../../libs/api'
import { TUser } from '../../types/types'
import { JsonParse } from '../../utils/helper'
import { useLocalStorage } from '../useLocalStorage/useLocalStorage'
import { SocketManager } from '../useSocket/socketManager'

type UseAuthValue = {
  isAuth: boolean
  toPrevRoute: () => Promise<void>
  navigate: (navigateTo: string) => Promise<void>
  signOut: () => Promise<void>
  signIn: () => Promise<void>
  getUser: () => TUser | undefined
  setUser: (data: TUser) => void
  fetchUser: () => Promise<void>
  signInModalHandler: boolean
  setSignInModalHandler: React.Dispatch<React.SetStateAction<boolean>>
}
const AuthContext = React.createContext<UseAuthValue>({
  isAuth: false,
  toPrevRoute: async () => {},
  navigate: async () => {},
  signOut: async () => {},
  signIn: async () => {},
  fetchUser: async () => {},
  getUser: () => undefined,
  setUser: () => {},
  signInModalHandler: false,
  setSignInModalHandler: () => {},
})

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const socketManager = SocketManager()
  const router = useRouter()
  const [prevRoute, setPrevRoute] = useLocalStorage('prev-route', '/')
  const [lsUser, setLsUser] = useLocalStorage('user', '')
  const cookies = new Cookies()

  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [userState, setUserState] = useState<TUser | undefined>()
  const [signInModalHandler, setSignInModalHandler] = useState<boolean>(false)

  useEffect(() => {
    const _lsUser = JsonParse(lsUser) as TUser
    if (_lsUser?.token?.accessToken.length) {
      const getUser = async () => {
        try {
          const res = await get<any>('/api/users/profile', true)
          setUserState({ ..._lsUser, ...res?.response?.user })
        } catch (error) {
          console.log('getUser - error', error)
        }
      }

      cookies.set('access-token', _lsUser.token.accessToken)
      cookies.set('refresh-token', _lsUser.token.refreshToken)

      getUser()
    }

    setIsAuth(
      Boolean(
        cookies.get('access-token')?.length &&
          _lsUser?.token?.refreshToken?.length
      )
    )
  }, [lsUser, cookies.get('access-token')])

  const navigate = async (navigateTo: string) => {
    if (!isAuth) {
      setPrevRoute(navigateTo)
      await router.push(`/sign-in`)
    } else {
      await router.push(navigateTo)
    }
  }

  const fetchUser = async () => {
    const _lsUser = JsonParse(lsUser) as TUser
    try {
      const res = await get<any>('/api/users/profile', true)
      setUserState({ ..._lsUser, ...res?.response?.user })
    } catch (error) {
      console.log('getUser - error', error)
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
    console.log('🚪=>(useAuth.tsx:80) Đăng xuất, cookies: ', cookies)
    setLsUser('')
    socketManager.disconnectAll()
    setUserState(undefined)
    setIsAuth(false)
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
      console.log('🔓=>(useAuth.tsx:99) Đăng nhập, cookies: ', cookies)
      setLsUser(JSON.stringify(data))
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
    signInModalHandler,
    setSignInModalHandler,
    fetchUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => React.useContext(AuthContext)
