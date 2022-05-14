import classNames from 'classnames'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { Col, Container, Pagination, Row } from 'react-bootstrap'
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout'
import ItemShop from '../../components/ItemShop/ItemShop'
import { get } from '../../libs/api'
import {
  TApiResponse,
  TItem,
  TItemCategory,
  TPaginationResponse
} from '../../types/types'

// const socket = io(`${API_URL}/games`, { transports: ['websocket'] })

const ItemPage: NextPage = () => {
  const [toggleState, setToggleState] = useState<number>(1)
  const [itemsResponse, setItemsResponse] =
    useState<TPaginationResponse<TItem>>()
  const [itemCategoriesResponse, setItemCategoriesResponse] =
    useState<TPaginationResponse<TItemCategory>>()
  const [currentListPagination, setCurrentListPagination] = useState<number[]>()
  const [currentPagination, setCurrentPagination] = useState<number>(1)
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

  const getItems = async (idCategory: number, pageIndex: number) => {
    if (
      itemsResponse &&
      (pageIndex > itemsResponse.totalPages || pageIndex < 1)
    )
      return
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
        //Set lại list số các nút pagination
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
            setToggleState(res.response.items[0].id)
            getItems(res.response.items[0].id, 1)
          }
        }
      } catch (error) {
        alert('Có lỗi nè')
        console.log(error)
      }
    }
    getItemCategories()
    // if (!itemsResponse){
    //   getItems()
    // }
  }, [])

  // console.log(data);

  return (
    <DashboardLayout>
      <div className="w-100">
        <Container fluid="lg">
          <Row className="mt-2 pt-2 align-items-center">
            <Col
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '25px',
                textAlign: 'center',
              }}
              xs={2}
            >
              Cửa hàng vật phẩm
            </Col>
            <Col xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
              {itemCategoriesResponse?.items.map((category, idx) => (
                <div
                  key={category.id}
                  className={
                    toggleState === category.id ? 'tabs active-tabs' : 'tabs'
                  }
                  onClick={() => toggleTab(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </Col>
            <Col xs={2}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  backgroundColor: '#006557',
                  fontSize: '25px',
                  borderRadius: 10,
                  padding: 2,
                  fontWeight: 'bold',
                  color: '#D1B550',
                }}
              >
                <div
                  className={classNames('bi bi-coin')}
                  style={{ marginLeft: 10 }}
                ></div>
                <div style={{ paddingLeft: '10px' }}>800,000</div>
              </div>
            </Col>
          </Row>
          <Row
            className={
              toggleState === toggleState ? 'content' : 'deactive-content'
            }
          >
            {itemsResponse?.items.map((item, idx) => (
              <Col key={item.id} className="p-3" xs={3}>
                <ItemShop />
              </Col>
            ))}
          </Row>
          <Row className="mt-3">
            <Col style={{ display: 'flex', justifyContent: 'center' }}>
              {itemsResponse ? (
                <Pagination>
                  <Pagination.First onClick={() => getItems(toggleState, 1)} />
                  <Pagination.Prev
                    onClick={() => getItems(toggleState, currentPagination - 1)}
                  />
                  {currentListPagination?.map((item, idx) =>
                    item === currentPagination ? (
                      <Pagination.Item active>{item}</Pagination.Item>
                    ) : (
                      <Pagination.Item
                        onClick={() => getItems(toggleState, item)}
                      >
                        {item}
                      </Pagination.Item>
                    )
                  )}

                  <Pagination.Next
                    onClick={() => getItems(toggleState, currentPagination + 1)}
                  />
                  <Pagination.Last
                    onClick={() =>
                      getItems(toggleState, itemsResponse.totalPages)
                    }
                  />
                </Pagination>
              ) : (
                <div></div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </DashboardLayout>
  )
}

export default ItemPage
