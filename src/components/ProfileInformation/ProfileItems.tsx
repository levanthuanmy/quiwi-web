import { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import BadgesPage from '../../pages/badges'
import UserItemPage from '../../pages/user-items'
import {
  TItemCategory,
  TPaginationResponse,
  TUserItems,
  TUserProfile,
} from '../../types/types'
import Loading from '../Loading/Loading'

const ProfileItems: FC<{
  userProfile?: TUserProfile

  itemCategoriesResponse?: TPaginationResponse<TItemCategory>
  userItems?: TUserItems[]
}> = ({ userProfile, itemCategoriesResponse, userItems }) => {
  return (
    <Col xs={12} md={7} xl={8} className="mt-3">
      <div className="pb-3">
        <div className="bg-white p-12px rounded-8px shadow-sm d-flex flex-column gap-3 overflow-hidden h-100 justify-content-between">
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
      </div>
      <div className="">
        <div className="bg-white p-12px rounded-8px shadow-sm d-flex flex-column gap-3 overflow-hidden h-100 justify-content-between">
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
          {/* 
      <div className="text-center border-top pt-12px pb-1 text-secondary opacity-75">
        Xem Tất Cả
      </div> */}
        </div>
      </div>
    </Col>
  )
}
export default ProfileItems
