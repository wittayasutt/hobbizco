/* eslint-disable camelcase */
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Router, { useRouter } from 'next/router'
import Link from 'next/link'
import { searchPlaylist, searchVideo } from '../services/playlist'
import { Divider, Layout, Pagination } from '../components/commons'
import { LIMIT } from '../constants'

const SearchPage = (dataList) => {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [currentPageSeries, setCurrentPageSeries] = useState(1)
  const [currentPageProgram, setCurrentPageProgram] = useState(1)
  const [dataSeries, setDataSeries] = useState(dataList?.series)
  const [dataProgram, setDataProgram] = useState(dataList?.program)
  const firstUpdate = useRef(true)

  const { key } = router.query

  const onSearch = () => {
    Router.push(`/search-results?key=${keyword}`)
    window.scroll(0, 0)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch()
    }
  }

  const onChangePageSeries = async (p) => {
    try {
      const result = await searchPlaylist({
        search: key,
        limit: LIMIT,
        offset: (p - 1) * LIMIT,
      })
      setDataSeries(result?.data)
      setCurrentPageSeries(p)
    } catch (error) {
      console.log(error)
    }
  }

  const onChangePageProgram = async (p) => {
    try {
      const result = await searchVideo({
        search: key,
        limit: LIMIT,
        offset: (p - 1) * LIMIT,
      })
      setDataProgram(result?.data)
      setCurrentPageProgram(p)
    } catch (error) {
      console.log(error)
    }
  }

  const SearchByKey = async () => {
    try {
      const getAllData = Promise.all([
        searchPlaylist({ search: key, limit: LIMIT }), // roles => primary
        searchVideo({ search: key, limit: LIMIT }), // roles => secondary
      ])
      const result = await getAllData
      setDataSeries(result[0].data)
      setDataProgram(result[1].data)
      setCurrentPageSeries(1)
      setCurrentPageProgram(1)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setKeyword(key || '')
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    SearchByKey()
  }, [key])

  const Search = () => {
    return (
      <>
        <SearchWrapper className="_pdv-28px">
          <Col xs={18} offset={{ xs: 6 }} className="_tal-l">
            <span className="_fs-400 _pdr-12px">You searched for</span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <img
              src="/static/search.png"
              alt="search icon"
              onClick={onSearch}
              role="presentation"
            />
          </Col>
        </SearchWrapper>
        <Divider className="_bgcl-pmr-b" isLeft />
      </>
    )
  }

  const Series = () => {
    return (
      <>
        <Row className="_mgt-12px">
          <Col xs={6}>
            <h2 className="_mgbt-12px _fs-700 _cl-pmr-blue _mgt-0px _fl-r _fw-nm">
              Series
            </h2>
          </Col>
          <Col xs={18}>
            <Row>
              <Col xs={24}>
                {dataSeries?.rows?.map((item) => (
                  <VideoWrapper key={item?.id}>
                    <Row>
                      <Col xs={16} offset={{ xs: 7 }} className="_pdl-0px">
                        <Link
                          href="/programme-list-by-series/[id]/[slug]"
                          as={`/programme-list-by-series/${item?.id}/${item?.slug}`}
                        >
                          <a
                            href={`/programme-list-by-series/${item?.id}/${item?.slug}`}
                            className="_tdcrt-n _hv-tdcrt-udl _cl-d-blue "
                          >
                            <h4 className="_mgv-4px _fs-400 _cs-pt">
                              {item?.name} ({item?.video_playlists?.length})
                            </h4>
                          </a>
                        </Link>
                        <p className="_mgv-8px _fs-200 _cl-gray">{item?.description}</p>
                      </Col>
                    </Row>
                    <Divider className="_bgcl-l-b" isMarginVertical />
                  </VideoWrapper>
                ))}

                <Pagination
                  total={dataSeries?.count}
                  currentPage={currentPageSeries}
                  onChange={onChangePageSeries}
                  pageOffset={LIMIT}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider className="_bgcl-pmr-b" isLeft />
      </>
    )
  }

  const Program = () => {
    return (
      <>
        <Row className="_mgt-12px">
          <Col xs={6}>
            <h2 className="_mgbt-12px _fs-700 _cl-pmr-blue _mgt-0px _fl-r _fw-nm">
              Programmes
            </h2>
          </Col>
          <Col xs={18}>
            <Row>
              <Col xs={24}>
                {dataProgram?.rows?.map((item) => (
                  <div key={item?.id}>
                    <VideoWrapper>
                      <Row>
                        <Col xs={7}>
                          <img
                            className="cover"
                            src={`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/${item?.image_cover_url}`}
                            alt="cover"
                          />
                        </Col>
                        <Col xs={17} className="_pdl-0px">
                          <Link
                            href="/programme/[id]/[slug]"
                            as={`/programme/${item?.id}/${item?.slug}`}
                          >
                            <h4 className="_mgv-4px _fs-400 _cl-d-blue _hv-tdcrt-udl _cs-pt">
                              {item?.title}
                            </h4>
                          </Link>
                          <p className="_mgv-8px _fs-200 _cl-gray">{item?.sub_title}</p>
                          <div className="time-period _bgcl-pmr-b _fs-100 _fw-b _mgt-12px">
                            {item?.duration_minute} mins
                          </div>
                        </Col>
                      </Row>
                    </VideoWrapper>
                    <Divider className="_bgcl-l-b" isMarginVertical />
                  </div>
                ))}

                <Pagination
                  total={dataProgram?.count}
                  currentPage={currentPageProgram}
                  onChange={onChangePageProgram}
                  pageOffset={LIMIT}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    )
  }

  return (
    <Layout>
      <MainContentStyled className="_mgbt-24px">
        <Col xs={20} className="_pdl-0px">
          {Search()}
          {Series()}
          {Program()}
        </Col>
      </MainContentStyled>
      <Row>
        <Divider className="_bgcl-d-b" isLeft />
      </Row>
    </Layout>
  )
}

export default SearchPage

SearchPage.getInitialProps = async (req) => {
  let dataList = {}
  try {
    const { key } = req.query

    const result = await Promise.all([
      searchPlaylist({ search: key, limit: LIMIT }),
      searchVideo({ search: key, limit: LIMIT }),
    ])

    dataList = {
      series: result[0].data,
      program: result[1].data,
    }
  } catch (err) {
    console.log('err', err)
  }

  return dataList
}

const VideoWrapper = styled.div`
  padding: 10px 0 0;
  min-height: 85px;

  img.cover {
    width: 100%;
  }
  .time-period {
    color: white;
    width: fit-content;
    padding: 5px 4px;
    margin-bottom: 5px;
  }
`

const SearchWrapper = styled(Row)`
  input {
    width: 300px;
    height: 22px;
  }

  img {
    background-color: var(--color-primary-blue);
    width: 14px;
    vertical-align: middle;
    padding: 6px;
    margin-top: 4px;
    margin-left: 8px;
    cursor: pointer;
  }
`

const MainContentStyled = styled(Row)``
