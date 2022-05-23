import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import useSWR from 'swr'
import Cookies from 'universal-cookie'
import NavBar from '../../components/NavBar/NavBar'
import { get, post } from '../../libs/api'
import {
  TApiResponse,
  TFollowUsers,
  TPaginationResponse,
  TUser,
  TUserProfile,
} from '../../types/types'
import BadgesPage from '../badges'
import UserItemPage from '../user-items'

const ProfilePage: NextPage = () => {
  const [user, setUser] = useState<TUser>()
  const [userResponse, setUserResponse] = useState<TUserProfile>()
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
      setUserResponse(data.response)
    }
  }, [data, isValidating])

  useEffect(() => {
    getFollowingUsers()
    getFollowersUsers()
  }, [user])

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
    <div className="bg-light">
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container className="pt-80px min-vh-100 pb-3" fluid="lg">
        <div className="d-flex flex-column flex-md-row mt-3 gap-4 p-12px shadow-sm rounded-20px bg-white position-relative">
          <Image
            fluid={true}
            alt="avatar"
            src="/assets/default-logo.png"
            width={160}
            height={160}
            className="rounded-14px"
          />

          <div className="w-100 d-flex flex-column">
            <div className="h-100">
              <div className="fs-32px fw-medium">{userResponse.user.name}</div>
              <div className="text-secondary">
                @{userResponse.user.username}
              </div>
            </div>

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

              <Col className="p-0 d-flex gap-2 align-items-center">
                <div
                  className="shadow-sm d-flex justify-content-center align-items-center rounded-14px"
                  style={{ width: 45, height: 45 }}
                >
                  <i className="bi bi-people-fill fs-18px" />
                </div>
                <div>
                  <div className="fs-24px line-height-normal fw-medium">
                    {followerUsers?.items.length}
                  </div>
                  <div className="text-secondary fs-14px d-none d-md-block">
                    Lượt Theo Dõi
                  </div>
                </div>
              </Col>

              <Col className="p-0 d-flex gap-2 align-items-center">
                <div
                  className="shadow-sm d-flex justify-content-center align-items-center rounded-14px"
                  style={{ width: 45, height: 45 }}
                >
                  <i className="bi bi-person-heart fs-18px" />
                </div>
                <div>
                  <div className="fs-24px line-height-normal fw-medium">
                    {followingUsers?.items.length}
                  </div>
                  <div className="text-secondary fs-14px d-none d-md-block">
                    Đang Theo Dõi
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Link href="/profile/edit" passHref={true}>
            <Button
              variant="light"
              className="bi bi-pencil-fill rounded-10px position-absolute fs-14px py-1 px-2 text-secondary border"
              style={{ right: 12 }}
            />
          </Link>
        </div>

        <Row className="m-0 mt-3">
          <Col xs="12" lg="6" className="ps-0 pe-0 pe-lg-2 pb-12px">
            <div className="bg-white p-12px rounded-20px shadow-sm d-flex flex-column gap-3 overflow-hidden h-100 justify-content-between">
              <div className="fs-24px fw-medium d-flex gap-3 align-items-center">
                Thành Tựu
                <div
                  style={{ width: 30, height: 30 }}
                  className="fs-16px bg-secondary bg-opacity-25 rounded-10px d-flex justify-content-center align-items-center"
                >
                  3
                </div>
              </div>
              <BadgesPage />

              <div className="text-center border-top pt-12px pb-1 text-secondary opacity-75">
                Xem Tất Cả
              </div>
            </div>
          </Col>
          <Col xs="12" lg="6" className="pe-0 ps-0 ps-lg-2 pb-12px">
            <div className="bg-white p-12px rounded-20px shadow-sm d-flex flex-column gap-3 overflow-hidden h-100 justify-content-between">
              <div className="fs-24px fw-medium d-flex gap-3 align-items-center">
                Vật Phẩm
                <div
                  style={{ width: 30, height: 30 }}
                  className="fs-16px bg-secondary bg-opacity-25 rounded-10px d-flex justify-content-center align-items-center"
                >
                  3
                </div>
              </div>
              <UserItemPage />

              <div className="text-center border-top pt-12px pb-1 text-secondary opacity-75">
                Xem Tất Cả
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  ) : null
}

export default ProfilePage
