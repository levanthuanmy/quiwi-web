import classNames from 'classnames'
import React, { FC, memo } from 'react'
import { useAuth } from '../../hooks/useAuth/useAuth'
import styles from './ItemMenuBar.module.css'
import { playSound } from '../../utils/helper'
import { SOUND_EFFECT } from '../../utils/constants'
import { useRouter } from 'next/router'

type ItemMenuBarProps = {
  title: string
  iconClassName: string
  url: string
  isActive?: boolean
  isAuth?: boolean
}
const ItemMenuBar: FC<ItemMenuBarProps> = ({
  title,
  iconClassName,
  url,
  isActive,
  isAuth,
}) => {
  const authNavigate = useAuth()
  const router = useRouter()
  const clickEventSoundNivigate = (url: string) => {
    playSound(SOUND_EFFECT['SIDE_BAR_SOUND_CLICK'])
    if (isAuth) {
      authNavigate.navigate(url)
    } else {
      router.push(url)
    }
  }
  return (
    <div
      className={classNames(
        'd-flex align-items-center px-3 py-2 cursor-pointer text-secondary text-truncate gap-3',
        styles.container,
        {
          'fw-medium': isActive,
        }
      )}
      onClick={() => clickEventSoundNivigate(url)}
      title={title}
    >
      <div
        className={classNames(
          'fs-20px d-flex justify-content-center align-items-center bg-primary rounded-10px',
          {
            'bg-opacity-100 text-white': isActive,
            'bg-opacity-10 text-primary': !isActive,
          },
          styles.item,
          iconClassName
        )}
      />
      <div className="fs-18px">{title}</div>
    </div>
  )
}

export default memo(ItemMenuBar)
