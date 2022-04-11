import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import SingleFloatingCardLayout from '../../components/SingleFloatingCardLayout/SingleFloatingCardLayout'

const SignInPage: NextPage = () => {
  const router = useRouter()

  return (
    <SingleFloatingCardLayout>
      <div className="py-32px fs-32px fw-medium">Đăng nhập</div>

      <MyInput
        className="mb-3"
        type="text"
        placeholder="Email"
        iconClassName="bi bi-at"
      />
      <MyInput
        className="mb-3"
        type="password"
        placeholder="Mật khẩu"
        iconClassName="bi bi-unlock"
      />

      <MyButton className="w-100 fw-medium text-white">Đăng nhập</MyButton>

      <div className="text-secondary pt-4">
        <div className="pb-3 cursor-pointer fw-medium">Quên mật khẩu</div>
        <div onClick={() => router.push('/sign-up')}>
          Chưa có tài khoản?{' '}
          <span className="text-primary cursor-pointer fw-medium">
            Đăng ký ngay
          </span>
        </div>
      </div>
    </SingleFloatingCardLayout>
  )
}

export default SignInPage
