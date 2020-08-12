import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import ReactPaginate from 'react-paginate'

const Pagination = ({ total, currentPage, onChange, pageOffset = 6 }) => {
  const totalPage = Math.ceil(total / pageOffset)
  const page = (currentPage - 1) * pageOffset
  const offsetPage = pageOffset + page >= total ? total : pageOffset + page

  return (
    <PaginationWrapper className="_pdv-0px _fs-200">
      <Col xs={10} className="_tal-l _fst-itl result">
        Results {page + 1} - {offsetPage} of {total}
      </Col>
      <Col xs={14} className="_tal-r">
        <ReactPaginate
          previousLabel={null}
          nextLabel={null}
          breakLabel="..."
          pageCount={totalPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={(e) => onChange(e.selected + 1)}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeLinkClassName="active"
          pageLinkClassNam="pagelink"
          forcePage={currentPage - 1}
        />
      </Col>
    </PaginationWrapper>
  )
}

export default Pagination

const PaginationWrapper = styled(Row)`
  .result {
    line-height: 40px;
  }
  ul {
    display: inline-block;
  }

  li {
    display: inline-block;
    padding: 1px;
    a {
      padding: 2px 5px;
      cursor: pointer;
      outline: none;
      color: #000;
      font-weight: bold;
      font-size: 0.6875rem;
      &.active {
        background-color: #d8d8d8;
        color: #fff;
      }
    }
  }

  li.previous,
  li.next {
    display: none;
  }
`
