import { useRouter } from 'next/router'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Row, Col, Modal, Image } from 'react-bootstrap'
import { get } from '../../../libs/api'
import {
  TApiResponse,
  TFollowUsers,
  TPaginationResponse,
  TUserProfile,
} from '../../../types/types'
import MyModal from '../../MyModal/MyModal'
type TModalHandler = {
  show: boolean
  contentType: TContentType
}

type TContentType = 'FOLLOWERS' | 'FOLLOWINGS'

type SummaryInfoProps = {
  userResponse: TUserProfile
  followers: TFollowUsers[]
  followings: TFollowUsers[]
}

const SummaryInfo: FC<SummaryInfoProps> = ({
  userResponse,
  followers,
  followings,
}) => {
  const [modalHandler, setModalHandler] = useState<TModalHandler>({
    show: false,
    contentType: 'FOLLOWERS',
  })

  const [followingUsers, setFollowingUsers] =
    useState<TPaginationResponse<TFollowUsers>>()
  const [followerUsers, setFollowerUsers] =
    useState<TPaginationResponse<TFollowUsers>>()

  const getFollowersUsers = async () => {
    try {
      const params = {
        filter: { relations: ['user'] },
      }
      const res: TApiResponse<TPaginationResponse<TFollowUsers>> = await get(
        `/api/users/user/${userResponse.user?.id}/followers`,
        true,
        params
      )

      setFollowerUsers(res.response)
    } catch (error) {
      console.log('getFollowersUsers - error', error)
    }
  }

  const getFollowingUsers = async () => {
    try {
      const params = {
        filter: { relations: ['followingUser'] },
      }
      const res: TApiResponse<TPaginationResponse<TFollowUsers>> = await get(
        `/api/users/user/${userResponse.user?.id}/following`,
        true,
        params
      )

      setFollowingUsers(res.response)
    } catch (error) {
      console.log('getFollowingUsers - error', error)
    }
  }
  useEffect(() => {
    onHideModal()
  }, [])

  const onHideModal = () => {
    setModalHandler((prev) => ({ ...prev, show: false }))
  }

  const modalContent: Record<TContentType, ReactNode> = {
    FOLLOWERS: (
      <>
        {followerUsers?.items.length ? (
          followerUsers.items.map((follower, key) => (
            <ItemFollowUser
              key={key}
              followUser={follower}
              onHideModal={onHideModal}
            />
          ))
        ) : (
          <div>Chưa có ai theo dõi</div>
        )}
      </>
    ),
    FOLLOWINGS: (
      <>
        {followingUsers?.items.length ? (
          followingUsers.items.map((following, key) => (
            <ItemFollowUser
              key={key}
              followUser={following}
              onHideModal={onHideModal}
            />
          ))
        ) : (
          <div>Chưa theo dõi ai</div>
        )}
      </>
    ),
  }

  return (
    <>
      <Row className="mx-0 mt-3">
        <Col className="p-0 d-flex gap-2 align-items-center">
          <div
            className="shadow-sm d-flex justify-content-center align-items-center rounded-14px"
            style={{ width: 45, height: 45 }}
          >
            <i className="bi bi-trophy-fill" />
          </div>
          <div>
            <div className="fs-24px line-height-normal fw-medium">
              {userResponse?.badges.length}
            </div>
            <div className="text-secondary fs-14px d-none d-md-block">
              Danh Hiệu
            </div>
          </div>
        </Col>

        <Col
          className="p-0 d-flex gap-2 align-items-center cursor-pointer"
          onClick={() => {
            getFollowersUsers()
            setModalHandler({ show: true, contentType: 'FOLLOWERS' })
          }}
        >
          <div
            className="shadow-sm d-flex justify-content-center align-items-center rounded-14px"
            style={{ width: 45, height: 45 }}
          >
            <i className="bi bi-people-fill fs-18px" />
          </div>
          <div>
            <div className="fs-24px line-height-normal fw-medium">
              {followers?.length}
            </div>
            <div className="text-secondary fs-14px d-none d-md-block">
              Lượt Theo Dõi
            </div>
          </div>
        </Col>

        <Col
          className="p-0 d-flex gap-2 align-items-center cursor-pointer"
          onClick={() => {
            getFollowingUsers()
            setModalHandler({ show: true, contentType: 'FOLLOWINGS' })
          }}
        >
          <div
            className="shadow-sm d-flex justify-content-center align-items-center rounded-14px"
            style={{ width: 45, height: 45 }}
          >
            <i className="bi bi-person-heart fs-18px" />
          </div>
          <div>
            <div className="fs-24px line-height-normal fw-medium">
              {followings?.length}
            </div>
            <div className="text-secondary fs-14px d-none d-md-block">
              Đang Theo Dõi
            </div>
          </div>
        </Col>
      </Row>

      <MyModal
        onHide={onHideModal}
        show={modalHandler.show}
        header={<Modal.Title>Đang Theo Dõi</Modal.Title>}
      >
        {modalContent[modalHandler.contentType]}
      </MyModal>
    </>
  )
}

export default SummaryInfo

const ItemFollowUser: FC<{
  followUser: TFollowUsers
  onHideModal: () => void
}> = ({ followUser, onHideModal }) => {
  const router = useRouter()
  const user = followUser.followingUser ?? followUser.user
  return (
    <div
      className="btn btn-outline-light mb-3 d-flex align-items-center gap-2 rounded-14px"
      onClick={() => {
        onHideModal()
        router.push(`/users/${user?.id}`)
      }}
    >
      <div>
        {user?.avatar?.length ? (
          <Image
            src={user?.avatar}
            alt=""
            width={30}
            height={30}
            className="object-fit-cover rounded-circle"
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center bg-secondary rounded-circle"
            style={{ width: 30, height: 30 }}
          >
            <div className="bi bi-person-fill text-white" />
          </div>
        )}
      </div>

      <div className="text-start">
        <div className="fw-medium text-black">
          {user?.name || followUser.user?.name || 'Chưa đặt tên'}
        </div>
        <div className="fs-14px text-secondary">
          @{user?.username || followUser.user?.username}
        </div>
      </div>
    </div>
  )
}
