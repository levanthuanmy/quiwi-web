import { useRouter } from 'next/router'
import { FC } from 'react'
import { Dropdown, Image } from 'react-bootstrap'
import { useAuth } from '../../hooks/useAuth/useAuth'

const Avatar: FC = () => {
  const router = useRouter()
  const authContext = useAuth()
  const user = authContext.getUser()
  return (
    <Dropdown id="avatar">
      <Dropdown.Toggle className="cursor-pointer p-1 rounded-pill">
        <Image
          src={user?.avatar || '/assets/default-logo.png'}
          width={30}
          height={30}
          alt="avatar"
          className="rounded-circle"
        />
        <span className="text-white ps-2 pe-1 fw-medium">
          {authContext.getUser()?.name || 'Khách'}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="rounded-10px p-0 overflow-hidden">
        {authContext.isAuth && (
          <>
            <Dropdown.Item
              eventKey="0"
              onClick={() => authContext.navigate('/profile')}
              className="px-3 py-2"
            >
              Trang cá nhân
            </Dropdown.Item>
          </>
        )}
        <Dropdown.Item
          eventKey="1"
          onClick={
            authContext.isAuth
              ? () => authContext.signOut()
              : async () => await router.push('/sign-in')
          }
          className="px-3 py-2"
        >
          {authContext.isAuth ? 'Đăng xuất' : 'Đăng nhập'}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Avatar
