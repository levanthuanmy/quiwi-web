import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Modal, Card, Image } from 'react-bootstrap'
import MyButton from '../../components/MyButton/MyButton'
import MyModal from '../../components/MyModal/MyModal'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import { TApiResponse, TUser } from '../../types/types'
// import MyModal

const VerifyPage: NextPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  // const token = (router.query['token'] as string | null)?.replace(/' '/g, '+')
  const queryString = router.asPath.split('?')
  const queryObj = queryString[1]
    ?.split('&')
    ?.reduce<Map<string, string>>((prev, curr) => {
      const [key, value] = curr.split('=')
      prev.set(key, value)
      return prev
    }, new Map())

  const token = queryObj?.get('token') ?? ""
  const auth = useAuth()

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const params = {
          token,
        }
        const res = await post<TApiResponse<TUser>>(
          '/api/auth/verify',
          params,
          {},
          true
        )
        auth?.setUser(res.response)
        setInfo(
          'Kích hoạt thành công. Hệ thống sẽ tự quay về trang chủ sau 5 giây'
        )
        setTimeout(() => router.push('/home'), 5000)
      } catch (error) {
        setError((error as Error).message)
      }
    }

    if (router.isReady) {
      if (!token) {
        setError('Tham số không hợp lệ')
        setTimeout(() => router.replace('/home'), 2000)
      } else {
        verifyAccount()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, token])

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
    <Container className="h-100vh ">
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
          <Card.Title>Xác thực tài khoản của bạn</Card.Title>
          <p>Không nhận được đường dẫn? Vui lòng ấn nút bên dưới</p>
          <div className="mx-auto text-center">
            <MyButton
              variant="primary"
              className="cursor-pointer text-white "
              onClick={requestActivation}
            >
              Gửi lại đường dẫn
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
        onHide={() => {}}
        size="lg"
        header={<Modal.Title className="text-primary">Thông báo</Modal.Title>}
      >
        <div className="text-center fw-medium fs-16px">{info}</div>
      </MyModal>
    </Container>
  )
}
export default VerifyPage
