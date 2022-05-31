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
  onToQuizCreator?: () => Promise<void>
  onShowJoinQuiz?: () => void
}
const NavBar: FC<NavBarProps> = ({
  className,
  setIsExpand,
  isExpand,
  showMenuBtn = true,
  onToQuizCreator,
  onShowJoinQuiz,
}) => {
  const router = useRouter()
  const authContext = useAuth()

  return (
    <>
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

        <div className="d-flex gap-3">
          {onToQuizCreator && (
            <MyButton
              className="text-white fs-14px d-none d-sm-block"
              onClick={onToQuizCreator}
            >
              Tạo quiz
            </MyButton>
          )}
          {onShowJoinQuiz && (
            <MyButton
              className="text-white fs-14px d-none d-sm-block"
              onClick={onShowJoinQuiz}
            >
              Tham gia ngay
            </MyButton>
          )}
          {!authContext.isAuth && (
            <MyButton
              className="text-white fs-14px"
              onClick={authContext.signIn}
            >
              Đăng nhập
            </MyButton>
          )}
        </div>
      </div>
    </>
  )
}

export default NavBar
