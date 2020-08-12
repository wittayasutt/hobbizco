import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Link from 'next/link'
import { Divider, Layout, Pagination } from '.'

const VideoList = ({
  categoryName,
  subCategoryName,
  playlistName,
  data,
  totalData,
  currentPage,
  onChangePage,
  pageOffset,
}) => {
  const Content = () => {
    return (
      <>
        <Row>
          <Col xs={24} className="_mgt-28px">
            <h2 className="_mgbt-12px _fs-700 _mgt-0px _cl-l-blue _fl-l">
              {categoryName}
            </h2>
            <h2 className="_mgbt-12px _fs-700 _mgt-0px _cl-d-blue _fl-l _pdl-12px">
              > {subCategoryName}
            </h2>
            {playlistName && (
              <h2 className="_mgbt-12px _fs-700 _mgt-0px _cl-l-blue _fl-l _pdl-12px">
                > {playlistName}
              </h2>
            )}
          </Col>
        </Row>
        <Divider className="_bgcl-d-b" />
        <Row>
          <Col xs={24}>
            {data?.map((item) => (
              <div key={item.id}>
                <VideoWrapper>
                  <Row>
                    <Col xs={7}>
                      <img
                        className="cover"
                        src={`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/${item.image_cover_url}`}
                        alt="cover"
                      />
                    </Col>
                    <Col xs={17} className="_pdl-0px">
                      <Link
                        href="/programme/[id]/[slug]"
                        as={`/programme/${item.id}/${item.slug}`}
                      >
                        <a
                          href={`/programme/${item.id}/${item.slug}`}
                          className="_tdcrt-n _hv-tdcrt-udl"
                        >
                          <h4 className="_mgv-4px _fs-300 _cl-d-blue">{item.title}</h4>
                        </a>
                      </Link>
                      <p className="_mgv-8px _fs-200 _cl-gray">{item.sub_title}</p>
                      <div className="time-period _bgcl-pmr-b _fs-100 _fw-b _mgt-12px">
                        {item.duration_minute} mins
                      </div>
                    </Col>
                  </Row>
                </VideoWrapper>
                <Divider className="_bgcl-l-b" isMarginVertical />
              </div>
            ))}
          </Col>
        </Row>
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
    <Layout>
      <MainContentStyled className="_mgbt-24px">
        <Col xs={14} offset={{ xs: 5 }} className="_pdl-0px">
          {Content()}
        </Col>
      </MainContentStyled>
      <Row>
        <Divider className="_bgcl-d-b" isLeft />
      </Row>
    </Layout>
  )
}

export default VideoList

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

const MainContentStyled = styled(Row)``
