import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import SingleFloatingCardLayout from '../../components/SingleFloatingCardLayout/SingleFloatingCardLayout'

const SignUpPage: NextPage = () => {
  const router = useRouter()
  return (
    <SingleFloatingCardLayout>
      <div className="py-32px fs-32px fw-medium">Đăng ký</div>

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
      <MyInput
        className="mb-3"
        type="password"
        placeholder="Xác nhận mật khẩu"
        iconClassName="bi bi-unlock"
      />

      <MyButton className="w-100 fw-medium text-white">Đăng ký</MyButton>

      <div className="text-secondary pt-4">
        <div onClick={() => router.push('/sign-in')}>
          Đã có tài khoản?{' '}
          <span className="text-primary cursor-pointer fw-medium">
            Đăng nhập
          </span>
        </div>
      </div>
    </SingleFloatingCardLayout>
  )
}

export default SignUpPage
