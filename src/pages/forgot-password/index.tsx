import { Field, Form, Formik, FormikHelpers } from 'formik'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Card, Container, Image, Modal } from 'react-bootstrap'
import * as Yup from 'yup'
import MyButton from '../../components/MyButton/MyButton'
import MyInput from '../../components/MyInput/MyInput'
import MyModal from '../../components/MyModal/MyModal'
import { post } from '../../libs/api'

type EmailForm = {
  email: string
}

const ForgotPasswordPage: NextPage = () => {
  const router = useRouter()
  const initialValues: EmailForm = { email: '' }
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const [isSubmitted, setIsSubmit] = useState(false)

  const sendLink = async (
    body: EmailForm,
    actions: FormikHelpers<EmailForm>
  ) => {
    try {
      if (isSubmitted) {
        setError(
          'Hệ thống vừa gửi link vào email của bạn. Vui lòng kiểm tra email và quay lại sau 5 giây'
        )
        return
      }

      post(
        '/api/auth/send-reset-password',
        {},
        {
          email: body.email,
        }
      )

      setInfo(
        'Đã gửi link dẫn tới trang đặt lại mật khẩu vào email của bạn. Vui lòng kiểm tra email'
      )
      setIsSubmit(true)
      setTimeout(() => {
        setIsSubmit(false)
      }, 5000)
    } catch (error) {
      console.log('onSignUp - error', error)
      setError((error as Error).message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const handleSignUpFormSubmit = (
    values: EmailForm,
    actions: FormikHelpers<EmailForm>
  ) => {
    if (!values.email) {
      actions.setErrors({
        email: 'Vui lòng nhập email',
      })
      actions.setSubmitting(false)
      return
    }

    sendLink(values, actions)
  }

  const PasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ'),
  })

  return (
    <Container>
      <Card className=" " style={{ marginTop: '10rem' }}>
        <Card.Header className="p-4">
          <div
            className="p-2 d-flex justify-content-center align-items-center cursor-pointer"
            onClick={() => router.push('/home')}
          >
            <Image src="/assets/logo-text.png" alt="" />
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          <h3>Quên mật khẩu</h3>
          <p className="text-muted">
            Nhập địa chỉ email mà đã đăng ký với tài khoản Quiwi. Hệ thống sẽ
            gửi đường link đặt lại mật khẩu vào email của bạn
          </p>
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
                  type="text"
                  name="email"
                  placeholder="Email"
                  as={MyInput}
                  iconClassName="bi bi-envelope"
                  className=""
                />
                {errors.email ? (
                  <div className="text-danger">{errors.email}</div>
                ) : null}

                <div className="text-center mt-3">
                  <MyButton
                    className=" fw-medium text-white"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Gửi email
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
        inActiveButtonCallback={() => setError('')}
        inActiveButtonTitle="Huỷ"
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

export default ForgotPasswordPage
