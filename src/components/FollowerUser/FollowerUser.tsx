import _ from 'lodash'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { Col, Image } from 'react-bootstrap'
import { TFollowUsers, TPaginationResponse } from '../../types/types'
import FollowUserModal from '../FollowUsersModal/FollowUserModal'

const FollowerUser: FC<{
  followerUsers: TPaginationResponse<TFollowUsers> | undefined
}> = ({ followerUsers: followingUsers }) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    console.log('show ', showModal)
  }, [showModal])

  const renderList = () => {
    if (followingUsers?.items.length === 0) {
      return <div>Danh sách rỗng</div>
    }
    return followingUsers?.items.map((user, idx) => {
      return (
        <div
          key={idx}
          className="d-flex align-items-center justify-content-between py-1"
        >
          <Link key={idx} href={`users/${user.user?.id}`} passHref={true}>
            <div className="d-flex align-items-center cursor-pointer">
              <div className="pe-2">
                <Image
                  src={
                    user.user?.avatar ??
                    'https://s3-alpha-sig.figma.com/img/6930/d03e/8e80566f92d08cfcbc8d47879b183d48?Expires=1650844800&Signature=MiCqrZeF7D4aLNzKUdw1cQgKxVa~y41C9V5p0Ju98-j4vOZ~n9Y7LKrnRcOXscxY6LFnIyLTs8qeg7zQoN50CQklhwgqKAtM6Tkdc1EjT~XhKjtcQR9~fRO8rbXeVQPD8EzWfJdR8cZsBDN7u7HMY7h2ncrMYFzKr33-oXdrQs8XGlV96zE7hKFE1lhzcmD4fx9piYdXLgB1Tl6f~IngSWakwNC2EuV5fibnD3q0nvE7cpNz0wsOuyegbg4JQgqmWmh4bilbWiHfScNB53oRWN9JtIivSEJb0IGedgdRGy8FbewCQtXRdvsdGAl4AG3oLAaRB5G9B3Q0szzW5-Mxfg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
                  }
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
          </Link>
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
    <Col className={`text-center py-1 rounded-20px cursor-pointer`}>
      <div
        onClick={() => {
          setShowModal(true)
        }}
      >
        <div className="fw-medium">{followingUsers?.items.length ?? 0}</div>
        <span>người theo dõi</span>
      </div>

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
