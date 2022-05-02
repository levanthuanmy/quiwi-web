import { Field, Form, Formik, FormikHelpers } from 'formik'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { userState } from '../../atoms/auth'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import SingleFloatingCardLayout from '../../components/SingleFloatingCardLayout/SingleFloatingCardLayout'
import { useAuthNavigation } from '../../hooks/useAuthNavigation/useAuthNavigation'
import { post } from '../../libs/api'
import { TApiResponse, TUser } from '../../types/types'

type SignInForm = {
  username: string
  password: string
}
const SignInPage: NextPage = () => {
  const router = useRouter()
  const initialValues: SignInForm = { username: '', password: '' }
  const setUser = useSetRecoilState(userState)
  const authNavigate = useAuthNavigation()

  const onSignIn = async (
    body: SignInForm,
    actions: FormikHelpers<SignInForm>
  ) => {
    try {
      const res: TApiResponse<TUser> = await post('/api/auth/login', {}, body)
      setUser(res.response)
      authNavigate.toPrevRoute()
    } catch (error) {
      console.log('onSignUp - error', error)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const handleSignInFormSubmit = (
    values: SignInForm,
    actions: FormikHelpers<SignInForm>
  ) => {
    onSignIn(values, actions)
  }

  return (
    <SingleFloatingCardLayout>
      <div className="py-32px fs-32px fw-medium">Đăng nhập</div>

      <Formik initialValues={initialValues} onSubmit={handleSignInFormSubmit}>
        {({
          // values,
          // errors,
          // touched,
          // handleChange,
          // handleBlur,
          // handleSubmit,
          isSubmitting,
        }) => (
          <Form>
            <Field
              type="text"
              name="username"
              placeholder="Tên tài khoản"
              as={MyInput}
              iconClassName="bi bi-person"
              className="mb-3"
            />
            <Field
              type="password"
              name="password"
              placeholder="Mật khẩu"
              as={MyInput}
              iconClassName="bi bi-unlock"
              className="mb-3"
            />

            <MyButton
              className="w-100 fw-medium text-white"
              type="submit"
              disabled={isSubmitting}
            >
              Đăng nhập
            </MyButton>
          </Form>
        )}
      </Formik>

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
