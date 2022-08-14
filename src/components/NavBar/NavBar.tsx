/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC, memo, useEffect, useState } from 'react'
import { Collapse } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { SocketManager } from '../../hooks/useSocket/socketManager'
import { useSound } from '../../hooks/useSound/useSound'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TNotification,
  TPaginationResponse,
} from '../../types/types'
import { SOUND_EFFECT } from '../../utils/constants'
import { timeSince } from '../../utils/helper'
import MyButton from '../MyButton/MyButton'
import ItemNotification from './ItemNotification/ItemNotification'
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
  const [showNotifyList, setShowNotifyList] = useState<boolean>(false)
  const socket = SocketManager()
  const notificationSocket = socket.socketOf('NOTIFICATION')
  const [notifications, setNotifications] = useState<TNotification[]>([])
  const [notiCount, setNotiCount] = useState<number>(notifications?.length || 0)
  const { addToast } = useToasts()
  const sound = useSound()

  useEffect(() => {
    if (authContext.isAuth) {
      if (notificationSocket !== null) {
        notificationSocket?.emit('join-noti-space', {
          userId: authContext.getUser()?.id,
        })
      } else {
        socket.connect('NOTIFICATION')
      }

      const getInitNotifications = async () => {
        try {
          const res = await get<
            TApiResponse<TPaginationResponse<TNotification>>
          >(`/api/notification`, true)
          setNotifications(res.response.items)
          setNotiCount(countUnread(res.response.items))
        } catch (error) {
          console.log('getInitNotifications - error', error)
        }
      }

      getInitNotifications()
    }
  }, [authContext.isAuth])

  useEffect(() => {
    if (notificationSocket) {
      notificationSocket.off('notification')

      notificationSocket.on('notification', (data: TNotification) => {
        sound?.playSound(SOUND_EFFECT['NOTIFICATION'])
        setNotifications((prev) => [data, ...prev])
        setNotiCount((prev) => prev + 1)
        addToast(
          <div onClick={() => onReadNotify(data)}>
            <div className="fs-18px">{data.title}</div>
            <div className="">{data.description}</div>
            <div className="fs-14px text-secondary fst-italic text-end">
              • {timeSince(data.createdAt)}
            </div>
          </div>,
          {
            appearance: 'info',
            autoDismiss: true,
          }
        )
      })
    }
  }, [notificationSocket])

  const countUnread = (notifications: TNotification[]) => {
    let count = 0
    for (let noti of notifications) {
      if (!noti.isRead) {
        count++
      }
    }
    return count
  }

  const onReadNotify = async (notif: TNotification, index?: number) => {
    try {
      if (!notif.isRead) {
        await get(`/api/notification/mark-as-read/${notif.id}`, true)

        setNotifications((prev) => {
          let _current = [...prev]
          if (index !== undefined) {
            _current[index] = { ...prev[index], isRead: true }
          } else {
            const idx = prev.findIndex((e) => e.id === notif.id)
            _current[idx] = { ...prev[idx], isRead: true }
          }
          return _current
        })

        setNotiCount((prev) => prev - 1)
      }

      notif?.url?.length ? router.push(notif?.url) : null
    } catch (error) {
      console.log('onReadNotify - error', error)
    }
  }

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
            onClick={async () => await router.push('/home')}
            className="cursor-pointer"
          />
        </div>

        <div className="d-flex gap-3">
          {onToQuizCreator && (
            <MyButton
              className="text-white fs-14px d-none d-sm-block"
              onClick={onToQuizCreator}
            >
              Tạo Quiz
            </MyButton>
          )}
          {onShowJoinQuiz && (
            <MyButton
              className="text-white fs-14px d-none d-sm-block"
              onClick={onShowJoinQuiz}
            >
              Vào phòng ngay
            </MyButton>
          )}
          {!authContext.isAuth ? (
            <MyButton
              className="text-white fs-14px"
              onClick={authContext.signIn}
            >
              Đăng nhập
            </MyButton>
          ) : (
            <div className="position-relative">
              <div
                className={classNames(
                  'rounded-circle d-flex justify-content-center align-items-center bg-light text-secondary cursor-pointer transition-all-150ms border position-relative',
                  styles.btn
                )}
                onClick={() => setShowNotifyList((prev) => !prev)}
              >
                <div className="bi bi-bell-fill fs-20px" />

                {notiCount > 0 ? (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      fontSize: 10,
                      right: -4,
                      top: -4,
                    }}
                    className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle position-absolute"
                  >
                    {notiCount > 10 ? `+9` : notiCount}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="position-absolute pt-2" style={{ right: 0 }}>
                <Collapse in={showNotifyList}>
                  <div className="rounded-14px overflow-hidden border shadow">
                    <div
                      className="bg-light p-12px d-flex flex-column gap-2 overflow-auto"
                      style={{ width: 343, height: 667 }}
                    >
                      <div className="fs-18px fw-medium">
                        Thông báo ({notiCount})
                      </div>
                      {notifications?.length ? (
                        notifications.map((noti, key) => (
                          <ItemNotification
                            key={key}
                            notification={noti}
                            markAsRead={() => onReadNotify(noti, key)}
                          />
                        ))
                      ) : (
                        <div className="fst-italic text-secondary">
                          Bạn chưa có thông báo nào mới
                        </div>
                      )}
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(NavBar)
