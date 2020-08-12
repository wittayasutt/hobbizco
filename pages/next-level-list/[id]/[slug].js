/* eslint-disable camelcase */
import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Link from 'next/link'
import Head from 'next/head'

import { Divider, Layout } from '../../../components/commons'
import { SuggestedVideo } from '../../../components/suggestedVideo'
import { getPlayList } from '../../../services/playlist'
import { SUB_CATEGORY } from '../../../constants'

const NextLevelPage = ({ dataList }) => {
  const datas = dataList?.map((item) => ({
    ...item,
    title: SUB_CATEGORY.find((sc) => sc.id === item.sub_category_id)?.subCategoryName,
  }))

  const subCateSelect = SUB_CATEGORY?.find(
    (item) => item.id === dataList[0]?.sub_category_id,
  )

  const List = () => {
    return (
      <>
        <Row>
          <Col xs={18} offset={{ xs: 6 }} className="_dp-f">
            <h2 className="_cl-l-blue _mgbt-12px _mgt-28px _fs-700">
              {subCateSelect?.categoryNameForDisplay}
            </h2>
            <h2 className="_cl-d-blue _mgbt-12px _mgt-28px _fs-700 _mgl-8px">
              > {dataList[0]?.name}
            </h2>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            {datas.map((data) => (
              <div key={data.id}>
                <Divider className="_bgcl-pmr-b " isLeft isMarginVertical />

                <Row className="_mgv-8px _pdt-8px">
                  <Col xs={6} className="_fs-600 _cl-pmr-blue _pdh-0px">
                    <div>
                      <span className="_fl-r">({data.total_video_playlist})</span>
                      <div className="_fl-r">{data.title}&nbsp;</div>
                    </div>
                  </Col>
                  <Col xs={18} className="_fs-300">
                    <Row>
                      {data?.sub_playlists?.map((sub) => (
                        <Col xs={8} className="_mgbt-8px _fs-100" key={sub.id}>
                          <Link
                            href="/programme-list-by-vocabulary-and-term-data/sub/[id]/[slug]"
                            as={`/programme-list-by-vocabulary-and-term-data/sub/${sub.id}/${sub.slug}`}
                          >
                            <ItemWrapper
                              href={`/programme-list-by-vocabulary-and-term-data/sub/${sub.id}/${sub.slug}`}
                              className="_tdcrt-n _cl-gray"
                            >
                              <div>
                                <div className="_fl-l _els-80p">{sub.name}</div>
                                <span className="_fl-r">
                                  ({sub?.total_video_subplaylist})
                                </span>
                              </div>
                            </ItemWrapper>
                          </Link>
                        </Col>
                      ))}
                    </Row>
                    <Row className="_pdt-18px _tal-r">
                      <Col xs={24}>
                        <Link
                          href="/programme-list-by-vocabulary-and-term-data/[id]/[slug]"
                          as={`/programme-list-by-vocabulary-and-term-data/${data.id}/${data.slug}`}
                        >
                          <a
                            href={`/programme-list-by-vocabulary-and-term-data/${data.id}/${data.slug}`}
                            className="_tdcrt-n _cl-pmr-blue _hv-tdcrt-udl"
                          >
                            Show all {data.title} {dataList[0]?.name}
                          </a>
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            ))}
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>
          {subCateSelect?.categoryNameForDisplay} > {dataList[0]?.name} | ProTeachersVideo
        </title>
        <meta
          name="description"
          content={`Teachers TV education videos for professional development or to use in class - ${dataList[0]?.name}`}
        />
      </Head>
      <Layout>
        <MainContentStyled className="_mgbt-24px">
          <Col xs={18}>{List()}</Col>
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

export default NextLevelPage

NextLevelPage.getInitialProps = async (req) => {
  let dataList = {}
  try {
    const { slug } = req.query
    const resultPlaylist = await getPlayList({ slug })
    dataList = resultPlaylist?.data?.playlists
  } catch (err) {
    console.log('err', err)
  }

  return { dataList }
}

const ItemWrapper = styled.a`
  > div {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #ddd;
    padding-top: 6px;
  }

  :hover {
    > div {
      border-bottom: 2px solid #aaaaaa;
    }
  }
`

const MainContentStyled = styled(Row)``
