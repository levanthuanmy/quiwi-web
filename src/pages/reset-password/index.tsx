import { Field, Form, Formik, FormikHelpers, setIn } from 'formik'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Card, Container, Image, Modal } from 'react-bootstrap'
import * as Yup from 'yup'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import MyModal from '../../components/MyModal/MyModal'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { post } from '../../libs/api'
import { TApiResponse, TUser } from '../../types/types'

type ResetPasswordForm = {
  password: string
  confirmPassword: string
}

const ResetPaswordPage: NextPage = () => {
  const router = useRouter()
  const initialValues: ResetPasswordForm = { password: '', confirmPassword: '' }
  const authContext = useAuth()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const { token } = router.query

  useEffect(() => {
    if (router.isReady) {
      console.log(window.location.search)
      if (!token) {
        setError(
          'Tham số không hợp lệ. Hệ thống tự quay về trang chủ sau 2 giây'
        )
        setTimeout(() => router.replace('/'), 2000)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, token])
  const onResetPassword = async (
    body: ResetPasswordForm,
    actions: FormikHelpers<ResetPasswordForm>
  ) => {
    if (!body.password || !body.confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu')
      return
    }
    try {
      const res: TApiResponse<TUser> = await post(
        '/api/auth/reset-password',
        {
          token,
        },
        {
          password: body.password,
        },
        false
      )
      authContext.signOut()
      setInfo(
        'Đặt lại mật khẩu thành công. Hệ thống chuyển sang trang đăng nhập sau 2 giây'
      )
      setTimeout(() => router.replace('/'), 2000)
    } catch (error) {
      console.log('onSignUp - error', error)
      setError((error as Error).message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const handleSignUpFormSubmit = (
    values: ResetPasswordForm,
    actions: FormikHelpers<ResetPasswordForm>
  ) => {
    if (!values.confirmPassword || !values.password) {
      actions.setErrors({
        confirmPassword: 'Vui lòng nhập mật khẩu',
        password: 'Vui lòng nhập mật khẩu',
      })
      actions.setSubmitting(false)
      return
    }
    if (values.confirmPassword !== values.password) {
      actions.setErrors({
        confirmPassword: 'Mật khẩu không trùng khớp',
        password: 'Mật khẩu không trùng khớp',
      })
      actions.setSubmitting(false)

      return
    }
    onResetPassword(values, actions)
  }

  const PasswordSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  })

  return (
    <Container>
      <Card className=" " style={{ marginTop: '10rem' }}>
        <Card.Header className="p-4">
          <div
            className="p-2 d-flex justify-content-center align-items-center cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image src="/assets/logo-text.png" alt="" />
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          <h3>Nhập lại mật khẩu mới</h3>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSignUpFormSubmit}
            validationSchema={PasswordSchema}
          >
            {({
              // values,
              errors,
              // touched,
              // handleChange,
              // handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  as={MyInput}
                  iconClassName="bi bi-unlock"
                  className=""
                />
                {errors.password ? (
                  <div className="text-danger">{errors.password}</div>
                ) : null}
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  as={MyInput}
                  iconClassName="bi bi-unlock"
                  className="mt-3"
                />
                {errors.confirmPassword ? (
                  <div className="text-danger">{errors.confirmPassword}</div>
                ) : null}
                <div className="text-center mt-3">
                  <MyButton
                    className=" fw-medium text-white"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Đặt lại mật khẩu
                  </MyButton>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>

      <MyModal
        show={error.length > 0}
        onHide={() => setError('')}
        size="sm"
        header={<Modal.Title className="text-danger">Thông báo</Modal.Title>}
      >
        <div className="text-center">{error}</div>
      </MyModal>
      <MyModal
        show={info?.length > 0}
        onHide={() => {
          setInfo('')
        }}
        size="lg"
        header={<Modal.Title className="text-primary">Thông báo</Modal.Title>}
        activeButtonCallback={() => {
          setInfo('')
        }}
        activeButtonTitle="Đồng ý"
      >
        <div className="text-center fw-medium fs-16px">{info}</div>
      </MyModal>
    </Container>
  )
}

export default ResetPaswordPage
