import classNames from 'classnames'
import router from 'next/router'
import React, { FC, memo, ReactNode, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import { TApiResponse, TQuiz, TQuizBodyRequest } from '../../types/types'
import { HOME_MENU_OPTIONS } from '../../utils/constants'
import MenuBar from '../MenuBar/MenuBar'
import MyButton from '../MyButton/MyButton'
import MyInput from '../MyInput/MyInput'
import MyModal from '../MyModal/MyModal'
import NavBar from '../NavBar/NavBar'
import styles from './DashboardLayout.module.css'

type DashboardLayoutProps = {
  children?: ReactNode
}
const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [isExpand, setIsExpand] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [invitationCode, setInvitationCode] = useState<string>('')
  const [invitationInputError, setInvitationInputError] = useState<string>('')
  const auth = useAuth()
  const user = auth.getUser()
  const onToQuizCreator = async () => {
    try {
      if (!user) {
        router.push(`/sign-in`)
        return
      }
      const body: TQuizBodyRequest = {
        title: 'Quiz chưa có tên',
        description: '',
        isPublic: false,
        isLocked: false,
        numPlayed: 0,
        numUpvotes: 0,
        numDownvotes: 0,
        questions: [],
      }
      const res = await post<TApiResponse<TQuiz>>(
        `/api/quizzes`,
        {},
        body,
        true
      )

      router.push(`/quiz/creator/${res.response.id}`)
    } catch (error) {
      console.log('handleToQuizCreator - error', error)
    }
  }

  const onJoinRoom = async () => {
    if (invitationCode.trim().length === 0) {
      setInvitationInputError('Vui lòng nhập mã phòng')
      return
    }

    const res: TApiResponse<any> = await get(
      `/api/games/check-room/${invitationCode}`,
      false
    )
    if (res.response) {
      await router.push(`/lobby/join?invitationCode=${invitationCode}`)
    } else {
      setInvitationInputError('Phòng không tồn tại')
    }
  }

  return (
    <>
      <NavBar
        isExpand={isExpand}
        setIsExpand={setIsExpand}
        onToQuizCreator={onToQuizCreator}
        onShowJoinQuiz={() => setShowModal(true)}
      />
      <div className="d-flex min-vh-100" style={{ paddingTop: 80 }}>
        <MenuBar
          isExpand={isExpand}
          menuOptions={HOME_MENU_OPTIONS}
          onToQuizCreator={onToQuizCreator}
          onShowJoinQuiz={() => setShowModal(true)}
        />
        <div className={classNames('w-100 ps-0', styles.padOnSma)}>
          {children}
        </div>
      </div>

      <MyModal
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setInvitationInputError('')
        }}
        header={<Modal.Title>Tham gia một game</Modal.Title>}
        size="sm"
      >
        <div className="d-flex flex-column gap-3">
          <MyInput
            className={'pb-12px'}
            errorText={invitationInputError}
            placeholder="Nhập mã tham gia"
            onChange={(e) => {
              setInvitationInputError('')
              setInvitationCode(e.target.value)
            }}
          />
          <MyButton
            className={`mt-4 fw-medium text-white text-nowrap`}
            onClick={onJoinRoom}
          >
            Vào phòng ngay
          </MyButton>
        </div>
      </MyModal>
    </>
  )
}

export default memo(DashboardLayout)
