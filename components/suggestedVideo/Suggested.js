import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Link from 'next/link'
import { getVideoSuggestion } from '../../services/video'

const SuggestedVideos = () => {
  const [suggestedData, setSuggestedData] = useState([])

  const fetchData = async () => {
    const resultVideo = await getVideoSuggestion({ limit: 4 })
    const data = resultVideo?.data?.rows
    setSuggestedData(data)
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Row className="_pdt-8px _pdh-16px">
        <h3 className="_mgbt-12px _fs-500 _cl-l-blue _mgt-24px">Suggested videos</h3>
      </Row>

      {suggestedData.map((data) => (
        <Link
          href="/programme/[id]/[slug]"
          as={`/programme/${data.id}/${data.slug}`}
          key={data.id}
        >
          <A href={`/programme/${data.id}/${data.slug}`} className="_tdcrt-n">
            <div className="video-wrapper">
              <h4 className="_mgv-4px _fs-400 _cl-d-blue">{data.title}</h4>
              <Row>
                <Col xs={14} className="_pdr-4px">
                  <img
                    className="cover"
                    src={`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/${data.image_cover_url}`}
                    alt="cover"
                  />
                </Col>
                <Col xs={10} className="_pdl-0px">
                  <SubTitle className="_mgv-0px _fs-100 _cl-gray">
                    {data.sub_title}
                  </SubTitle>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="time-period _bgcl-pmr-b _fs-100 _fw-b">
                    {data.duration_minute} mins
                  </div>
                </Col>
                <Col xs={12} className="_pdl-0px">
                  <div className="_mgt-4px _fs-300 _cl-d-blue _fw-b _tal-r ">
                    <span className="watch-text">Watch Video</span>
                  </div>
                </Col>
              </Row>
            </div>
          </A>
        </Link>
      ))}
    </>
  )
}
export default SuggestedVideos

const SubTitle = styled.p`
  line-height: 1.3;
`

const A = styled.a`
  .video-wrapper {
    border: 1px solid #979797;
    padding: 5px;
    margin-bottom: 15px;

    img.cover {
      width: 100%;
    }
    .time-period {
      color: white;
      width: fit-content;
      padding: 5px 4px;
    }
    .watch-text {
      width: 100px;
      height: 14px;
      padding-right: 20px;
      background: url('/static/play.png') no-repeat right 0px;
    }
  }
  &:hover {
    .video-wrapper {
      background-color: var(--color-light-blue);

      h4 {
        color: #fff !important;
      }
      .time-period {
        color: var(--color-primary-blue) !important;
        background-color: #fff !important;
      }
      .watch-text {
        color: #fff !important;
        text-decoration: underline;
        background: #3fbeff url('/static/play.png') no-repeat right -16px;
      }
    }
  }
`
