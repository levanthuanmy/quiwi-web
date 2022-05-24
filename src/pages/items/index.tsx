import _ from 'lodash'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Col, Container, Pagination, Row, Image } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemShopV2 from '../../components/ItemShopV2/ItemShopV2'
import MyModal from '../../components/MyModal/MyModal'
import MyTabBar from '../../components/MyTabBar/MyTabBar'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TItem,
  TItemCategory,
  TPaginationResponse,
  TUserProfile,
} from '../../types/types'

// const socket = io(`${API_URL}/games`, { transports: ['websocket'] })

const ItemPage: NextPage = () => {
  const [toggleState, setToggleState] = useState<number>(0)
  const [itemsResponse, setItemsResponse] =
    useState<TPaginationResponse<TItem>>()
  const [itemCategoriesResponse, setItemCategoriesResponse] =
    useState<TPaginationResponse<TItemCategory>>()
  const [currentListPagination, setCurrentListPagination] = useState<number[]>()
  const [currentPagination, setCurrentPagination] = useState<number>(1)
  const [userResponse, setUserReponse] = useState<TUserProfile>()
  const [showModal, setShowModal] = useState<boolean>(false)
  //Logic phân trang chỉ áp dụng cho số lẻ
  const maxPaginationList = 5
  const pageSize = 8

  const getFirst = (totalPages: number) => {
    setCurrentPagination(1)
    let arr = []
    for (let i = 1; i <= totalPages; i++) {
      arr.push(i)
      if (i === maxPaginationList) break
    }
    console.log(arr)
    return arr
  }

  const getLast = (totalPages: number) => {
    setCurrentPagination(totalPages)
    let arr = []
    let count = 0
    for (let i = totalPages; i >= 1; i--) {
      arr.unshift(i)
      count++
      if (count === maxPaginationList) break
    }
    return arr
  }

  //Gọi hàm để set lại danh sách mảng số Pagination
  const getPagination = (totalPages: number, pageCur: number) => {
    if (pageCur > totalPages || pageCur < 1)
      return currentListPagination ? [...currentListPagination] : []
    setCurrentPagination(pageCur)
    if (totalPages === 0 || totalPages === 1 || !totalPages) return [1]
    let arr: any = []
    //Nếu nút pagination được chọn khác với pagination hiện tại
    if (
      pageCur !== currentPagination &&
      currentListPagination &&
      currentListPagination.indexOf(pageCur) > maxPaginationList / 2 &&
      currentListPagination.length === maxPaginationList
    ) {
      //Ở vị trí lớn hơn nút giữa nhưng không phải nút cuối
      if (currentListPagination.indexOf(pageCur) < maxPaginationList - 1) {
        arr = [...currentListPagination]
        let lastPag = arr[maxPaginationList - 1]
        //Nếu phần tử cuối có giá trị lớn hơn số trang hoặc bằng thì sẽ giữ nguyên
        if (lastPag >= totalPages) return arr
        //Shift mảng lên 1 vị trí
        arr.push(lastPag + 1)
        arr.splice(0, 1)
      } else {
        //Shift mảng lên 2 vị trí
        arr = [...currentListPagination]
        let lastPag = arr[maxPaginationList - 1]
        if (lastPag >= totalPages) return arr
        for (let k = 0; k < 2; k++) {
          lastPag = lastPag + 1
          arr.push(lastPag)
          arr.splice(0, 1)
          if (lastPag === totalPages) break
        }
      }
    } else if (
      pageCur !== currentPagination &&
      currentListPagination &&
      currentListPagination.indexOf(pageCur) < maxPaginationList / 2 &&
      currentListPagination.length === maxPaginationList
    ) {
      //Ở vị trí nhỏ hơn nút giữa nhưng không phải nút cuối
      if (currentListPagination.indexOf(pageCur) < maxPaginationList - 1) {
        arr = [...currentListPagination]
        let firstPag = arr[0]
        //Nếu phần tử đầu có giá trị 1 (đầu trang) thì sẽ giữ nguyên
        if (firstPag === 1) return arr
        //Shift mảng về 1 vị trí
        arr.unshift(firstPag - 1)
        arr.splice(arr.length - 1, 1)
      } else {
        //Shift mảng về 2 vị trí
        arr = [...currentListPagination]
        let firstPag = arr[maxPaginationList - 1]
        if (firstPag === 1) return arr
        for (let k = 0; k < 2; k++) {
          firstPag = firstPag - 1
          arr.unshift(firstPag)
          arr.splice(arr.length - 1, 1)
          if (firstPag === 1) break
        }
      }
    }
    return arr
  }

  //Mỗi lần chuyển trang sẽ gọi API lấy list item theo id category của tham số index
  const toggleTab = (index: number) => {
    //Set giá trị mặc định của tab
    setToggleState(index)
    //Set lại list items và set nút pagination active về 1
    getItems(index, 1)
  }

  useEffect(() => {
    itemCategoriesResponse &&
      getItems(_.get(itemCategoriesResponse, `items.${toggleState}.id`, 0), 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleState, itemCategoriesResponse])

  const getItems = async (idCategory: number, pageIndex: number) => {
    console.log(itemsResponse?.totalPages)
    if (
      itemsResponse &&
      itemsResponse.totalPages > 0 &&
      (pageIndex > itemsResponse.totalPages || pageIndex < 1)
    ) {
      return
    }

    const params = {
      filter: {
        where: {
          itemCategoryId: idCategory,
        },
        relations: ['itemCategory'],
      },
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
        // Set lại list số các nút pagination
        if (pageIndex === 1) {
          setCurrentListPagination(getFirst(res.response.totalPages))
        } else if (pageIndex === res.response.totalPages) {
          setCurrentListPagination(getLast(res.response.totalPages))
        } else {
          setCurrentListPagination(
            getPagination(res.response.totalPages, pageIndex)
          )
        }
      }
    } catch (error) {
      alert('Có lỗi nè')
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
            getItems(res.response.items[0].id, 1)
          }
        }
      } catch (error) {
        alert('Có lỗi nè')
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
          console.log(res.response)
        }
      } catch (error) {
        alert('Có lỗi nè')
        console.log(error)
      }
    }

    getItemCategories()
    getUser()
    // if (!itemsResponse){
    //   getItems()
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCategoryIdByToggleState = (toggleState: number) => {
    return _.get(itemCategoriesResponse, `items.${toggleState}.id`, 0)
  }

  return (
    <DashboardLayout>
      <div className="w-100 ">
        <Container fluid="lg">
          <Row className="py-3 justify-content-between">
            <Col className="fs-22px fw-medium mb-3">Cửa hàng</Col>
            <Col xs={4} md={3} lg={2}>
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
          <Row className="">
            {itemsResponse?.items.map((item, idx) => (
              <Col key={idx} className="p-3" xs={6} xl={3}>
                <ItemShopV2
                  name={item.name}
                  avatar={item.avatar}
                  category={item.itemCategory.name}
                  description={item.description}
                  price={item.price}
                  type={item.type}
                  onClick={() => setShowModal(true)}
                />
              </Col>
            ))}
          </Row>

          <Row className="mt-3">
            <Col style={{ display: 'flex', justifyContent: 'center' }}>
              {itemsResponse ? (
                <Pagination>
                  <Pagination.First
                    onClick={() =>
                      getItems(getCategoryIdByToggleState(toggleState), 1)
                    }
                  />
                  <Pagination.Prev
                    onClick={() =>
                      getItems(
                        getCategoryIdByToggleState(toggleState),
                        currentPagination - 1
                      )
                    }
                  />
                  {currentListPagination?.map((item, idx) =>
                    item === currentPagination ? (
                      <Pagination.Item active>{item}</Pagination.Item>
                    ) : (
                      <Pagination.Item
                        onClick={() =>
                          getItems(
                            getCategoryIdByToggleState(toggleState),
                            item
                          )
                        }
                      >
                        {item}
                      </Pagination.Item>
                    )
                  )}

                  <Pagination.Next
                    onClick={() =>
                      getItems(
                        getCategoryIdByToggleState(toggleState),
                        currentPagination + 1
                      )
                    }
                  />
                  <Pagination.Last
                    onClick={() =>
                      getItems(
                        getCategoryIdByToggleState(toggleState),
                        itemsResponse.totalPages
                      )
                    }
                  />
                </Pagination>
              ) : (
                <div></div>
              )}
            </Col>
          </Row>
          {/* <MyModal
            show={showModal}
            onHide={() => setShowModal(false)}
            header={<div className="fs-24px fw-medium">Chỉnh sửa Quiz</div>}
            fullscreen
          ></MyModal> */}
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default ItemPage
