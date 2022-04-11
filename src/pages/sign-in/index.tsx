import { NextPage } from 'next'
import Image from 'next/image'
import React from 'react'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'

const SignInPage: NextPage = () => {
  return (
    <div className="bg-primary min-vh-100 d-flex justify-content-center align-items-center">
      <div className="bg-white px-4 py-5 rounded-20px text-center max-width-375px w-100 shadow">
        <Image
          src="/assets/logo-text.png"
          width={133}
          height={39}
          alt="text-logo"
        />

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
          placeholder="Password"
          iconClassName="bi bi-unlock"
        />

        <MyButton className="w-100 fw-medium text-white">Đăng nhập</MyButton>

        <div className="text-secondary pt-4">
          <div className="pb-3 cursor-pointer fw-medium">Quên mật khẩu</div>
          <div>
            Chưa có tài khoản?{' '}
            <span className="text-primary cursor-pointer fw-medium">Đăng ký ngay</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
