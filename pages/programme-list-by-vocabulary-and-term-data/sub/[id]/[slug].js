/* eslint-disable camelcase */
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ListVideo } from '../../../../components/commons'
import {
  getVideoListBySubplaylistID,
  getSubPlayListByID,
} from '../../../../services/playlist'
import { SUB_CATEGORY, LIMIT } from '../../../../constants'

const ProgramListByVocabPage = ({ dataList }) => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  const [data, setData] = useState(dataList?.videos ? [...dataList?.videos] : [])
  const { id } = router.query

  const onChangePage = async (p) => {
    try {
      const resultVideo = await getVideoListBySubplaylistID(id, {
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
    (item) => item.id === dataList?.subPlaylistData?.playlist?.sub_category_id,
  )

  return (
    <>
      <Head>
        <title>
          {subCateSelect?.categoryName} >{' '}
          {`${subCateSelect?.subCategoryName} ${dataList?.subPlaylistData?.playlist?.name} > ${dataList?.subPlaylistData?.name}`}{' '}
          | ProTeachersVideo
        </title>
        <meta
          name="description"
          content={`Teachers TV education videos - ${dataList?.subPlaylistData?.name}`}
        />
      </Head>
      <ListVideo
        categoryName={subCateSelect?.categoryName}
        subCategoryName={`${subCateSelect?.subCategoryName} ${dataList?.subPlaylistData?.playlist?.name}`}
        playlistName={dataList?.subPlaylistData?.name}
        data={data}
        totalData={dataList?.count}
        currentPage={currentPage}
        onChangePage={onChangePage}
        pageOffset={LIMIT}
      />
    </>
  )
}

export default ProgramListByVocabPage

ProgramListByVocabPage.getInitialProps = async (req) => {
  let dataList = {}
  try {
    const { id } = req.query

    const [resultVideo, resultSubPlaylist] = await Promise.all([
      getVideoListBySubplaylistID(id, { limit: LIMIT }),
      getSubPlayListByID(id),
    ])

    dataList = { ...resultVideo?.data, subPlaylistData: resultSubPlaylist?.data }
  } catch (err) {
    console.log('err', err)
  }

  return { dataList }
}
