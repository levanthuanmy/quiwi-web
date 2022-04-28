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

const GetUserPage: NextPage = () => {
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
      <NavBar />
      <Container className="pt-64px min-vh-100 position-relative ">
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
        <Row className="my-5 justify-content-center align-items-center">
          <Col xs={5} md={3} className="text-center">
            <Image
              fluid={true}
              alt="avatar"
              src="/assets/default-logo.png"
              width={160}
              height={160}
              className="rounded-circle border border-2 border-white"
            />
          </Col>

          <Col xs={7} className="">
            <div className="d-flex align-items-center">
              <div className="me-5">
                <div className="fs-24px fw-medium text-secondary">
                  {userResponse.user.username}
                </div>
                <div> {userResponse.user.name}</div>
              </div>
              <div>
                <Link href="/profile/edit" passHref={true}>
                  <Button className="text-white">Theo doi</Button>
                </Link>
              </div>
            </div>
            <div></div>
            <Row className="d-flex pb-2">
              {renderData(userResponse?.badges.length, 'danh hiệu')}
              <FollowerUser followerUsers={followerUsers} />
              <FollowingUser
                followingUsers={followingUsers}
                unfollowUser={unfollow}
              />
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  ) : null
}

export default GetUserPage
