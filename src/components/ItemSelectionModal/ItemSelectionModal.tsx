/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'
import { Col, Image, Modal, Row } from 'react-bootstrap'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import { TApiResponse, TUser, TUserItems } from '../../types/types'
import MyButton from '../MyButton/MyButton'
import MyTabBar from '../MyTabBar/MyTabBar'
import { AvatarList } from './AvatarList'

type MyModalProps = {
  show: boolean
  onHide: () => void
  user: TUser
}

const tabs = [
  {
    showType: 'Ảnh đại diện',
  },
  {
    showType: 'Danh hiệu',
  },
  {
    showType: 'Ảnh nền',
  },
]
const UserItemSelectionModal: FC<MyModalProps> = ({ show, onHide, user }) => {
  const [avatarItems, setAvatarItems] = useState<TUserItems[]>()
  const [itemIdChosen, setChoose] = useState<number>()
  const [currentTab, setCurrentTab] = useState<number>(0)

  const auth = useAuth()
  const getAvatarItems = async () => {
    try {
      if (user) {
        const param = {
          type: 'Ảnh đại diện',
        }
        const res = await get<TApiResponse<TUserItems[]>>(
          `/api/users/user/${user.id}/items`,
          true,
          param
        )
        if (res.response) {
          setAvatarItems(res.response)
        }
      }
    } catch (error) {
      console.log('==== ~ getAvatarItems ~ error', error)

      alert((error as Error).message)
    }
  }

  useEffect(() => {
    getAvatarItems()
  }, [user])

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="rounded-20px overflow-hidden"
      size="xl"
      fullscreen={true}
    >
      <Modal.Body className="d-flex">
        {/* Ở đây sẽ để badge các thứ như liên minh */}
        <div className="d-flex align-items-center flex-column justify-content-center border-end border-2 p-4">
          <Image
            alt="avatar"
            src={user.avatar || '/assets/default-logo.png'}
            width={124}
            height={124}
            className="rounded-circle"
          />
          <div className="pt-2 fw-medium">{user.name || user.username}</div>
        </div>
        <div className="w-100">
          <MyTabBar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabs={tabs.map((tab) => tab.showType)}
          />
          <div className="d-flex flex-wrap">
            {currentTab === 0 ? (
              <AvatarList
                avatarItems={avatarItems}
                itemIdChosen={itemIdChosen}
                setChoose={setChoose}
              />
            ) : null}
          </div>
        </div>
      </Modal.Body>
      <Row className="justify-content-center p-3">
        <Col xs="3">
          <MyButton className="text-white w-100" onClick={onHide}>
            Cập nhật
          </MyButton>
        </Col>
      </Row>
    </Modal>
  )
}

export default UserItemSelectionModal
