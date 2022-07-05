import _ from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemShopV2 from '../../components/ItemShopV2/ItemShopV2'
import LoadingFullScreen from '../../components/LoadingFullScreen/Loading'
import { MyPagination } from '../../components/MyPagination/MyPagination'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import SearchBar from '../../components/SearchBar/SearchBar'
import { WheelFortuneModal } from '../../components/WheelFortuneModal/WheelFortuneModal'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TItem,
  TItemCategory,
  TPaginationResponse,
  TUserProfile,
} from '../../types/types'

const ItemPage: NextPage = () => {
  const [showWheelFortuneModal, setShowWheelFortuneModal] = useState(false)
  const [toggleState, setToggleState] = useState<number>(0)
  const [itemsResponse, setItemsResponse] =
    useState<TPaginationResponse<TItem>>()
  const [itemCategoriesResponse, setItemCategoriesResponse] =
    useState<TPaginationResponse<TItemCategory>>()

  const [userResponse, setUserReponse] = useState<TUserProfile>()
  const pageSize = 8
  const router = useRouter()
  const { q } = router.query

  const [pageIndex, setPageIndex] = useState(1)

  const handlePageClick = (selected: { selected: number }) => {
    setPageIndex(Number(selected.selected) + 1)
  }

  useEffect(() => {
    if (pageIndex > 0 || q) {
      getItems(getCategoryIdByToggleState(toggleState))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, toggleState, q])

  const getItems = async (idCategory: number) => {
    const params = {
      filter: {
        where: {
          itemCategoryId: idCategory,
        },
        relations: ['itemCategory'],
      },
      q,
      pageIndex: pageIndex,
      pageSize: pageSize,
    }
    try {
      const res: TApiResponse<TPaginationResponse<TItem>> = await get(
        `/api/items`,
        true,
        params
      )
      if (res.response) {
        setItemsResponse(res.response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getUser = async () => {
    try {
      const res: TApiResponse<TUserProfile> = await get(
        `/api/users/profile`,
        true
      )
      if (res.response) {
        setUserReponse(res.response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getItemCategories = async () => {
      try {
        const res: TApiResponse<TPaginationResponse<TItemCategory>> = await get(
          `/api/items/categories`,
          true
        )
        if (res.response) {
          setItemCategoriesResponse(res.response)
          //Lấy category đầu tiên để lấy ra dữ liệu item mặc định khi vào trang Shop
          if (res.response.items.length !== 0) {
            getItems(res.response.items[0].id)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    getItemCategories()
    getUser()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userBuyItem = () => {
    getUser()
    getItems(getCategoryIdByToggleState(toggleState))
  }

  const getCategoryIdByToggleState = (toggleState: number) => {
    return _.get(itemCategoriesResponse, `items.${toggleState}.id`, 0)
  }

  return (
    <DashboardLayout>
      <div className="w-100 ">
        <Container fluid="lg">
          <Row className="my-3 justify-content-between">
            <Col
              xs={12}
              lg={3}
              xxl={2}
              className="fs-22px mb-2 mb-lg-0 fw-medium"
            >
              <h1>Cửa hàng</h1>
            </Col>
            <Col>
              <SearchBar
                pageUrl="items"
                inputClassName="border border-primary"
              />
            </Col>
            {userResponse?.user?.coin ? (
              <Col xs={12} lg={3} xl={2}>
                <div className="d-flex rounded-20px align-items-center p-2 fw-medium fs-18px border border-primary bg-primary bg-opacity-10">
                  <Image
                    alt="avatar"
                    src="/assets/quiwi-coin.png"
                    width="32"
                    height="32"
                  ></Image>

                  <div className="ps-3">{userResponse?.user.coin}</div>
                </div>
              </Col>
            ) : null}
          </Row>

          <Row className="align-items-center mb-2">
            <Col>
              <MyTabBar
                currentTab={toggleState}
                setCurrentTab={setToggleState}
                tabs={
                  itemCategoriesResponse?.items?.map(
                    (category) => category.name
                  ) ?? []
                }
              />
            </Col>
          </Row>
          <Row>
            <Image
              alt="wheel"
              src="/assets/wheel.webp"
              onClick={() => {
                setShowWheelFortuneModal(true)
              }}
              roundedCircle={true}
              rounded={true}
              fluid={true}
              style={{
                position: 'absolute',
                right: 1,
                height: '100px',
                width: '200px',
              }}
            />
          </Row>
          <Row className="">
            {itemCategoriesResponse && itemsResponse ? (
              itemsResponse?.items.map((item, idx) => (
                <Col key={idx} className="p-3" xs={6} md={4} lg={3}>
                  <ItemShopV2 item={item} userBuyItem={userBuyItem} />
                </Col>
              ))
            ) : (
              <LoadingFullScreen />
            )}
          </Row>

          {itemsResponse?.totalPages || 0 > 0 ? (
            <Row className="mt-3">
              <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <MyPagination
                  handlePageClick={handlePageClick}
                  totalPages={itemsResponse?.totalPages ?? 0}
                />
              </Col>
            </Row>
          ) : null}

          <WheelFortuneModal
            onHide={() => {
              setShowWheelFortuneModal(false)
              getUser()
            }}
            userSpinningNumber={0}
            showModal={showWheelFortuneModal}
          />
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default ItemPage
