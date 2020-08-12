/* eslint-disable camelcase */
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ListVideo } from '../../../components/commons'
import { getPlayList, getVideoListByPlaylistID } from '../../../services/playlist'
import { SUB_CATEGORY, LIMIT } from '../../../constants'

const ProgramListBySeriesPage = ({ dataList }) => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState(dataList?.videos ? [...dataList?.videos] : [])

  const { id } = router.query

  const onChangePage = async (p) => {
    try {
      const resultVideo = await getVideoListByPlaylistID(id, {
        limit: LIMIT,
        offset: (p - 1) * LIMIT,
      })
      setData(resultVideo?.data?.videos)
      setCurrentPage(p)
    } catch (error) {
      console.log(error)
    }
  }

  const subCateSelect = SUB_CATEGORY?.find(
    (item) => item.id === dataList?.playlistData?.sub_category_id,
  )

  return (
    <>
      <Head>
        <title>
          {subCateSelect?.categoryName} > {subCateSelect?.subCategoryName} >{' '}
          {dataList?.playlistData?.name} | ProTeachersVideo
        </title>
        <meta
          name="description"
          content={`Teachers TV education videos - ${dataList?.playlistData?.name}`}
        />
      </Head>
      <ListVideo
        categoryName={subCateSelect?.categoryName}
        subCategoryName={subCateSelect?.subCategoryName}
        playlistName={dataList?.playlistData?.name}
        data={data}
        totalData={dataList?.count}
        currentPage={currentPage}
        onChangePage={onChangePage}
        pageOffset={LIMIT}
      />
    </>
  )
}

export default ProgramListBySeriesPage

ProgramListBySeriesPage.getInitialProps = async (req) => {
  let dataList = {}
  try {
    const { slug, id } = req.query
    const [resultVideo, resultPlaylist] = await Promise.all([
      getVideoListByPlaylistID(id, { limit: LIMIT }),
      getPlayList({ slug }),
    ])

    dataList = { ...resultVideo?.data, playlistData: resultPlaylist?.data?.playlists[0] }
  } catch (err) {
    console.log('err', err)
  }

  return { dataList }
}
