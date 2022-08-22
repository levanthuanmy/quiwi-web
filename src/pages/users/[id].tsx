/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CardBadge from '../../components/CardBadge/CardBadge'
import Item from '../../components/Item/Item'
import ItemQuiz from '../../components/ItemQuiz/ItemQuiz'
import Loading from '../../components/Loading/Loading'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
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
  TQuiz,
  TUser,
  TUserItems,
  TUserProfile,
} from '../../types/types'
import BadgesPage from '../badges'
import UserItemPage from '../user-items'

const GetUserProfilePage: NextPage = () => {
  const [user, setUser] = useState<TUser>()
  const [userProfile, setUserProfile] = useState<TUserProfile>()
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const [userItems, setUserItems] = useState<TUserItems[]>()
  const [quizzes, setQuizzes] = useState<TQuiz[]>()
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
      getPublicQuiz()
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

  const getPublicQuiz = async () => {
    try {
      const params = {
        filter: {
          relations: ['questions', 'questions.questionAnswers'],
          order: { createdAt: 'DESC' },
        },
      }
      const res: TApiResponse<TPaginationResponse<TQuiz>> = await get(
        `/api/quizzes/public-quiz/${user?.id}`,
        false,
        params
      )
      console.log('getPublicQuiz - res', res)
      setQuizzes(res.response.items)
    } catch (error) {
      console.log('getPublicQuiz - error', error)
    }
  }
  const tabs = ['Tổng quan', 'Quiz đã tạo', 'Danh hiệu', 'Vật phẩm']
  const [currentTab, setCurrentTab] = useState(0)
  return userProfile && user ? (
    <div className="bg-light">
      <NavBar showMenuBtn={false} isExpand={false} setIsExpand={() => null} />
      <Container fluid={'lg'} className="pt-80px min-vh-100 pb-3">
        <Row>
          <Col xs="12" md="5" lg="4">
            <LeftProfileInformation
              followerUsers={followerUsers}
              followingUsers={followingUsers}
              user={user}
              userProfile={userProfile}
              followOrUnfollowUser={followOrUnfollowUser}
            />
          </Col>
          <Col xs={12} md={7} lg={8} xl={8} className="mt-3">
            <MyTabBar
              tabs={tabs}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />

            {currentTab === 0 && (
              <>
                <Row className="pb-3">
                  <Col md="12" lg="6" className="mb-3 mb-lg-0">
                    <div className="d-flex flex-column mt-3 gap-4 p-12px shadow-sm rounded-8px bg-white position-relative h-100">
                      <div className="h5 d-flex align-items-center gap-2">
                        Vật phẩm
                        <div
                          style={{ width: 32, height: 32 }}
                          className="fs-16px bg-secondary bg-opacity-25 rounded-10px d-flex justify-content-center align-items-center"
                        >
                          {userItems?.length}
                        </div>
                      </div>
                      <div
                        className="cursor-pointer text-primary"
                        onClick={() => setCurrentTab(3)}
                      >
                        Xem tất cả {`>>`}
                      </div>
                      <Row>
                        {userItems
                          ?.filter((item) => item.item !== null)
                          ?.slice(0, 3)
                          ?.map(
                            (item) =>
                              item?.item && (
                                <Col
                                  xs="4"
                                  key={item.id}
                                  className="d-flex justify-content-center"
                                >
                                  <Item
                                    name={item.item.name}
                                    des={item.item.description}
                                    avatar={item.item.avatar}
                                    type={item.item.type}
                                    price={item.item.price}
                                    quantity={item.quantity}
                                  ></Item>
                                </Col>
                              )
                          )}
                      </Row>
                    </div>
                  </Col>
                  <Col md="12" lg="6">
                    <div className="d-flex flex-column mt-3 gap-4 p-12px shadow-sm rounded-8px bg-white position-relative h-100">
                      <div className="h5 d-flex align-items-center gap-2">
                        Danh hiệu
                        <div
                          style={{ width: 32, height: 32 }}
                          className="fs-16px bg-secondary bg-opacity-25 rounded-10px d-flex justify-content-center align-items-center"
                        >
                          {userProfile?.badges.length}
                        </div>
                      </div>

                      <div
                        className="cursor-pointer text-primary"
                        onClick={() => setCurrentTab(2)}
                      >
                        Xem tất cả {`>>`}
                      </div>
                      <Row>
                        {userProfile?.badges?.slice(0, 2)?.map((badge) => {
                          const goals =
                            badge?.badge?.badgeRequirements?.reduce(
                              (previousValue, currentValue) =>
                                previousValue + currentValue.goal,
                              0
                            ) || 1
                          const progress = badge.process / goals
                          if (badge?.badge)
                            return (
                              <Col key={badge.id} xs="6">
                                <CardBadge
                                  onClick={() => {}}
                                  image={badge.badge.picture || ''}
                                  title={badge.badge.title}
                                  description={badge.badge.description}
                                  progress={progress.toFixed(2)}
                                />
                              </Col>
                            )
                        })}
                      </Row>
                    </div>
                  </Col>
                </Row>
                <div className="d-flex flex-column mt-3 gap-4 p-12px shadow-sm rounded-8px bg-white position-relative">
                  <div className="h5 d-flex align-items-center gap-2">
                    Quiz đã tạo
                    <div
                      style={{ width: 32, height: 32 }}
                      className="fs-16px bg-secondary bg-opacity-25 rounded-10px d-flex justify-content-center align-items-center"
                    >
                      {quizzes?.length}
                    </div>
                  </div>
                  <div
                    className="cursor-pointer text-primary"
                    onClick={() => setCurrentTab(1)}
                  >
                    Xem tất cả {`>>`}
                  </div>
                  <Row>
                    {quizzes?.slice(0, 2)?.map((quiz) => (
                      <Col key={quiz.id} xs="12" sm="6">
                        <ItemQuiz quiz={quiz} exploreMode />
                      </Col>
                    ))}
                  </Row>
                </div>
              </>
            )}

            {currentTab === 1 && (
              <>
                <Row className="mt-3">
                  {quizzes?.map((quiz) => (
                    <Col key={quiz.id} xs="12" sm="6" className="mb-2">
                      <ItemQuiz quiz={quiz} exploreMode />
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {currentTab === 2 && (
              <>
                <div className="bg-white p-12px mt-3 rounded-8px shadow-sm d-flex flex-column gap-3 justify-content-between">
                  {userProfile?.badges ? (
                    <>
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
                    </>
                  ) : null}

                  {/* <div className="text-center border-top pt-12px pb-1 text-secondary opacity-75">
        Xem Tất Cả
      </div> */}
                </div>
              </>
            )}

            {currentTab === 3 && (
              <>
                <div className="bg-white mt-3 p-12px rounded-8px shadow-sm d-flex flex-column gap-3 justify-content-between">
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
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  ) : (
    <Loading />
  )
}

export default GetUserProfilePage
