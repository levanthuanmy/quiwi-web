/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Image, Modal, Row } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import UserItemSelectionModal from '../../components/ItemSelectionModal/ItemSelectionModal'
import Loading from '../../components/Loading/Loading'
import LoadingFullScreen from '../../components/LoadingFullScreen/Loading'
import MyButton from '../../components/MyButton/MyButton'
import MyModal from '../../components/MyModal/MyModal'
import NavBar from '../../components/NavBar/NavBar'
import SummaryInfo from '../../components/Profile/SummaryInfo/SummaryInfo'
import ProfileBadge from '../../components/ProfileInformation/ProfileBadge'
import ProfileInformation from '../../components/ProfileInformation/ProfileInformation'
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
  const [showAvatarSelectionModal, setShowAvatarSelectionModal] =
    useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const auth = useAuth()
  const authUser = auth.getUser()

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
      // alert('Có lỗi nè')
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
      // alert('Có lỗi nè')
      console.log(error)
    }
  }

  const getUserProfile = async () => {
    try {
      const res = await get<TApiResponse<TUserProfile>>(
        '/api/users/profile',
        true
      )
      if (res.response) {
        setUser(res.response.user)
        setUserResponse(res.response)
      }
    } catch (error) {
      if (_.get(error, 'code') === 401) {
        setError(_.get(error, 'message'))
        // setTimeout(() => router.push('/'), 2000)
      }
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  useEffect(() => {
    const accessToken = String(cookies.get('access-token'))
    if (accessToken && accessToken.length && accessToken !== 'undefined') {
      setShouldFetch(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.get('access-token')])

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
      // alert(res.response.result)
      await getFollowingUsers()
    } catch (error) {
      console.log(error)
      // alert('Lỗi')
    }
  }

  return userResponse && authUser ? (
    <div className="bg-light">
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container fluid={true} className="pt-80px min-vh-100 pb-3">
        <Row>
          <Col>
            <div className="d-flex flex-column mt-3 gap-4 p-12px shadow-sm rounded-20px bg-white position-relative">
              <div className="text-center">
                <Image
                  alt="avatar"
                  src={authUser?.avatar || '/assets/default-avatar.png'}
                  width={240}
                  height={240}
                  className="rounded-14px cursor-pointer"
                  onClick={() => setShowAvatarSelectionModal(true)}
                />
              </div>

              <div className="w-100 d-flex flex-column">
                <ProfileInformation user={userResponse.user} />

                <SummaryInfo
                  userResponse={userResponse}
                  followers={followerUsers?.items as TFollowUsers[]}
                  followings={followingUsers?.items as TFollowUsers[]}
                />
              </div>
              {userResponse.currentBadge ? (
                <ProfileBadge currentBadge={userResponse.currentBadge} />
              ) : null}
              <MyButton
                className=" text-white my-auto"
                title="Chinh sửa thông tin"
                onClick={() => router.push('/profile/edit')}
              >
                Chinh sửa thông tin
              </MyButton>
            </div>
          </Col>
          <Col xs={12} md={7} xl={8}>
            <Row className="m-0 mt-3 flex-column">
              <Row className="ps-0 pe-0 pe-lg-2 pb-12px">
                <div className="bg-white p-12px rounded-20px shadow-sm d-flex flex-column gap-3 overflow-hidden h-100 justify-content-between">
                  <div className="fs-24px fw-medium d-flex gap-3 align-items-center">
                    Thành Tựu
                    <div
                      style={{ width: 32, height: 32 }}
                      className="fs-16px bg-secondary bg-opacity-25 rounded-10px d-flex justify-content-center align-items-center"
                    >
                      {userResponse?.badges.length}
                    </div>
                  </div>
                  <BadgesPage userBadges={userResponse?.badges} />

                  {/* <div className="text-center border-top pt-12px pb-1 text-secondary opacity-75">
                Xem Tất Cả
              </div> */}
                </div>
              </Row>
              <Row className="pe-0 ps-0 ps-lg-2 pb-12px">
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

                  {/* <div className="text-center border-top pt-12px pb-1 text-secondary opacity-75">
                Xem Tất Cả
              </div> */}
                </div>
              </Row>
            </Row>
          </Col>
        </Row>

        {authUser ? (
          <UserItemSelectionModal
            onHide={() => setShowAvatarSelectionModal(false)}
            show={showAvatarSelectionModal}
            key={authUser.id}
            user={authUser}
            userProfile={userResponse}
          />
        ) : null}
      </Container>
    </div>
  ) : error?.length > 0 ? (
    <MyModal
      show={error?.length > 0}
      onHide={() => {
        setError('')
        router.push('/')
      }}
      size="sm"
      header={<Modal.Title className="text-danger">Thông báo</Modal.Title>}
    >
      <div className="text-center fw-medium fs-16px">{error}</div>
    </MyModal>
  ) : (
    <div className="bg-dark ">
      <LoadingFullScreen />
    </div>
  )
}

export default ProfilePage
