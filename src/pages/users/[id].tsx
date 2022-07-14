/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Loading from '../../components/Loading/Loading'
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

const GetUserProfilePage: NextPage = () => {
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
      // alert('Có lỗi nè')
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
      // alert(res.response.result)
      await getUser()
    } catch (error) {
      console.log(error)
      // alert((error as Error).message)
    }
  }
  return userProfile && user ? (
    <div className="bg-light">
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container fluid={'lg'} className="pt-80px min-vh-100 pb-3">
        <Row>
          <Col>
            <LeftProfileInformation
              followerUsers={followerUsers}
              followingUsers={followingUsers}
              user={user}
              userProfile={userProfile}
              followOrUnfollowUser={followOrUnfollowUser}
            />
          </Col>

          <ProfileItems
            itemCategoriesResponse={itemCategoriesResponse}
            userItems={userItems}
            userProfile={userProfile}
          />
        </Row>
      </Container>
    </div>
  ) : (
    <Loading />
  )
}

export default GetUserProfilePage
