import { Field, Form, Formik, FormikHelpers } from 'formik'
import { FC, memo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import { post } from '../../../libs/api'
import { TApiResponse, TUser } from '../../../types/types'
import MyButton from '../../MyButton/MyButton'
import MyInput from '../../MyInput/MyInput'
import MyModal from '../../MyModal/MyModal'
import SignUpModal from '../SignUpModal/SignUpModal'

type SignInForm = {
  username: string
  password: string
}
const SignInModal: FC = () => {
  const authContext = useAuth()
  const initialValues: SignInForm = { username: '', password: '' }
  const { addToast } = useToasts()
  const [showSignUp, setShowSignUp] = useState<boolean>(false)

  const onSignIn = async (
    body: SignInForm,
    actions: FormikHelpers<SignInForm>
  ) => {
    try {
      const res: TApiResponse<TUser> = await post('/api/auth/login', {}, body)
      authContext.setUser(res.response)
      authContext.setSignInModalHandler(false)
      addToast('Đăng nhập thành công', {
        appearance: 'success',
      })
    } catch (error) {
      console.log('onSignUp - error', error)
      addToast((error as Error).message ?? 'Đăng nhập thất bại', {
        appearance: 'error',
      })
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
    <MyModal
      show={authContext.signInModalHandler}
      onHide={() => authContext.setSignInModalHandler(false)}
      header={<Modal.Title>Đăng nhập</Modal.Title>}
    >
      {showSignUp ? (
        <SignUpModal setShow={setShowSignUp}/>
      ) : (
        <>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSignInFormSubmit}
          >
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
          <div className="text-secondary pt-4 text-center">
            <div onClick={() => setShowSignUp(true)}>
              Chưa có tài khoản?{' '}
              <span className="text-primary cursor-pointer fw-medium">
                Đăng ký ngay
              </span>
            </div>
          </div>
        </>
      )}
    </MyModal>
  )
}

export default memo(SignInModal)
