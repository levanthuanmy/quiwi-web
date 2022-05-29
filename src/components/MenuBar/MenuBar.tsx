import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useAuth } from '../../hooks/useAuth/useAuth'
import ItemMenuBar from '../ItemMenuBar/ItemMenuBar'
import styles from './MenuBar.module.css'
import { Image } from 'react-bootstrap'
import MyButton from '../MyButton/MyButton'

type MenuBarProps = {
  isExpand: boolean
  menuOptions: {
    title: string
    url: string
    iconClassName: string
  }[]
  onToQuizCreator?: () => Promise<void>
  onShowJoinQuiz?: () => void
}
const MenuBar: FC<MenuBarProps> = ({
  isExpand,
  menuOptions,
  onToQuizCreator,
  onShowJoinQuiz,
}) => {
  const router = useRouter()
  const authContext = useAuth()
  const user = authContext.getUser()
  return (
    <div
      className={classNames(
        'border-end position-fixed bg-white text-nowrap d-flex flex-column',
        styles.container,
        {
          shadow: isExpand,
        },
        `${isExpand ? styles.expandWidth : styles.normalWidth}`
      )}
    >
      <div
        className={classNames(styles.itemContainer, 'py-2', {
          'h-100': !authContext.isAuth,
        })}
      >
        <div
          className={classNames(
            'w-100 d-flex gap-3 transition-all-150ms px-3 py-2 cursor-pointer',
            styles.userInfo,
            {
              'align-items-center flex-column justify-content-center': isExpand,
            }
          )}
          onClick={() =>
            authContext.isAuth ? authContext.navigate('/profile') : null
          }
        >
          <Image
            src={'/assets/default-logo.png'}
            width={isExpand ? 90 : 48}
            height={isExpand ? 90 : 48}
            alt="avatar"
            className="rounded-circle transition-all-150ms"
          />
          <div
            className={classNames(
              'text-black fw-medium fs-24px transition-all-150ms',
              {
                'd-block': isExpand,
                'd-none': !isExpand,
              }
            )}
          >
            {authContext.isAuth ? (
              <>
                <div className="text-center">{user?.name || 'Khách'}</div>
                <div className="fs-16px text-center text-secondary">
                  @{user?.username || 'Khách'}
                </div>
              </>
            ) : (
              <MyButton className="text-white" onClick={authContext.signIn}>
                Đăng Nhập
              </MyButton>
            )}
          </div>
        </div>

        <div
          className={classNames(
            {
              'd-flex': isExpand,
              'd-none': !isExpand,
            },
            'gap-3 w-100 p-3'
          )}
        >
          {onToQuizCreator && (
            <MyButton
              className="text-white w-100 d-block d-sm-none"
              onClick={onToQuizCreator}
            >
              Tạo quiz
            </MyButton>
          )}
          {onShowJoinQuiz && (
            <MyButton
              className="text-white w-100 d-block d-sm-none"
              onClick={onShowJoinQuiz}
            >
              Tham gia ngay
            </MyButton>
          )}
        </div>

        <div>
          {menuOptions.map((item, key) => (
            <ItemMenuBar
              key={key}
              {...item}
              isActive={router.pathname === item.url}
            />
          ))}
        </div>
      </div>

      {authContext.isAuth && (
        <div className="position-static bottom-0 p-3 w-100" title="Đăng Xuất">
          <MyButton
            variant="danger"
            className="w-100"
            onClick={authContext.signOut}
          >
            {!isExpand ? (
              <i className="bi bi-box-arrow-left fs-20px" />
            ) : (
              'Đăng Xuất'
            )}
          </MyButton>
        </div>
      )}
    </div>
  )
}

export default MenuBar
