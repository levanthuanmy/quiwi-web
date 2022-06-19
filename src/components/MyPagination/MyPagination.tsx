import { FC } from 'react'
import ReactPaginate from 'react-paginate'

export const MyPagination: FC<{
  handlePageClick: (selected: { selected: number }) => void
  totalPages: number
}> = ({ handlePageClick, totalPages }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageClassName="page-item"
      marginPagesDisplayed={2}
      pageCount={totalPages}
      previousLabel="<"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      activeClassName="active"
    />
  )
}
