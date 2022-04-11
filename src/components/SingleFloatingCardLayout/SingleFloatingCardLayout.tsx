import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC, ReactNode } from 'react'

type SingleFloatingCardLayoutProps = {
  children?: ReactNode
}
const SingleFloatingCardLayout: FC<SingleFloatingCardLayoutProps> = ({
  children,
}) => {
  const router = useRouter()

  return (
    <div className="bg-primary min-vh-100 d-flex justify-content-center align-items-center">
      <div className="bg-white px-4 py-5 rounded-20px text-center max-width-375px w-100 shadow">
        <Image
          src="/assets/logo-text.png"
          width={133}
          height={39}
          alt="text-logo"
          onClick={() => router.push('/')}
          className="cursor-pointer"
        />
        {children}
      </div>
    </div>
  )
}

export default SingleFloatingCardLayout
