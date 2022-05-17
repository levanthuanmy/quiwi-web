/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
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

type TUserProfileRespone = TUser & {
  isFollowing: boolean
}

const GetUserPage: NextPage = () => {
  const [user, setUser] = useState<TUserProfileRespone>()
  const cookies = new Cookies()
  const router = useRouter()
  const { id } = router.query
  const [followingUsers, setFollowingUsers] =
    useState<TPaginationResponse<TFollowUsers>>()

  const [followerUsers, setFollowerUsers] =
    useState<TPaginationResponse<TFollowUsers>>()

  const getUser = async () => {
    try {
      const res: TApiResponse<TUserProfileRespone> = await get(
        `/api/users/user/${id}`,
        true
      )
      if (res.response) {
        setUser(res.response)
      }
    } catch (error) {
      alert('Có lỗi nè')
      console.log(error)
    }
  }

  useEffect(() => {
    id && getUser()
  }, [id])

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
        `/api/users/user/${user?.id}/followers`,
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
        `/api/users/user/${user?.id}/following`,
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

  const followOrUnfollowUser = async () => {
    try {
      const params = {
        followingUserId: user?.id,
      }
      const res: TApiResponse<{ result: string }> = await post(
        `/api/users/follow`,

        params,
        {},
        true
      )
      alert(res.response.result)
      await getFollowingUsers()
      await getUser()
    } catch (error) {
      console.log(error)
      alert((error as Error).message)
    }
  }

  return user ? (
    <>
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />

      <Container className="pt-80px min-vh-100 position-relative ">
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
                  {user.username}
                </div>
                <div>{user.name}</div>
              </div>
              <div>
                <Button
                  className={
                    user.isFollowing ? 'bg-white border-dark ' : 'text-white'
                  }
                  onClick={followOrUnfollowUser}
                >
                  {user.isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
                </Button>
              </div>
            </div>

            <Row className="d-flex pt-2">
              {renderData(0, 'danh hiệu')}
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
