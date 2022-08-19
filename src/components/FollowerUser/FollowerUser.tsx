import _ from 'lodash'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { Col, Image } from 'react-bootstrap'
import { TFollowUsers, TPaginationResponse } from '../../types/types'
import FollowUserModal from '../FollowUsersModal/FollowUserModal'

const FollowerUser: FC<{
  followerUsers: TPaginationResponse<TFollowUsers> | undefined
}> = ({ followerUsers: followingUsers }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const router = useRouter()

  const renderList = () => {
    if (followingUsers?.items.length === 0) {
      return <div>Chưa có người theo dõi</div>
    }
    return followingUsers?.items.map((user, idx) => {
      return (
        <div
          key={idx}
          className="d-flex align-items-center justify-content-between py-1"
        >
          <div
            key={idx}
            onClick={() => {
              setShowModal(false)
              router.push(`/users/${user.user?.id}`)
            }}
          >
            <div className="d-flex align-items-center cursor-pointer">
              <div className="pe-2">
                <Image
                  src={user.user?.avatar || '/assets/default-avatar.png'}
                  fluid={true}
                  width={30}
                  height={30}
                  alt="avatar"
                  className="rounded-circle"
                />
              </div>
              <div>
                <div className="fw-medium line-height-normal fs-14px">
                  {user.user?.username ?? ''}
                </div>
                <div className="line-height-normal fs-14px">
                  {_.get(user, 'followingUser.name', 'Test name')}
                </div>
              </div>
            </div>
          </div>
          {/* <div>
            <Button
              variant="outline-secondary"
              onClick={() => {
                unfollowUser(user.followingUserId)
              }}
            >
              Đang theo dõi
            </Button>
          </div> */}
        </div>
      )
    })
  }
  return (
    <Col className={`py-1 `}>
      <span
        className="cursor-pointer"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <span className="fw-medium">{followingUsers?.items.length ?? 0} </span>{' '}
        người theo dõi
      </span>

      <FollowUserModal
        show={showModal}
        title="Người theo dõi"
        handleClose={() => {
          setShowModal(false)
        }}
      >
        {/* {renderList()} */}

        {followingUsers ? renderList() : <div>Loading</div>}
      </FollowUserModal>
    </Col>
  )
}
export default FollowerUser
