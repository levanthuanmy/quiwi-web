import { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import ListItemByCategory from '../../components/ListItem/ListItemByCategory'
import {
  TItemCategory,
  TPaginationResponse,
  TUserItems
} from '../../types/types'

const UserItemPage: FC<{
  itemCategories: TPaginationResponse<TItemCategory>
  userItems: TUserItems[]
}> = ({ itemCategories, userItems }) => {
console.log('itemCategories', itemCategories)
  return (
    <div>
      <div className="w-100">
        <Row className="justify-content-md-center">
          <Col>
            {itemCategories?.items.map((category, idx) => (
              <ListItemByCategory
                key={idx}
                name={category.name}
                id={category.id}
                userItems={userItems}
              />
            ))}
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default UserItemPage
