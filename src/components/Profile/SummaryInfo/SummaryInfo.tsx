import { useRouter } from 'next/router'
import React, { FC, ReactNode, useState } from 'react'
import { Row, Col, Modal, Image } from 'react-bootstrap'
import { TFollowUsers, TUserProfile } from '../../../types/types'
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

  const onHideModal = () => {
    setModalHandler((prev) => ({ ...prev, show: false }))
  }

  const modalContent: Record<TContentType, ReactNode> = {
    FOLLOWERS: (
      <>
        {followers?.length ? (
          followers.map((follower, key) => (
            <ItemFollowUser key={key} followUser={follower} />
          ))
        ) : (
          <div>Bạn chưa được ai theo dõi</div>
        )}
      </>
    ),
    FOLLOWINGS: (
      <>
        {followings?.length ? (
          followings.map((following, key) => (
            <ItemFollowUser key={key} followUser={following} />
          ))
        ) : (
          <div>Bạn chưa theo dõi ai</div>
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
          onClick={() =>
            setModalHandler({ show: true, contentType: 'FOLLOWERS' })
          }
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
          onClick={() =>
            setModalHandler({ show: true, contentType: 'FOLLOWINGS' })
          }
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
        header={<Modal.Title>Lượt Theo Dõi</Modal.Title>}
      >
        {modalContent[modalHandler.contentType]}
      </MyModal>
    </>
  )
}

export default SummaryInfo

const ItemFollowUser: FC<{ followUser: TFollowUsers }> = ({ followUser }) => {
  const router = useRouter()
  return (
    <div
      className="btn btn-outline-light mb-3 d-flex align-items-center gap-2 rounded-14px"
      onClick={() => router.push(`/users/${followUser.id}`)}
    >
      <div>
        {followUser.followingUser?.avatar?.length ? (
          <Image
            src={followUser.followingUser?.avatar}
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
          {followUser.followingUser?.name || 'Chưa đặt tên'}
        </div>
        <div className="fs-14px text-secondary">
          @{followUser.followingUser?.username}
        </div>
      </div>
    </div>
  )
}
