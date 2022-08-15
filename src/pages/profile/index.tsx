/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Modal, Row } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import UserItemSelectionModal from '../../components/ItemSelectionModal/ItemSelectionModal'
import LoadingFullScreen from '../../components/LoadingFullScreen/Loading'
import MyModal from '../../components/MyModal/MyModal'
import NavBar from '../../components/NavBar/NavBar'
import LeftProfileInformation from '../../components/ProfileInformation/LeftProfileInformation'
import ProfileItems from '../../components/ProfileInformation/ProfileItems'
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
      <Container fluid={'lg'} className="pt-80px min-vh-100 pb-3">
        <Row className="justify-content-between">
          <Col>
            <LeftProfileInformation
              followerUsers={followerUsers}
              followingUsers={followingUsers}
              user={authUser}
              userProfile={userResponse}
              setShowAvatarSelectionModal={setShowAvatarSelectionModal}
              isAuth={true}
            />
          </Col>
          <ProfileItems
            itemCategoriesResponse={itemCategoriesResponse}
            userItems={userItems}
            userProfile={userResponse}
          />
        </Row>

        {authUser ? (
          <UserItemSelectionModal
            onHide={() => setShowAvatarSelectionModal(false)}
            show={showAvatarSelectionModal}
            key={authUser.id}
            user={authUser}
            userProfile={userResponse}
            getUserProfile={getUserProfile}
          />
        ) : null}
      </Container>
    </div>
  ) : error?.length > 0 ? (
    <MyModal
      show={error?.length > 0}
      onHide={() => {
        setError('')
        router.push('/home')
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
