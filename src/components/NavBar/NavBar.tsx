import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import Avatar from '../Avatar/Avatar'

const NavBar: FC = () => {
  const router = useRouter()

  return (
    <div
      style={{ height: 64 }}
      className="bg-white border-bottom d-flex align-items-center px-3 justify-content-between position-fixed w-100"
    >
      <Image
        src="/assets/logo-text.png"
        width={133}
        height={39}
        alt="text-logo"
        onClick={() => router.push('/')}
        className="cursor-pointer"
      />

      <Avatar />
    </div>
  )
}

export default NavBar
