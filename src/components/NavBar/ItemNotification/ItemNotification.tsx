import classNames from 'classnames'
import React, { FC, memo } from 'react'
import { TNotification } from '../../../types/types'
import { timeSince } from '../../../utils/helper'

const ItemNotification: FC<{
  notification: TNotification
  markAsRead: Function
}> = ({ notification, markAsRead }) => {
  return (
    <div
      className="bg-white p-2 rounded-10px d-flex align-items-center cursor-pointer"
      onClick={() => markAsRead()}
    >
      <div className="w-100">
        <div
          className={classNames('fw-medium', {
            'text-primary': !notification?.isRead,
          })}
        >
          {notification?.title}
        </div>

        <div className="fs-14px text-secondary">
          {notification?.description}
        </div>

        <div className="fs-14px text-secondary fst-italic text-end">
          • {timeSince(notification.createdAt)}
        </div>
      </div>
      <div
        className={classNames('bi bi-circle-fill fs-14px', {
          'text-primary': !notification?.isRead,
          'text-white': notification?.isRead,
        })}
      />
    </div>
  )
}

export default memo(ItemNotification)
