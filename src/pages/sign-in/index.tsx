import { Field, Form, Formik, FormikHelpers } from 'formik'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import MyModal from '../../components/MyModal/MyModal'
import SingleFloatingCardLayout from '../../components/SingleFloatingCardLayout/SingleFloatingCardLayout'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { post } from '../../libs/api'
import { TApiResponse, TUser } from '../../types/types'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'

type SignInForm = {
  username: string
  password: string
}
const SignInPage: NextPage = () => {
  const router = useRouter()
  const initialValues: SignInForm = { username: '', password: '' }
  const authContext = useAuth()
  const [error, setError] = useState('')

  const onSignIn = async (
    body: SignInForm,
    actions: FormikHelpers<SignInForm>
  ) => {
    try {
      const res: TApiResponse<TUser> = await post('/api/auth/login', {}, body)
      authContext.setUser(res.response)
      await authContext.toPrevRoute()
    } catch (error) {
      console.log('onSignUp - error', error)
      setError((error as Error).message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const responseGoogle = async (response: CredentialResponse) => {
    try {
      const res = await post<TApiResponse<TUser>>(
        '/api/auth/redirect/google',
        {},
        {
          token: response.credential,
        }
      )
      authContext.setUser(res.response)
      await authContext.toPrevRoute()
    } catch (error) {
      console.log('==== ~ responseGoogle ~ error', error)
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
          errors,
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
            {errors.username ? (
              <div className="text-danger text-start">{errors.username}</div>
            ) : null}
            <Field
              type="password"
              name="password"
              placeholder="Mật khẩu"
              as={MyInput}
              iconClassName="bi bi-unlock"
              className="mb-3"
            />
            {errors.password ? (
              <div className="text-danger text-start">{errors.password}</div>
            ) : null}
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
        <div
          className="pb-3 cursor-pointer fw-medium"
          onClick={() => router.push('/forgot-password')}
        >
          Quên mật khẩu
        </div>
        <div onClick={() => router.push('/sign-up')}>
          Chưa có tài khoản?{' '}
          <span className="text-primary cursor-pointer fw-medium">
            Đăng ký ngay
          </span>
        </div>
        <div className="mt-2 mx-auto text-center">
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
              console.log('Login Failed')
            }}
          />
        </div>
      </div>

      <MyModal
        show={error?.length > 0}
        onHide={() => setError('')}
        size="sm"
        header={
          <Modal.Title className="text-danger fs-18px fw-medium">
            Đăng nhập thất bại
          </Modal.Title>
        }
        inActiveButtonCallback={() => setError('')}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center">{error}</div>
      </MyModal>
    </SingleFloatingCardLayout>
  )
}

export default SignInPage
