/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import Link from 'next/link'
import Head from 'next/head'
import { Divider, Layout } from '../../../components/commons'
import { getVideoBySlug } from '../../../services/video'
import { SUB_CATEGORY, MONTH } from '../../../constants'

const DetailPage = (data) => {
  const [isSafari, setIsSafari] = useState(false)
  const [categoryData, setCategoryData] = useState({})

  // function
  const setCategory = () => {
    const category = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    }

    const playlist = {}

    data?.video_subplaylists?.forEach((item) => {
      const playlistID = item.sub_playlist.playlist_id
      if (playlist[playlistID]) {
        playlist[playlistID].push({
          id: item.sub_playlist.id,
          name: item.sub_playlist.name,
          slug: item.sub_playlist.slug,
        })
      } else {
        playlist[playlistID] = [
          {
            id: item.sub_playlist.id,
            name: item.sub_playlist.name,
            slug: item.sub_playlist.slug,
          },
        ]
      }
    })

    const getCate = (subCateID) => {
      const subCateSelect = SUB_CATEGORY.find((item) => item.id === subCateID)
      return subCateSelect.categoryID
    }

    data?.video_playlists?.forEach((item) => {
      const cateID = item?.playlist?.sub_category?.category_id
      const subCateName = cateID !== 2 ? `${item?.playlist?.sub_category?.name} ` : ''

      if (item?.playlist?.sub_category_id) {
        category[getCate(item.playlist.sub_category_id)].push({
          id: item?.playlist?.id,
          name: `${subCateName}${item?.playlist?.name}`,
          slug: item?.playlist?.slug,
          subPlaylist: playlist[item?.playlist?.id],
        })
      }
    })

    setCategoryData(category)
  }

  const preventRightClick = () => {
    const isPreventRightClick = !!JSON.parse(
      String(
        process.env.NEXT_PUBLIC_FEATURE_PREVENT_RIGHT_CLICK_VIDEO || 'false',
      ).toLowerCase(),
    )

    if (isPreventRightClick) {
      const preventClick = (event) => {
        return event.preventDefault()
      }

      document.addEventListener('contextmenu', preventClick)

      return () => {
        document.removeEventListener('contextmenu', preventClick)
      }
    }

    return () => {}
  }

  const renderDate = (dateInput) => {
    const date = new Date(dateInput.replace(/-/g, '/'))
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const year = date.getFullYear().toString()
    return `${MONTH[month]} ${year}`
  }
  const checkBrowserIsSafari = () => {
    const browserIsSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    setIsSafari(browserIsSafari)
  }
  // hook
  useEffect(() => {
    setCategory()
    checkBrowserIsSafari()
    return preventRightClick()
  }, [])

  const renderMainContent = () => {
    const poster = encodeURI(
      `${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/${data?.image_cover_url}`,
    )

    return (
      <MainContentStyled className="_mgbt-24px">
        <Col xs={19} offset={{ xs: 5 }} className="_pdl-0px">
          <Row>
            <Col xs={24}>
              <h2 className="_mgbt-12px _fs-700 _cl-l-blue _mgt-28px">{data?.title}</h2>
            </Col>
          </Row>
          <Row className="_fs-300">
            <VideoColumnStyled xs={19}>
              <ReactPlayer
                className="video"
                url={`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/${data?.video_url}`}
                controls
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                      ...(isSafari && { poster }),
                    },
                  },
                }}
                light={!isSafari && poster}
                playing={!isSafari}
                width="100%"
                height="100%"
                playIcon={<img src="/static/commons/play-icon.png" alt="play-icon" />}
              />
            </VideoColumnStyled>
            <Col xs={5} className="_fs-300 detail-container _pdh-0px">
              <Row className="_mgbt-24px">
                <Col>
                  <span>
                    Published: {data?.created_at && renderDate(data?.created_at)}
                  </span>
                  <br />
                  <div className="time-period _bgcl-pmr-b _fs-100 _fw-b">
                    {data?.duration_minute} mins
                  </div>
                </Col>
              </Row>

              {Object.keys(categoryData).map((cateID) => (
                <div key={cateID}>
                  {categoryData[cateID].length > 0 && (
                    <Row className="_mgbt-16px">
                      <Col xs={24} className="_pdbt-4px">
                        <span className="_cl-l-blue _mgbt-4px _fw-b">
                          {
                            SUB_CATEGORY.find(
                              (item) => item.categoryID === Number(cateID),
                            )?.categoryNameForDisplay
                          }
                        </span>
                        <Divider className="_bgcl-l-b" isBottom isLeft isMarginVertical />
                      </Col>
                      <Col xs={24} className="_mgt-0px">
                        {categoryData[cateID]?.map((playlist) => (
                          <div key={playlist.id}>
                            <p className="_mg-0px _fw-b _fs-100 subcate-menu">
                              <Link
                                href="/programme-list-by-vocabulary-and-term-data/[id]/[slug]"
                                as={`/programme-list-by-vocabulary-and-term-data/${playlist.id}/${playlist.slug}`}
                              >
                                <a
                                  href={`/programme-list-by-vocabulary-and-term-data/${playlist.id}/${playlist.slug}`}
                                  className="_tdcrt-n _hv-tdcrt-udl _cl-gray"
                                >
                                  {playlist.name}
                                </a>
                              </Link>
                            </p>
                            {playlist?.subPlaylist?.map((subPlaylist) => (
                              <SubPlaylist
                                className="_mg-0px _fs-100"
                                key={subPlaylist.id}
                              >
                                <Link
                                  href="/programme-list-by-vocabulary-and-term-data/sub/[id]/[slug]"
                                  as={`/programme-list-by-vocabulary-and-term-data/sub/${subPlaylist.id}/${subPlaylist.slug}`}
                                >
                                  <a
                                    href={`/programme-list-by-vocabulary-and-term-data/sub/${subPlaylist.id}/${subPlaylist.slug}`}
                                    className="_tdcrt-n _hv-tdcrt-udl _cl-gray"
                                  >
                                    {subPlaylist.name}
                                  </a>
                                </Link>
                              </SubPlaylist>
                            ))}
                          </div>
                        ))}
                      </Col>
                    </Row>
                  )}
                </div>
              ))}
            </Col>
          </Row>
        </Col>
      </MainContentStyled>
    )
  }

  const renderSummary = () => {
    return (
      <SummaryStyled>
        <Col xs={5} className="_pdv-24px _dp-f _jtfct-fe _cl-pmr-blue">
          <Divider isTop />
          Summary
          <Divider isBottom />
        </Col>
        <Col xs={19} className="_pdv-24px _pdl-0px">
          <Divider isTop />
          {data?.summary?.includes('<p>') ? (
            <RenderHTML
              className="_fs-300 _mg-0px _mgbt-16px"
              dangerouslySetInnerHTML={{
                __html: data?.summary?.replace(/<br \/>/g, ''),
              }}
            />
          ) : (
            <div
              className="_fs-300 _mg-0px _mgbt-16px"
              dangerouslySetInnerHTML={{
                __html: data?.summary,
              }}
            />
          )}
          <Divider isBottom />
        </Col>
      </SummaryStyled>
    )
  }

  const renderMaterial = () => {
    if (data?.video_materials?.length === 0) return <div />

    const typeFile = {
      doc: '/static/word.png',
      xls: '/static/excel.png',
      ppt: '/static/powerpoint.png',
      pdf: '/static/pdf.png',
    }
    const getImage = (urlMaterial) => {
      const split = urlMaterial?.split(/[\s.]+/)
      const type = split[split.length - 1]

      return typeFile[type]
    }
    return (
      <SummaryStyled>
        <Col xs={5} className="_pdv-12px _dp-f _jtfct-fe _cl-pmr-blue _tal-r">
          Extra
          <br />
          Material
          <Divider isBottom />
        </Col>
        <Col xs={19} className="_pdv-4px _pdl-0px">
          {data?.video_materials?.map((material, index) => (
            <div key={material.id}>
              <Row className="_pdt-12px">
                <Col xs={2} className="_tal-ct ">
                  <img src={getImage(material?.material?.material_url)} alt="icon file" />
                </Col>
                <Col xs={22} className="_pdt-4px _pdl-28px">
                  <a
                    href={`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/${material?.material?.material_url}`}
                    download
                    className="_fs-300 _tdcrt-n _fw-b _cl-pmr-blue _mgv-4px _hv-tdcrt-udl "
                  >
                    {material.material.name}
                  </a>
                  <p className="_fs-200 _cl-gray _mgv-0px">
                    {material.material.description}
                  </p>
                </Col>
              </Row>
              {data?.video_materials.length - 1 > index && (
                <Divider className="_bgcl-l-b" />
              )}
            </div>
          ))}
          <Divider isBottom />
        </Col>
      </SummaryStyled>
    )
  }

  return (
    <>
      <Head>
        <title>{data?.title} | ProTeachersVideo</title>
        <meta
          name="description"
          content={`Teachers TV education videos - ${data?.sub_title}`}
        />
      </Head>
      <Layout>
        {renderMainContent()}
        {renderSummary()}
        {renderMaterial()}
      </Layout>
    </>
  )
}

export default DetailPage

DetailPage.getInitialProps = async (req) => {
  const { slug } = req.query
  const resultVideo = await getVideoBySlug(slug)
  const { data } = resultVideo
  return data
}

const MainContentStyled = styled(Row)`
  .detail-container {
    .time-period {
      color: white;
      width: fit-content;
      padding: 5px 4px;
      margin-bottom: 5px;
    }
  }
  .subcate-menu {
    line-height: 1.5;
  }
`

const VideoColumnStyled = styled(Col)`
  min-height: 330px !important;

  .video {
    video {
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }
  }
`

const SubPlaylist = styled.p`
  background: url(/static/bullet.gif) no-repeat 4px 7px;
  padding-left: 10px;
  line-height: 20px;
`

const RenderHTML = styled.div`
  p {
    margin: 0 0 14px !important;
  }
`

const SummaryStyled = styled(Row)``
