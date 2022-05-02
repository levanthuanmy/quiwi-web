import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
import Cookies from 'universal-cookie'
import { useLocalStorage } from '../useLocalStorage/useLocalStorage'

type UseAuthNavigationValue = {
  isAuth: boolean
  toPrevRoute: () => void
  navigate: (navigateTo: string) => void
}
const AuthNavigationContext = React.createContext<UseAuthNavigationValue>({
  isAuth: false,
  toPrevRoute: () => {},
  navigate: () => {},
})

export const AuthNavigationProvider = ({
  children,
}: {
  children?: ReactNode
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const router = useRouter()
  const [prevRoute, setPrevRoute] = useLocalStorage('prev-route', '/')
  const cookies = new Cookies()
  const accessToken: string = cookies.get('access-token')

  useEffect(() => {
    if (accessToken?.length) {
      setIsAuth(true)
    }
  }, [accessToken, router])

  const navigate = (navigateTo: string) => {
    if (!isAuth) {
      console.log('navigate - isAuth)', isAuth)
      setPrevRoute(navigateTo)
      router.push(`/sign-in`)
    } else {
      console.log(navigateTo)

      router.push(navigateTo)
    }
  }

  const toPrevRoute = () => {
    const temp = prevRoute
    setPrevRoute('/')
    router.push(temp)
  }

  const value = {
    isAuth,
    navigate,
    toPrevRoute,
  }

  return (
    <AuthNavigationContext.Provider value={value}>
      {children}
    </AuthNavigationContext.Provider>
  )
}

export const useAuthNavigation = () => React.useContext(AuthNavigationContext)
