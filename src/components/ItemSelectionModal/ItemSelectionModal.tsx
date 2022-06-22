/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'
import { Col, Image, Modal, Row } from 'react-bootstrap'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TUser,
  TUserItems,
  TUserProfile,
  TUserBadge,
  TBadge,
} from '../../types/types'
import MyButton from '../MyButton/MyButton'
import MyTabBar from '../MyTabBar/MyTabBar'
import { AvatarList } from './AvatarList'
import { BackgroundList } from './BackgroundList'
import { BadgeList } from './BadgeList'
import { LeftProfileDisplay } from './LeftProfileDisplay'
type MyModalProps = {
  show: boolean
  onHide: () => void
  user: TUser
  userProfile: TUserProfile
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
const UserItemSelectionModal: FC<MyModalProps> = ({
  show,
  onHide,
  user,
  userProfile,
}) => {
  const [avatarItems, setAvatarItems] = useState<TUserItems[]>()
  const [backgroundItems, setBackgroundItems] = useState<TUserItems[]>()
  const [badges, setBadges] = useState<TUserBadge[]>()
  const [currentBadge, setCurrentBadge] = useState<TBadge>()

  const [itemIdChosen, setChoose] = useState<number>()
  const [currentTab, setCurrentTab] = useState<number>(0)
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

  const getBackgroundItems = async () => {
    try {
      if (user) {
        const param = {
          type: 'Hình nền',
        }
        const res = await get<TApiResponse<TUserItems[]>>(
          `/api/users/user/${user.id}/items`,
          true,
          param
        )
        if (res.response) {
          setBackgroundItems(res.response)
        }
      }
    } catch (error) {
      alert((error as Error).message)
    }
  }

  const getBadges = async () => {
    try {
      const res = await get<TApiResponse<TUserBadge[]>>(
        '/api/users/badges',
        true,
        {}
      )

      if (res?.response) {
        setBadges(res.response)
      }
    } catch (error) {
      console.log('==== ~ getBadges ~ error', error)
    }
  }

  const getCurrentBadge = async () => {
    try {
      const res = await get<TApiResponse<TBadge>>(
        '/api/users/current-badge',
        true,
        {}
      )

      if (res?.response) {
        setCurrentBadge(res.response)
      }
    } catch (error) {
      console.log('==== ~ getBadges ~ error', error)
    }
  }

  const setNewCurrentBadge = async (userBadge: TUserBadge) => {
    try {
      if (userBadge.status === 'INPROGRESS') {
        alert('Chưa hoàn thành')
        return
      }
      if (userBadge.isCurrent) {
        return
      }
      const res = await get(`/api/users/set-badge/${userBadge.badge.id}`, true)
      console.log('==== ~ setCurrentBadge ~ res', res)
    } catch (error) {
      console.log('==== ~ setCurrentBadge ~ error', error)
    }
  }

  useEffect(() => {
    getAvatarItems()
    getBackgroundItems()
    getBadges()
    getCurrentBadge()
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
      <Modal.Body>
        <Row className="h-100">
          {/* Ở đây sẽ để badge các thứ như liên minh */}
          <Col
            xs={5}
            sm={4}
            lg={3}
            xl={2}
            className="d-flex align-items-center flex-column justify-content-center border-end border-2 p-4"
          >
            <LeftProfileDisplay
              avatar={user.avatar}
              currentBadge={currentBadge}
              displayName={user.name || user.username}
            />
          </Col>
          <Col className="w-100">
            <MyTabBar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              tabs={tabs.map((tab) => tab.showType)}
            />
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
              {currentTab === 0 ? (
                <AvatarList
                  avatarItems={avatarItems}
                  itemIdChosen={itemIdChosen}
                  setChoose={setChoose}
                />
              ) : currentTab === 1 ? (
                <BadgeList
                  userBadges={badges}
                  setCurrentBadge={setNewCurrentBadge}
                />
              ) : currentTab === 2 ? (
                <BackgroundList
                  backgroundItems={backgroundItems}
                  itemIdChosen={itemIdChosen}
                />
              ) : null}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Row className="justify-content-center p-3">
        <Col xs="12" md={4} lg={3}>
          <MyButton className="text-white w-100" onClick={onHide}>
            Đóng
          </MyButton>
        </Col>
      </Row>
    </Modal>
  )
}

export default UserItemSelectionModal
