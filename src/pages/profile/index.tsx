/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import useSWR from 'swr'
import Cookies from 'universal-cookie'
import Loading from '../../components/Loading/Loading'
import NavBar from '../../components/NavBar/NavBar'
import SummaryInfo from '../../components/Profile/SummaryInfo/SummaryInfo'
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

const ProfilePage: NextPage = () => {
  const [user, setUser] = useState<TUser>()
  const [userResponse, setUserResponse] = useState<TUserProfile>()
  const cookies = new Cookies()
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const [followingUsers, setFollowingUsers] =
    useState<TPaginationResponse<TFollowUsers>>()
  const [followerUsers, setFollowerUsers] =
    useState<TPaginationResponse<TFollowUsers>>()
  const [itemCategoriesResponse, setItemCategoriesResponse] =
    useState<TPaginationResponse<TItemCategory>>()
  const [userItems, setUserItems] = useState<TUserItems[]>()

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
    getItemCategories()
    getItems()
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
            alt="avatar"
            src={user?.avatar || '/assets/default-logo.png'}
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

            <SummaryInfo
              userResponse={userResponse}
              followers={followerUsers?.items as TFollowUsers[]}
              followings={followingUsers?.items as TFollowUsers[]}
            />
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
  ) : null
}

export default ProfilePage
