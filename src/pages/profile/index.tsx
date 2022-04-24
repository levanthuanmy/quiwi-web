import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import useSWR from 'swr'
import Cookies from 'universal-cookie'
import FollowerUser from '../../components/FollowerUser/FollowerUser'
import FollowingUser from '../../components/FollowingUser/FollowingUser'
import NavBar from '../../components/NavBar/NavBar'
import { get, post } from '../../libs/api'
import {
  TApiResponse,
  TFollowUsers,
  TPaginationResponse,
  TUser,
} from '../../types/types'

type UserProfile = {
  user: TUser
  badges: []
  quests: []
  totalFollower: number
  totalFollowing: number
}

const ProfilePage: NextPage = () => {
  const [user, setUser] = useState<TUser>()
  const [userResponse, setUserReponse] = useState<UserProfile>()
  const cookies = new Cookies()
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const [followingUsers, setFollowingUsers] =
    useState<TPaginationResponse<TFollowUsers>>()

  const [followerUsers, setFollowerUsers] =
    useState<TPaginationResponse<TFollowUsers>>()

  const { data, isValidating } = useSWR<TApiResponse<UserProfile>>(
    shouldFetch ? ['/api/users/profile', true] : null,
    get
  )

  useEffect(() => {
    const accessToken = String(cookies.get('access-token'))
    if (accessToken && accessToken.length && accessToken !== 'undefined') {
      setShouldFetch(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.get('access-token')])

  useEffect(() => {
    if (data) {
      setUser(data.response.user)
      setUserReponse(data.response)
    }
  }, [data, isValidating])

  useEffect(() => {
    getFollowingUsers()
    getFollowersUsers()
  }, [user])

  const renderData = (data: number, label: string, showModal?: Function) => {
    return (
      <Col
        className={`text-center py-1 rounded-20px ${
          showModal ? 'cursor-pointer' : null
        }`}
        onClick={() => {
          showModal && showModal()
        }}
      >
        <div className="fw-medium">{data} </div>
        <span>{label}</span>
      </Col>
    )
  }

  const getFollowersUsers = async () => {
    try {
      const params = {
        filter: { relations: ['user'] },
      }
      const res: TApiResponse<TPaginationResponse<TFollowUsers>> = await get(
        `/api/users/followers`,
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
        `/api/users/following`,
        true,
        params
      )

      setFollowingUsers(res.response)
    } catch (error) {
      console.log('getFollowingUsers - error', error)
    }
  }

  const unfollow = async (followingUserId: number) => {
    try {
      const params = {
        followingUserId: followingUserId,
      }
      const res: TApiResponse<{ result: string }> = await post(
        `/api/users/follow`,

        params,
        {},
        true
      )
      alert(res.response.result)
      await getFollowingUsers()
    } catch (error) {
      console.log(error)
      alert('Lỗi')
    }
  }

  return userResponse ? (
    <>
      <NavBar />
      <Container className="pt-64px min-vh-100 position-relative overflow-hidden">
        {/* <Image
          src="/assets/default-banner.svg"
          className="position-absolute w-100"
          alt="banner"
          style={{
            zIndex: -1,
            objectFit: 'cover',
            minWidth: 576,
            minHeight: 200,
          }}
        /> */}
        <Row className="my-5">
          <Col>
            <Container className=" text-center">
              <Image
                fluid={true}
                alt="avatar"
                src="/assets/default-logo.png"
                width={160}
                height={160}
                className="rounded-circle border border-2 border-white"
              />

              <div className="fs-24px fw-bold py-3">
                {userResponse.user.name?.length > 0
                  ? userResponse.user.name
                  : userResponse.user.username}
              </div>
              <Button className="text-white">Chỉnh sửa</Button>
            </Container>
          </Col>
          <Col className="text-center text-center">
            <div className="py-3 d-flex justify-content-center align-items-center">
              <Image
                alt="avatar"
                src="/assets/quiwi-coin.png"
                width={32}
                height={32}
                className="me-3"
              />
              <span className="fs-32px text-primary fw-medium">
                {userResponse.user.coin}
              </span>
            </div>
            <Row>
              {renderData(userResponse?.badges.length, 'danh hiệu')}

              <FollowerUser followerUsers={followerUsers} />
              <FollowingUser
                followingUsers={followingUsers}
                unfollowUser={unfollow}
              />
            </Row>
          </Col>
        </Row>
        {/* <FollowUserModal
          handleClose={() => {
            setShowFollowingUsersModal(false)
          }}
          show={showFollowingUsersModal}
          title="Đang theo dõi"
        >
          {renderList()}
        </FollowUserModal> */}
      </Container>
    </>
  ) : null
}

export default ProfilePage
