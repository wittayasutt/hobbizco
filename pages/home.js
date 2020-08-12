/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Link from 'next/link'
import { Divider, Layout } from '../components/commons'
import { SuggestedVideo } from '../components/suggestedVideo'
import { getPlayList } from '../services/playlist'

const LIMIT = 20

const listSubCategory = [
  {
    id: 1,
    title: 'Top Series In-Class',
    color: 'light',
    link: '/top-series-list',
  },
  {
    id: 2,
    title: 'Top Series CPD',
    color: 'dark',
    link: '/top-series-list',
  },
  {
    id: 3,
    title: 'Subjects primary',
    color: 'dark',
    link: '/subject-list',
  },
  {
    id: 4,
    title: 'Subjects secondary',
    color: 'light',
    link: '/subject-list',
  },
  {
    id: 5,
    title: 'Roles primary',
    color: 'dark',
    link: '/role-list',
  },
  {
    id: 6,
    title: 'Roles secondary',
    color: 'dark',
    link: '/role-list',
  },
  {
    id: 7,
    title: 'Whole school primary',
    color: 'light',
    link: '/whole-school-issue-list',
  },
  {
    id: 8,
    title: 'Whole school secondary',
    color: 'dark',
    link: '/whole-school-issue-list',
  },
]

const detailList = [
  {
    id: 1,
    title: 'Top Series',
    description: 'CPD and In-Class<br/>to use with pupils',
    image: '/static/home/1.jpg',
    link: 'top-series-list',
  },
  {
    id: 2,
    title: 'Subjects',
    description: 'Covering Primary<br/>and secondary curricurum',
    image: '/static/home/2.jpg',
    link: 'subject-list',
  },
  {
    id: 3,
    title: 'Roles',
    description: 'Videos for all roles<br/>and responsibility',
    image: '/static/home/3.jpg',
    link: 'role-list',
  },
  {
    id: 4,
    title: 'Whole school Issues',
    description: 'Including Behavior<br/>Leadership and Early Years',
    image: '/static/home/4.jpg',
    link: '/whole-school-issue-list',
  },
]

const HomePage = ({ dataList }) => {
  const getDataWithSubPlaylist = (data) => {
    return data.map((item) => ({
      ...item,
      href:
        item?.sub_playlists?.length > 0
          ? '/next-level-list/[id]/[slug]'
          : '/programme-list-by-vocabulary-and-term-data/[id]/[slug]',
      asPath:
        item?.sub_playlists?.length > 0
          ? `/next-level-list/${item.id}/${item.slug}`
          : `/programme-list-by-vocabulary-and-term-data/${item.id}/${item.slug}`,
    }))
  }
  const formatData = (data) => {
    const newData = [...data]
    newData[0].sub = data[0]?.sub?.map((item) => ({
      ...item,
      href: '/programme-list-by-series/[id]/[slug]',
      asPath: `/programme-list-by-series/${item.id}/${item.slug}`,
    }))
    newData[1].sub = data[1]?.sub?.map((item) => ({
      ...item,
      href: '/programme-list-by-series/[id]/[slug]',
      asPath: `/programme-list-by-series/${item.id}/${item.slug}`,
    }))
    newData[2].sub = getDataWithSubPlaylist(data[2]?.sub)
    newData[3].sub = getDataWithSubPlaylist(data[3]?.sub)
    newData[4].sub = getDataWithSubPlaylist(data[4]?.sub)
    newData[5].sub = getDataWithSubPlaylist(data[5]?.sub)
    newData[6].sub = getDataWithSubPlaylist(data[6]?.sub)
    newData[7].sub = getDataWithSubPlaylist(data[7]?.sub)
    return newData
  }

  let dataFormat = []
  if (dataList && dataList.length > 0) {
    dataFormat = formatData(dataList)
  }

  const List = () => {
    return (
      <>
        <Row>
          <Col xs={24}>
            {dataFormat?.map((data) => (
              <div key={data.id}>
                <Divider className="_bgcl-pmr-b " isLeft isMarginVertical />
                <Row className="_mgv-8px _pdt-8px">
                  <Col
                    xs={7}
                    className={`_pdr-16px _pdl-36px _fs-700 ${
                      data.color === 'dark' ? '_cl-pmr-blue' : '_cl-l-blue'
                    } `}
                  >
                    <span className="_fl-r _tal-r">
                      <Link href={data.link}>
                        <a
                          href={data.link}
                          className={`fw-b _tdcrt-n _pdl-16px _tal-r ${
                            data.color === 'dark' ? '_cl-pmr-blue' : '_cl-l-blue'
                          } `}
                        >
                          {data.title}
                        </a>
                      </Link>
                    </span>
                  </Col>
                  <Col xs={17} className="_fs-300 _pdl-0px _pdr-28px">
                    <Row>
                      {data?.sub?.map((sub) => (
                        <Col xs={8} className="_mgbt-8px _fs-100 _pdr-0px" key={sub.id}>
                          <Link href={`${sub.href}`} as={sub.asPath}>
                            <ItemWrapper href={sub.asPath} className="_tdcrt-n _cl-gray">
                              <div>
                                <div className="_fl-l _els-80p">{sub.name}</div>
                                <span className="_fl-r">({sub.total_video})</span>
                              </div>
                            </ItemWrapper>
                          </Link>
                        </Col>
                      ))}
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

  const Detail = () => {
    return (
      <>
        <DetailWrapper>
          <Col xs={17} offset={{ xs: 7 }} className="_pdl-0px">
            <h2 className="_mgbt-12px _fs-700 _cl-l-blue _mgt-28px">
              Welcome to ProTeachersVideo
            </h2>
            <p className="_mgbt-12px _fs-300 _pdl-12px paragraph">
              <span className="_fw-b">ProTeachersVideo</span> offers you easy access to
              the entire{' '}
              <Link href="/about-us">
                <a href="/about-us" className="_cl-l-blue _tdcrt-n">
                  Teachers TV
                </a>
              </Link>{' '}
              archive of high quality professional development videos. They cover the full
              range of curriculum subjects as well as school improvement topics. They
              offer a unique library of professional development resources that can be
              used by individual teachers and by educational professionals and teacher
              trainers to share effective practice and support reflective and
              collaborative improvement.
              <br />
              <br />
              <br />
              There are two ways to search the archive. You can review the lists of
              programmes and series below or you can use the search box to find specific
              videos.
            </p>
            <Row>
              {detailList.map((detail) => (
                <ImageWrapper xs={12} key={detail.id}>
                  <Link href={detail.link}>
                    <a href={detail.link} className="_cl-gray">
                      <img src={detail.image} alt="Pro teacher" />
                      <div className="wrapper-text">
                        <h3 dangerouslySetInnerHTML={{ __html: detail.title }} />
                        <h4 dangerouslySetInnerHTML={{ __html: detail.description }} />
                      </div>
                    </a>
                  </Link>
                </ImageWrapper>
              ))}
            </Row>
          </Col>
        </DetailWrapper>
      </>
    )
  }

  return (
    <Layout>
      <MainContentStyled className="_mgbt-24px">
        <Col xs={18} className="_pdl-0px">
          {Detail()}
          {List()}
        </Col>
        <Col xs={6} className="_pdr-0px">
          <SuggestedVideo />
        </Col>
      </MainContentStyled>
      <Row>
        <Divider className="_bgcl-d-b" isLeft />
      </Row>
    </Layout>
  )
}

HomePage.getInitialProps = async () => {
  let dataList = []
  try {
    const result = await Promise.all([
      getPlayList({ sub_category_id: 2, limit: LIMIT }), // top series => in-class
      getPlayList({ sub_category_id: 1, limit: LIMIT }), // top series => cpd
      getPlayList({ sub_category_id: 3, limit: LIMIT }), // subjects => primary
      getPlayList({ sub_category_id: 4, limit: LIMIT }), // subjects => secondary
      getPlayList({ sub_category_id: 5, limit: LIMIT }), // roles => primary
      getPlayList({ sub_category_id: 6, limit: LIMIT }), // roles => secondary
      getPlayList({ sub_category_id: 7, limit: LIMIT }), // whole school => primary
      getPlayList({ sub_category_id: 8, limit: LIMIT }), // whole school => secondary
    ])

    dataList = listSubCategory.map((item, i) => ({
      ...item,
      sub: result[i]?.data?.playlists,
    }))
  } catch (err) {
    console.log('err', err)
  }

  return { dataList }
}

export default HomePage

const DetailWrapper = styled(Row)`
  .paragraph {
    line-height: 1.5;
  }
`

const ImageWrapper = styled(Col)`
  position: relative;
  padding: 8px;
  min-height: 140px !important;

  img {
    width: 100%;
  }
  .wrapper-text {
    position: absolute;
    top: 8px;
    width: 89%;
    height: 89%;
  }
  h3 {
    position: absolute;
    top: 0;
    margin: 15px;
    font-size: 28px;
  }
  h4 {
    position: absolute;
    bottom: 0;
    margin: 15px;
    font-size: 14px;
  }

  a:hover {
    .wrapper-text {
      background-color: rgba(63, 190, 255, 0.5);
    }
    h3 {
      color: #fff !important;
    }
    h4 {
      color: #eee !important;
    }
  }
`

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
