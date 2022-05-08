import { useRouter } from 'next/router'
import { FC } from 'react'
import { Dropdown, Image } from 'react-bootstrap'
import { useSetRecoilState } from 'recoil'
import useSWR from 'swr'
import Cookies from 'universal-cookie'
import { userState } from '../../atoms/auth'
import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
import { useSocket } from '../../hooks/useSocket/useSocket'
import { get } from '../../libs/api'

const Avatar: FC = () => {
  const router = useRouter()
  const cookies = new Cookies()
  const authNavigation = useAuthNavigation()
  const { socket } = useSocket()
  const setAtomUser = useSetRecoilState(userState)

  const { data: userRes } = useSWR<any>([`/api/users/profile`, true], get, {
    revalidateOnFocus: false,
  })

  const handleLogout = async () => {
    cookies.remove('access-token')
    cookies.remove('refresh-token')
    localStorage.removeItem('user')
    socket.disconnect()
    setAtomUser(undefined)
    await router.push('/')
    router.reload()
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
          {userRes?.response?.user?.name || 'Khách'}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="rounded-10px p-0 overflow-hidden">
        {authNavigation.isAuth && (
          <>
            <div className="p-3 d-flex align-items-center gap-2 fw-medium">
              <Image
                src="/assets/quiwi-coin.png"
                width={20}
                height={20}
                alt="coin"
              />
              {userRes?.response?.user?.coin}
            </div>
            <Dropdown.Item
              eventKey="0"
              onClick={() => authNavigation.navigate('/profile')}
              className="px-3 py-2"
            >
              Trang cá nhân
            </Dropdown.Item>
          </>
        )}
        <Dropdown.Item
          eventKey="1"
          onClick={
            authNavigation.isAuth
              ? handleLogout
              : async () => await router.push('/sign-in')
          }
          className="px-3 py-2"
        >
          {authNavigation.isAuth ? 'Đăng xuất' : 'Đăng nhập'}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Avatar
