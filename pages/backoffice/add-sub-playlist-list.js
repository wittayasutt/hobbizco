/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Input, Button, Modal, ModalBody, ModalFooter, Table } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { withAuthGuard } from '../../components/hocs'
import { Layout } from '../../components/backoffice'
import { ExclamationIcon, MinusFillIcon } from '../../components/icon'
import {
  createSubPlaylist,
  getPlayList,
  deleteSubPlaylist,
} from '../../services/playlist'
import { SUB_CATEGORY } from '../../constants'

const AddSubPlaylistPage = () => {
  const [subPlaylistList, setSubPlaylistList] = useState([])

  const fetchPlayListAll = async () => {
    const resultList = await getPlayList()
    const sub = []
    resultList?.data?.playlists.forEach((item) => {
      const newSub = item.sub_playlists?.map((subItem) => ({
        ...subItem,
        sub_category_id: item.sub_category_id,
        playlist_name: item.name,
      }))

      sub.push(...newSub)
    })

    console.log('sub', sub)

    setSubPlaylistList(sub)
  }

  const onDelete = async (id) => {
    await deleteSubPlaylist(id)
    fetchPlayListAll()
  }

  useEffect(() => {
    fetchPlayListAll()
  }, [])

  const ListAll = () => {
    return (
      <ListWrapper className="_pdt-48px">
        <h3>Sub Playlist List</h3>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Playlist Name</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {subPlaylistList?.map((subPlaylist, index) => (
              <tr key={subPlaylist.id}>
                <th scope="row">{index + 1}</th>
                <th scope="row">{subPlaylist.name}</th>
                <th scope="row">{subPlaylist.slug}</th>
                <th scope="row">{subPlaylist.playlist_name}</th>
                <th scope="row">
                  {
                    SUB_CATEGORY.find((item) => item.id === subPlaylist.sub_category_id)
                      ?.categoryName
                  }
                </th>
                <th scope="row">
                  {
                    SUB_CATEGORY.find((item) => item.id === subPlaylist.sub_category_id)
                      ?.subCategoryName
                  }
                </th>
                <th scope="row" className="_delete-icon">
                  <span onClick={() => onDelete(subPlaylist.id)}>
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
    <Layout page="add-sub-playlist">
      <div className="_pd-18px">{ListAll()}</div>
    </Layout>
  )
}

export default withAuthGuard(AddSubPlaylistPage)

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
