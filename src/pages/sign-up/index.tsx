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
import * as Yup from 'yup'

type SignUpForm = {
  username: string
  password: string
  name: string
  email?: string
}

const SignUpPage: NextPage = () => {
  const router = useRouter()
  const initialValues: SignUpForm = {
    username: '',
    password: '',
    name: '',
    email: undefined,
  }
  const authNavigate = useAuth()
  const [error, setError] = useState('')

  const onSignUp = async (
    body: SignUpForm,
    actions: FormikHelpers<SignUpForm>
  ) => {
    try {
      const res: TApiResponse<TUser> = await post('/api/auth/signup', {}, body)
      authNavigate.setUser(res.response)
      await authNavigate.toPrevRoute()
    } catch (error) {
      console.log('onSignUp - error', error)
      setError((error as Error).message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const handleSignUpFormSubmit = (
    values: SignUpForm,
    actions: FormikHelpers<SignUpForm>
  ) => {
    onSignUp(values, actions)
  }

  const ProfileSchema = Yup.object().shape({
    username: Yup.string()
      .min(6, 'Tên tài khoản phải có ít nhất 6 ký tự')
      .max(50, 'Tên tài khoản tối đa 50 ký tự'),
    email: Yup.string().email('Email không hợp lệ'),
    password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  })

  return (
    <SingleFloatingCardLayout>
      <div className="py-32px fs-32px fw-medium">Đăng ký</div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSignUpFormSubmit}
        validationSchema={ProfileSchema}
      >
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
            />
            {errors.username ? (
              <div className="text-danger text-start">{errors.username}</div>
            ) : null}
            <Field
              type="text"
              name="name"
              placeholder="Họ và tên"
              as={MyInput}
              iconClassName="bi bi-card-text"
              className="mt-3"
            />

            <Field
              type="text"
              name="email"
              placeholder="Email"
              as={MyInput}
              iconClassName="bi bi-envelope"
              className="mt-3"
            />
            {errors.email ? (
              <div className="text-danger text-start">{errors.email}</div>
            ) : null}
            <Field
              type="password"
              name="password"
              placeholder="Mật khẩu"
              as={MyInput}
              iconClassName="bi bi-unlock"
              className="mt-3"
            />
            {errors.password ? (
              <div className="text-danger text-start">{errors.password}</div>
            ) : null}
            <MyButton
              className="w-100 fw-medium text-white mt-3"
              type="submit"
              disabled={isSubmitting}
            >
              Đăng ký
            </MyButton>
          </Form>
        )}
      </Formik>

      <div className="text-secondary pt-4">
        <div onClick={() => router.push('/sign-in')}>
          Đã có tài khoản?{' '}
          <span className="text-primary cursor-pointer fw-medium">
            Đăng nhập
          </span>
        </div>
      </div>

      <MyModal
        show={error.length > 0}
        onHide={() => setError('')}
        size="sm"
        header={
          <Modal.Title className="text-danger">Đăng ký thất bại</Modal.Title>
        }
        inActiveButtonCallback={() => setError('')}
        inActiveButtonTitle="Huỷ"
      >
        <div className="text-center">{error}</div>
      </MyModal>
    </SingleFloatingCardLayout>
  )
}

export default SignUpPage
