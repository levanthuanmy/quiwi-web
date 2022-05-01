import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { Dropdown, Image, Spinner } from 'react-bootstrap'
import useSWR from 'swr'
import Cookies from 'universal-cookie'
import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage'
import { useSocket } from '../../hooks/useSocket/useSocket'
import { get } from '../../libs/api'
import { TApiResponse, TUser, TUserProfile } from '../../types/types'
import { JsonParse } from '../../utils/helper'

const Avatar: FC = () => {
  const router = useRouter()
  const cookies = new Cookies()
  const [lsUser] = useLocalStorage('user', '')
  const [user, setUser] = useState<TUser>()
  const authNavigation = useAuthNavigation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { socket } = useSocket()

  useEffect(() => {
    setIsLoading(true)
    setUser(JsonParse(lsUser) as TUser)
    setIsLoading(false)
  }, [lsUser])

  const handleLogout = () => {
    cookies.remove('access-token')
    cookies.remove('refresh-token')
    localStorage.removeItem('user')
    socket.disconnect()
    router.push('/sign-in')
  }

  return (
    <Dropdown id="avatar">
      <Dropdown.Toggle className="cursor-pointer p-1 rounded-pill">
        <Image
          src={'/assets/default-logo.png'}
          width={30}
          height={30}
          alt="avatar"
          className="rounded-circle"
        />

        <span className="text-white ps-2 pe-1 fw-medium">
          {isLoading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            user?.name || user?.username || 'Khách'
          )}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="rounded-10px p-0 overflow-hidden">
        <div className="p-3 d-flex align-items-center gap-2 fw-medium">
          <Image
            src="/assets/quiwi-coin.png"
            width={20}
            height={20}
            alt="coin"
          />
          {user?.coin}
        </div>
        <Dropdown.Item
          eventKey="0"
          onClick={() => authNavigation.navigate('/profile')}
          className="px-3 py-2"
        >
          Trang cá nhân
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="1"
          onClick={handleLogout}
          className="px-3 py-2"
        >
          Đăng xuất
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Avatar
