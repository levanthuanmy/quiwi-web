/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import FollowerUser from '../../components/FollowerUser/FollowerUser'
import FollowingUser from '../../components/FollowingUser/FollowingUser'
import Loading from '../../components/Loading/Loading'
import NavBar from '../../components/NavBar/NavBar'
import SummaryInfo from '../../components/Profile/SummaryInfo/SummaryInfo'
import { useAuth } from '../../hooks/useAuth/useAuth'
import { get, post } from '../../libs/api'
import {
  TApiResponse,
  TFollowUsers,
  TItemCategory,
  TPaginationResponse,
  TUser,
  TUserItems,
  TUserProfile,
} from '../../types/types'
import BadgesPage from '../badges'
import UserItemPage from '../user-items'

const GetUserPage: NextPage = () => {
  const [user, setUser] = useState<TUser>()
  const [userProfile, setUserProfile] = useState<TUserProfile>()
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const [userItems, setUserItems] = useState<TUserItems[]>()

  const currentUser = auth.getUser()

  const [followingUsers, setFollowingUsers] =
    useState<TPaginationResponse<TFollowUsers>>()
  const getItemCategories = async () => {
    try {
      const res: TApiResponse<TPaginationResponse<TItemCategory>> = await get(
        `/api/items/categories`,
        true
      )
      if (res.response) {
        setItemCategoriesResponse(res.response)
        //Lấy category đầu tiên để lấy ra dữ liệu item mặc định khi vào trang Shop
      }
    } catch (error) {
      alert('Có lỗi nè')
      console.log(error)
    }
  }
  const [followerUsers, setFollowerUsers] =
    useState<TPaginationResponse<TFollowUsers>>()
  const [itemCategoriesResponse, setItemCategoriesResponse] =
    useState<TPaginationResponse<TItemCategory>>()
  const getUser = async () => {
    try {
      const res: TApiResponse<TUserProfile> = await get(
        `/api/users/user/${id}`,
        true
      )
      if (res.response) {
        setUserProfile(res.response)
        setUser(res.response.user)
      }
    } catch (error) {
      alert('Có lỗi nè')
      console.log(error)
    }
  }
  const getItems = async () => {
    try {
      if (user) {
        const res: TApiResponse<TUserItems[]> = await get(
          `/api/users/user/${user?.id}/items`
        )

        if (res.response) {
          console.log('==== ~ getItems ~ res.response', res)
          setUserItems(res.response)
        }
      }
    } catch (error) {
      alert('Có lỗi nè')
      console.log(error)
    }
  }
  useEffect(() => {
    if (id) {
      if (currentUser && Number(id) === currentUser.id) {
        router.replace('/profile')
      } else {
        getUser()
      }
    }
  }, [id, currentUser])

  useEffect(() => {
    if (user) {
      getFollowingUsers()
      getFollowersUsers()
      getItems()
      getItemCategories()
    }
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
  return userProfile && user ? (
    <div className="bg-light">
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container className="pt-80px min-vh-100 pb-3" fluid="lg">
        <div className="d-flex flex-column flex-md-row mt-3 gap-4 p-12px align-items-center shadow-sm rounded-20px bg-white position-relative">
          <Image
            alt="avatar"
            src={user?.avatar || '/assets/default-logo.png'}
            width={160}
            height={160}
            className="rounded-14px cursor-pointer"
          />

          <div className="w-100 d-flex flex-column">
            <div className="h-100  align-self-center align-self-md-start text-center text-md-start">
              <div className="fs-32px fw-medium">{userProfile.user.name}</div>
              <div className="text-secondary">@{userProfile.user.username}</div>
            </div>
            <div className=" align-self-center align-self-md-start mt-2">
              <Button
                className={
                  userProfile.isFollowing
                    ? 'bg-white border-dark '
                    : 'text-white'
                }
                onClick={followOrUnfollowUser}
              >
                {userProfile.isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
              </Button>
            </div>
            <SummaryInfo
              userResponse={userProfile}
              followers={followerUsers?.items as TFollowUsers[]}
              followings={followingUsers?.items as TFollowUsers[]}
            />
          </div>
        </div>

        <Row className="m-0 mt-3">
          <Col xs="12" lg="6" className="ps-0 pe-0 pe-lg-2 pb-12px">
            <div className="bg-white p-12px rounded-20px shadow-sm d-flex flex-column gap-3 overflow-hidden h-100 justify-content-between">
              <div className="fs-24px fw-medium d-flex gap-3 align-items-center">
                Thành Tựu
                <div
                  style={{ width: 32, height: 32 }}
                  className="fs-16px bg-secondary bg-opacity-25 rounded-10px d-flex justify-content-center align-items-center"
                >
                  {userProfile?.badges.length}
                </div>
              </div>
              <BadgesPage userBadges={userProfile?.badges} />

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
                  {userItems?.length ?? <Loading />}
                </div>
              </div>
              {itemCategoriesResponse && userItems ? (
                <UserItemPage
                  itemCategories={itemCategoriesResponse}
                  userItems={userItems}
                />
              ) : (
                <Loading />
              )}

              <div className="text-center border-top pt-12px pb-1 text-secondary opacity-75">
                Xem Tất Cả
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  ) : (
    <Loading />
  )
}

export default GetUserPage
