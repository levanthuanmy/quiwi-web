import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import Avatar from '../Avatar/Avatar'
import styles from './NavBar.module.css'

type NavBarProps = {
  className?: string
  setIsExpand: React.Dispatch<React.SetStateAction<boolean>>
  isExpand: boolean
}
const NavBar: FC<NavBarProps> = (props: NavBarProps) => {
  const router = useRouter()

  return (
    <div
      className={classNames(
        'bg-white border-bottom d-flex align-items-center px-3 justify-content-between position-fixed w-100',
        styles.container,
        props.className
      )}
    >
      <div className="d-flex align-items-center gap-3 py-3">
        <div
          className={classNames(
            'bi fs-20px d-flex justify-content-center align-items-center rounded-10px cursor-pointer border transition-all-150ms',
            styles.btn,
            {
              'bi-list': !props.isExpand,
              'bi-x-lg': props.isExpand,
            }
          )}
          onClick={() => props.setIsExpand((prev) => !prev)}
        />

        <Image
          src="/assets/logo-text.png"
          width={133}
          height={39}
          alt="text-logo"
          onClick={async () => await router.push('/')}
          className="cursor-pointer"
        />
      </div>

      <Avatar />
    </div>
  )
}

export default NavBar
