import { Field, Form, Formik, FormikHelpers } from 'formik'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import SingleFloatingCardLayout from '../../components/SingleFloatingCardLayout/SingleFloatingCardLayout'

type SignUpForm = {
  username: string
  password: string
}

const SignUpPage: NextPage = () => {
  const router = useRouter()
  const initialValues: SignUpForm = { username: '', password: '' }

  const onSignUp = async (
    body: SignUpForm,
    actions: FormikHelpers<SignUpForm>
  ) => {
    try {
      const res = await fetch(`http://quiwi.games:3000/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      console.log('res', await res.json())
    } catch (error) {
      console.log('onSignUp - error', error)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const handleSignUpFormSubmit = (
    values: SignUpForm,
    actions: FormikHelpers<SignUpForm>
  ) => {
    console.log('values', JSON.stringify(values))
    onSignUp(values, actions)
  }

  return (
    <SingleFloatingCardLayout>
      <div className="py-32px fs-32px fw-medium">Đăng ký</div>
      <Formik initialValues={initialValues} onSubmit={handleSignUpFormSubmit}>
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
            {/* <Field
              type="text"
              name="password"
              placeholder="Xác nhận mật khẩu"
              as={MyInput}
              iconClassName="bi bi-unlock"
            /> */}

            <MyButton
              className="w-100 fw-medium text-white"
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
    </SingleFloatingCardLayout>
  )
}

export default SignUpPage
