import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Card, Container, Image, Modal } from 'react-bootstrap'
import MyButton from '../../components/MyButton/MyButton'
import MyModal from '../../components/MyModal/MyModal'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get } from '../../libs/api'

const RequestVerifyPage: NextPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const auth = useAuth()

  const requestActivation = async () => {
    try {
      if (auth.getUser()?.isVerified) {
        setError('Tài khoản đã được xác thực, quay về trang chủ sau 2 giây')
        setTimeout(() => router.push('/home'), 2000)
        return
      }
      await get('/api/auth/resend-verify-email', true)
      setInfo('Đã gửi link xác thực vào email của bạn. Vui lòng kiểm tra email')
    } catch (error) {
      setError((error as Error).message)
    }
  }

  return (
    <Container className="h-100vh w-50">
      <Card className=" " style={{ marginTop: '10rem' }}>
        <Card.Header className="p-4">
          <div
            className="p-2 d-flex justify-content-center align-items-center cursor-pointer"
            onClick={() => router.push('/home')}
          >
            <Image src="/assets/logo-text.png" alt="" />
          </div>
        </Card.Header>
        <Card.Body className="p-4 text-center">
          <Card.Title>Xác thực tài khoản của bạn</Card.Title>
          <p>
            Xác thực tài khoản để có thể đặt lại mật khẩu khi chẳng may quên mật
            khẩu 👌
          </p>
          <div className="mx-auto text-center mt-3">
            <MyButton
              variant="primary"
              className="cursor-pointer text-white "
              onClick={requestActivation}
            >
              Gửi đường dẫn xác thực vào email
            </MyButton>
          </div>
        </Card.Body>
      </Card>
      <MyModal
        show={error?.length > 0}
        onHide={() => {
          setError('')
        }}
        size="lg"
        header={
          <Modal.Title className="text-danger">
            Xác thực không thành công
          </Modal.Title>
        }
      >
        <div className="text-center fw-medium fs-16px">{error}</div>
      </MyModal>

      <MyModal
        show={info?.length > 0}
        onHide={() => {
          setInfo('')
        }}
        size="lg"
        header={<Modal.Title className="text-primary">Thông báo</Modal.Title>}
      >
        <div className="text-center fw-medium fs-16px">{info}</div>
      </MyModal>
    </Container>
  )
}
export default RequestVerifyPage
