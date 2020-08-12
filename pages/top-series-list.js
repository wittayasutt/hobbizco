/* eslint-disable camelcase */
import React, { useState } from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Link from 'next/link'
import Head from 'next/head'

import { Divider, Layout, Pagination } from '../components/commons'
import { SuggestedVideo } from '../components/suggestedVideo'
import { getPlayList } from '../services/playlist'
import { LIMIT } from '../constants'

const TopSeries = ({ dataList }) => {
  const Detail = (title, type) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [data, setData] = useState(
      dataList[type]?.playlists ? [...dataList[type].playlists] : [],
    )

    const totalData = dataList[type]?.total
    const pageOffset = LIMIT

    const onChangePage = async (p) => {
      try {
        const result = await getPlayList({
          sub_category_id: type === 'cpd' ? 1 : 2,
          limit: LIMIT,
          offset: (p - 1) * LIMIT,
        })
        setData(result?.data?.playlists)
        setCurrentPage(p)
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <>
        <Head>
          <title>Series | ProTeachersVideo</title>
          <meta
            name="description"
            content="Teachers TV education videos for professional development or to use in class - grouped by Series"
          />
        </Head>
        <Row>
          <Col xs={24}>
            <h2 className="_mgbt-12px _fs-600 _cl-pmr-blue">{title}</h2>
          </Col>
        </Row>
        <Divider className="_bgcl-d-b" isLeft isMarginVertical />
        {data.map((item) => (
          <div key={item.id} className="_pdv-8px">
            <Link
              href="/programme-list-by-series/[id]/[slug]"
              as={`/programme-list-by-series/${item.id}/${item.slug}`}
            >
              <a
                href={`/programme-list-by-series/${item.id}/${item.slug}`}
                className="_tdcrt-n _hv-tdcrt-udl"
              >
                <h3 className="_fs-200 _cl-pmr-blue _mgv-0px">
                  {item.name} ({item.total_video})
                </h3>
              </a>
            </Link>

            <p className="_fs-200 _pdh-12px _pdv-8px _mgv-0px content">
              {item.description}
            </p>
            <Divider className="_bgcl-l-b" isLeft isMarginVertical />
          </div>
        ))}
        <Pagination
          total={totalData}
          currentPage={currentPage}
          onChange={onChangePage}
          pageOffset={pageOffset}
        />
      </>
    )
  }

  return (
    <>
      <Layout>
        <MainContentStyled className="_mgbt-24px">
          <Col xs={18} className="_pdl-0px">
            <Row>
              <Col xs={24}>
                <h1 className="_mgbt-0px _fs-700 _cl-l-blue _mgt-28px _fl-l">
                  Top Series
                </h1>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>{Detail('CPD', 'cpd')}</Col>
              <Col xs={12}>{Detail('In-Class', 'inClass')}</Col>
            </Row>
          </Col>
          <Col xs={6} className="_pdr-0px">
            <SuggestedVideo />
          </Col>
        </MainContentStyled>
        <Row>
          <Divider className="_bgcl-d-b" isLeft />
        </Row>
      </Layout>
    </>
  )
}

export default TopSeries

TopSeries.getInitialProps = async () => {
  let dataList = {}
  try {
    const result = await Promise.all([
      getPlayList({ sub_category_id: 1, limit: LIMIT }), // top series => cpd
      getPlayList({ sub_category_id: 2, limit: LIMIT }), // top series => in-class
    ])

    dataList = {
      cpd: result[0].data,
      inClass: result[1].data,
    }
  } catch (err) {
    console.log('err', err)
  }

  return { dataList }
}

const MainContentStyled = styled(Row)`
  .content {
    height: 7.5em;
    line-height: 1.5;
  }
`
