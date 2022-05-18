import { NextPage } from 'next'
import Link from 'next/link'
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
  TUserProfile,
} from '../../types/types'

const ProfilePage: NextPage = () => {
  const [user, setUser] = useState<TUser>()
  const [userResponse, setUserReponse] = useState<TUserProfile>()
  const cookies = new Cookies()
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const [followingUsers, setFollowingUsers] =
    useState<TPaginationResponse<TFollowUsers>>()

  const [followerUsers, setFollowerUsers] =
    useState<TPaginationResponse<TFollowUsers>>()

  const { data, isValidating } = useSWR<TApiResponse<TUserProfile>>(
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
        className={`py-1 rounded-20px ${showModal ? 'cursor-pointer' : null}`}
        onClick={() => {
          showModal && showModal()
        }}
      >
        <div>
          <span className="fw-medium">{data} </span> {label}
        </div>
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
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container className="pt-80px min-vh-100">
        <div className="d-flex flex-column align-items-center py-3 gap-3">
          <div>
            <Image
              fluid={true}
              alt="avatar"
              src="/assets/default-logo.png"
              width={220}
              height={220}
              className="rounded-circle border border-2 border-white"
            />
          </div>

          <div className="d-flex flex-column align-items-center">
            <div className="fs-24px fw-medium">{userResponse.user.name}</div>
            <div className="text-secondary">@{userResponse.user.username}</div>
          </div>

          <div className="d-flex gap-3 fs-14px w-100 fw-medium">
            <div className="w-100">
              <div className="text-secondary">Danh Hiệu</div>
              <div className="fs-32px line-height-normal">
                {userResponse?.badges.length}
              </div>
            </div>
            <div className="w-100">
              <div className="fw-medium text-secondary">Người Theo Dõi</div>
              <div className="fs-32px line-height-normal">
                {followerUsers?.items.length}
              </div>
            </div>
            <div className="w-100">
              <div className="fw-medium text-secondary">Đang Theo Dõi</div>
              <div className="fs-32px line-height-normal">
                {followingUsers?.items.length}
              </div>
            </div>
          </div>
          {/* <Row>
            <Row className="">
              {renderData(userResponse?.badges.length, 'danh hiệu')}
              <FollowerUser followerUsers={followerUsers} />
              <FollowingUser
                followingUsers={followingUsers}
                unfollowUser={unfollow}
              />
            </Row>
          </Row> */}
          <Link href="/profile/edit" passHref={true}>
            <Button className="text-white">Chỉnh sửa</Button>
          </Link>
        </div>
      </Container>
    </>
  ) : null
}

export default ProfilePage
