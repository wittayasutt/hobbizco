/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Input, Button, Modal, ModalBody, ModalFooter, Table } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { withAuthGuard } from '../../components/hocs'
import { Layout } from '../../components/backoffice'
import { MinusFillIcon } from '../../components/icon'
import { getPlayList, deletePlaylist } from '../../services/playlist'
import { SUB_CATEGORY } from '../../constants'

const AddPlaylistPage = () => {
  const [playlistList, setPlaylistList] = useState([])

  const fetchList = async () => {
    const resultList = await getPlayList()
    setPlaylistList(resultList?.data?.playlists)
  }
  const onDelete = async (id) => {
    await deletePlaylist(id)
    fetchList()
  }

  useEffect(() => {
    fetchList()
  }, [])

  // Components
  const ListAll = () => {
    return (
      <ListWrapper className="_pdt-48px">
        <h3>Playlist List</h3>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {playlistList?.map((playlist, index) => (
              <tr key={playlist.id}>
                <th scope="row">{index + 1}</th>
                <th scope="row">{playlist.name}</th>
                <th scope="row">{playlist.slug}</th>
                <th scope="row">
                  {
                    SUB_CATEGORY.find((item) => item.id === playlist.sub_category_id)
                      ?.categoryName
                  }
                </th>
                <th scope="row">
                  {
                    SUB_CATEGORY.find((item) => item.id === playlist.sub_category_id)
                      ?.subCategoryName
                  }
                </th>
                <th scope="row" className="_delete-icon">
                  <span onClick={() => onDelete(playlist.id)}>
                    <MinusFillIcon />
                  </span>
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
      </ListWrapper>
    )
  }

  return (
    <Layout page="add-playlist">
      <div className="_pd-18px">{ListAll()}</div>
    </Layout>
  )
}

export default withAuthGuard(AddPlaylistPage)

const ListWrapper = styled.div`
  ._delete-icon {
    span {
      cursor: pointer;
    }
    svg {
      color: red;
    }
  }
`
