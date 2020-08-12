/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Router from 'next/router'
import {
  Button,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  InputGroup,
  InputGroupAddon,
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap'
import { Row, Col } from 'react-grid-system'
import { Layout } from '../../components/backoffice'
import { Pagination } from '../../components/commons'
import { withAuthGuard } from '../../components/hocs'
import { PlusIcon, ThreeDotsIcon, PencilIcon, TrashIcon } from '../../components/icon'
import { getList, deleteVideo } from '../../services/video'
import { LIMIT } from '../../constants'

const AllVideosPage = () => {
  const [data, setData] = useState([])
  const [totalData, setTotalData] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryID, setCategoryID] = useState(null)
  const [keyword, setKeyword] = useState(null)

  const [dropdownOpen, setDropdownOpen] = useState({})
  const [checkboxRow, setCheckboxRow] = useState({})
  const [checkboxAll, setCheckboxAll] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState(false)

  const fetchVideoList = async (p = 1) => {
    const resultVideo = await getList({
      limit: LIMIT,
      offset: (p - 1) * LIMIT,
      ...(categoryID && { category_id: categoryID }),
      ...(keyword && { search: keyword }),
    })
    const dataFormatted = []

    resultVideo.data.rows.forEach((item) => {
      const resultItem = { ...item }
      resultItem.subCategory = {}

      if (item?.video_playlists?.length > 0) {
        item?.video_playlists.forEach((playlist) => {
          resultItem.subCategory[playlist?.playlist?.sub_category?.category_id] =
            playlist?.playlist?.sub_category?.name
        })
      }
      if (item?.video_subplaylists?.length > 0) {
        item?.video_subplaylists.forEach((sub_playlist) => {
          resultItem.subCategory[
            sub_playlist?.sub_playlist?.playlist?.sub_category?.category_id
          ] = sub_playlist?.sub_playlist?.playlist?.sub_category?.name
        })
      }

      dataFormatted.push(resultItem)
    })

    setData(dataFormatted)
    setTotalData(resultVideo?.data?.count)
    setCurrentPage(p)
  }

  const toggleActionRow = (id) => {
    setDropdownOpen({ ...dropdownOpen, [id]: !dropdownOpen[id] })
  }

  const onEditRow = (slug) => {
    Router.push(`/backoffice/add-video?slug=${slug}`)
  }

  const onDeleteRow = async (id) => {
    await deleteVideo(id)
    fetchVideoList(currentPage)
  }

  const onDeleteSelect = async () => {
    setConfirmDelete(false)

    const deleteAll = []
    Object.keys(checkboxRow).forEach((key) => {
      if (checkboxRow[key]) {
        deleteAll.push(deleteVideo(key))
      }
    })

    await Promise.all(deleteAll)
    fetchVideoList(currentPage)
  }

  const onSelectRow = (id, value) => {
    setCheckboxRow({ ...checkboxRow, [id]: value })
  }

  const onSearchKeyword = () => {
    fetchVideoList(1)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchVideoList(1)
    }
  }

  const onSelectAll = (value) => {
    setCheckboxAll(value)

    const newValueCheckboxRow = {}
    data.forEach((item) => {
      newValueCheckboxRow[item.id] = value
    })

    setCheckboxRow(newValueCheckboxRow)
  }

  const formatDate = (date) => {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()
    if (month.length < 2) month = `0${month}`
    if (day.length < 2) day = `0${day}`
    return [day, month, year].join('/')
  }

  const onChangePage = async (p) => {
    fetchVideoList(p)
  }

  useEffect(() => {
    fetchVideoList(1)
  }, [categoryID])

  // Component
  const ButtonAction = () => {
    return (
      <Row>
        <Col xs={18}>
          <Button
            color="primary"
            className="_mgr-8px"
            onClick={() => Router.push('/backoffice/add-video')}
          >
            <span className="_pdr-8px">Add New Video</span>
            <PlusIcon />
          </Button>

          <InputGroup className="_search">
            <Input
              name="keyword"
              id="keyword"
              placeholder="Search Video"
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <InputGroupAddon addonType="append">
              <Button onClick={onSearchKeyword} color="secondary">
                Search
              </Button>
            </InputGroupAddon>
          </InputGroup>

          <Input
            value={categoryID || 0}
            type="select"
            name="select"
            id="exampleSelect"
            className="_filter"
            onChange={(e) => setCategoryID(Number(e.target.value))}
          >
            <option value={0}>All Filter</option>
            <option value={2}>Top Series</option>
            <option value={4}>Roles</option>
            <option value={3}>Subjects</option>
            <option value={5}>Whole School</option>
          </Input>
        </Col>
        <Col xs={6} className="_tal-r">
          <span className="_pdr-8px">Bulk Action</span>
          <Button color="danger" id="delete-select">
            Delete Selected
          </Button>

          <Popover
            placement="bottom"
            isOpen={confirmDelete}
            target="delete-select"
            toggle={() => setConfirmDelete(!confirmDelete)}
          >
            <PopoverHeader>Are you sure!</PopoverHeader>
            <PopoverBody>
              <Button
                onClick={onDeleteSelect}
                color="primary"
                className="_mgr-16px _pdh-28px"
              >
                OK
              </Button>
              <Button outline color="secondary" onClick={() => setConfirmDelete(false)}>
                CANCEL
              </Button>
            </PopoverBody>
          </Popover>
        </Col>
      </Row>
    )
  }

  const TableData = () => {
    return (
      <Row className="_pdt-16px">
        <Col xs={24}>
          <Table hover striped>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    aria-label="Checkbox for following text input"
                    className="_cs-pt"
                    checked={checkboxAll}
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                </th>
                <th scope="col">Name</th>
                <th scope="col">Top Series</th>
                <th scope="col">Roles</th>
                <th scope="col">Subjects</th>
                <th scope="col">Whole School</th>
                <th scope="col">Last Updated</th>
                <th scope="col"> </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr key={item.id}>
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Checkbox for following text input"
                      className="_cs-pt"
                      checked={checkboxRow[item.id] || false}
                      onChange={(e) => onSelectRow(item.id, e.target.checked)}
                    />
                  </th>
                  <td>{item.title}</td>
                  <td>{item?.subCategory[2]}</td>
                  <td>{item?.subCategory[4]}</td>
                  <td>{item?.subCategory[3]}</td>
                  <td>{item?.subCategory[5]}</td>
                  <td>{formatDate(item.updated_at)}</td>
                  <td>
                    <Dropdown
                      isOpen={dropdownOpen[item.id]}
                      toggle={() => toggleActionRow(item.id)}
                      direction="left"
                    >
                      <DropdownToggle>
                        <ThreeDotsIcon />
                      </DropdownToggle>

                      <DropdownMenu>
                        <DropdownItem onClick={() => onEditRow(item.slug)}>
                          <PencilIcon />
                          <span className="_pdl-8px">Edit</span>
                        </DropdownItem>
                        <DropdownItem onClick={() => onDeleteRow(item.id)}>
                          <TrashIcon />
                          <span className="_pdl-8px">Delete</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            total={totalData}
            currentPage={currentPage}
            onChange={onChangePage}
            pageOffset={LIMIT}
          />
        </Col>
      </Row>
    )
  }

  return (
    <Layout page="all-videos">
      <Wrapper className="_pd-18px">
        {ButtonAction()}
        {TableData()}
      </Wrapper>
    </Layout>
  )
}

export default withAuthGuard(AllVideosPage)

const Wrapper = styled.div`
  .dropleft.dropdown button {
    background: none;
    border: none;
    color: #000;

    &:focus {
      box-shadow: none;
    }
  }
  .dropdown-menu.show {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
  }

  ._search {
    width: 300px;
    display: inline-flex;
    padding-top: 0px;
    padding-right: 10px;
  }

  ._filter {
    width: 200px;
    display: inline-flex;
    padding: 0px;
  }
`
