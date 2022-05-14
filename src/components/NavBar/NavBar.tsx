import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useAuth } from '../../hooks/useAuth/useAuth'
import MyButton from '../MyButton/MyButton'
import styles from './NavBar.module.css'

type NavBarProps = {
  className?: string
  setIsExpand: React.Dispatch<React.SetStateAction<boolean>>
  isExpand: boolean
  showMenuBtn?: boolean
}
const NavBar: FC<NavBarProps> = ({
  className,
  setIsExpand,
  isExpand,
  showMenuBtn = true,
}) => {
  const router = useRouter()
  const authContext = useAuth()

  return (
    <div
      className={classNames(
        'bg-white border-bottom d-flex align-items-center px-3 justify-content-between position-fixed w-100',
        styles.container,
        className
      )}
    >
      <div className="d-flex align-items-center gap-3 py-3">
        {showMenuBtn && (
          <div
            className={classNames(
              'bi fs-20px d-flex justify-content-center align-items-center rounded-10px cursor-pointer border transition-all-150ms',
              styles.btn,
              {
                'bi-list': !isExpand,
                'bi-x-lg': isExpand,
              }
            )}
            onClick={() => setIsExpand((prev) => !prev)}
          />
        )}

        <Image
          src="/assets/logo-text.png"
          width={133}
          height={39}
          alt="text-logo"
          onClick={async () => await router.push('/')}
          className="cursor-pointer"
        />
      </div>

      {!authContext.isAuth && (
        <div>
          <MyButton className="text-white" onClick={authContext.signIn}>
            Đăng Nhập
          </MyButton>
        </div>
      )}
    </div>
  )
}

export default NavBar
