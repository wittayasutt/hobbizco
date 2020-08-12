import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Link from 'next/link'
import Head from 'next/head'

import { Divider, Layout } from '../components/commons'
import { SuggestedVideo } from '../components/suggestedVideo'
import { getPlayList } from '../services/playlist'

const RolesPage = ({ dataList }) => {
  const Roles = (title, datas) => {
    const totalSubCategory = datas.playlists.reduce(
      (accumulator, currentValue) => {
        return Number(accumulator) + Number(currentValue.total_video_playlist)
      },
      [0],
    )

    return (
      <>
        <Divider className="_bgcl-pmr-b " isLeft isMarginVertical />
        <Row className="_mgv-8px _pdt-8px">
          <Col xs={7} className="_fs-600 _cl-pmr-blue">
            <div>
              <span className="_fl-r">({totalSubCategory})</span>
              <div className="_fl-r">{title}&nbsp;</div>
            </div>
          </Col>
          <Col xs={17} className="_fs-300 _pdl-0px _pdr-28px">
            <Row>
              {datas?.playlists?.map((data) => (
                <Col xs={8} className="_mgbt-8px _fs-100 _pdr-0px" key={data?.name}>
                  <Link
                    href="/programme-list-by-vocabulary-and-term-data/[id]/[slug]"
                    as={`/programme-list-by-vocabulary-and-term-data/${data?.id}/${data?.slug}`}
                  >
                    <ItemWrapper
                      href={`/programme-list-by-vocabulary-and-term-data/${data?.id}/${data?.slug}`}
                      className="_tdcrt-n _cl-gray"
                    >
                      <div>
                        <div className="_fl-l _els-80p">{data?.name}</div>
                        <span className="_fl-r">({data?.total_video_playlist})</span>
                      </div>
                    </ItemWrapper>
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Roles | ProTeachersVideo</title>
        <meta
          name="description"
          content="Teachers TV education videos for professional development or to use in class - grouped by Role"
        />
      </Head>
      <Layout>
        <MainContentStyled className="_mgbt-24px">
          <Col xs={18} className="_pdl-0px">
            <Row>
              <Col xs={17} offset={{ xs: 7 }} className="_pdl-0px">
                <h2 className="_mgbt-12px _fs-700 _cl-l-blue _mgt-28px _fl-l">Roles</h2>
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                {Roles('Primary', dataList.primary)}
                {Roles('Secondary', dataList.secondary)}
              </Col>
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

export default RolesPage

RolesPage.getInitialProps = async () => {
  let dataList = {}
  try {
    const result = await Promise.all([
      getPlayList({ sub_category_id: 5 }), // roles => primary
      getPlayList({ sub_category_id: 6 }), // roles => secondary
    ])

    dataList = {
      primary: result[0].data,
      secondary: result[1].data,
    }
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
