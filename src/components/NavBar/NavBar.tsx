import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import Avatar from '../Avatar/Avatar'

type NavBarProps = {
  className?: string
}
const NavBar: FC<NavBarProps> = (props: NavBarProps) => {
  const router = useRouter()

  return (
    <div
      style={{ height: 64, zIndex: 10 }}
      className={classNames(
        'bg-white border-bottom d-flex align-items-center px-3 justify-content-between position-fixed w-100',
        props.className
      )}
    >
      <Image
        src="/assets/logo-text.png"
        width={133}
        height={39}
        alt="text-logo"
        onClick={async () => await router.push('/')}
        className="cursor-pointer"
      />

      <Avatar />
    </div>
  )
}

export default NavBar
