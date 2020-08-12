/* eslint-disable camelcase */
import React from 'react'
import { Row, Col } from 'react-grid-system'
import Link from 'next/link'
import styled from 'styled-components'
import { Divider } from '../commons'

const RenderData = (title, type, datas) => {
  const getLink = (dataItem) => {
    return {
      href:
        dataItem?.sub_playlists?.length > 0
          ? '/next-level-list/[id]/[slug]'
          : '/programme-list-by-vocabulary-and-term-data/[id]/[slug]',
      as:
        dataItem?.sub_playlists?.length > 0
          ? `/next-level-list/${dataItem.id}/${dataItem.slug}`
          : `/programme-list-by-vocabulary-and-term-data/${dataItem.id}/${dataItem.slug}`,
    }
  }

  return (
    <>
      <Row className="_pst-rlt">
        <Col xs={24}>
          <h2 className="_mgbt-12px _fs-700 _cl-l-blue _mgt-28px _fl-l">{title}</h2>
          <h2 className="_mgbt-12px _fs-700 _cl-d-blue _mgt-28px _fl-l _pdl-12px">
            > {type}
          </h2>
        </Col>
        <Divider className="_bgcl-d-b" isBottom isLeft isMarginVertical />
      </Row>
      {datas?.map((data) => (
        <Row key={data.id} className="_pst-rlt">
          <ColPlaylistStyled xs={7} className="_fs-200 _fw-b _cs-pt _dp-f">
            <Link href={getLink(data).href} as={getLink(data).as}>
              <a
                href={getLink(data).as}
                className="_dp-f _jtfct-spbtw _tdcrt-n _cl-black _f-1 _pdv-8px"
              >
                <span className="_fl-l">{data?.name}</span>
                <span className="_fl-r">({data?.total_video_playlist})</span>
              </a>
            </Link>
          </ColPlaylistStyled>
          <Col xs={17} className="_fs-300 _pdv-8px _pdh-0px _pdr-28px">
            <Row>
              {data?.sub_playlists?.map((sub) => (
                <Col xs={8} className="_mgbt-8px _fs-100 _pdr-0px" key={sub.id}>
                  <Link
                    href="/programme-list-by-vocabulary-and-term-data/sub/[id]/[slug]"
                    as={`/programme-list-by-vocabulary-and-term-data/sub/${sub.id}/${sub.slug}`}
                  >
                    <A
                      href={`/programme-list-by-vocabulary-and-term-data/sub/${sub.id}/${sub.slug}`}
                      className="_cl-gray _tdcrt-n"
                    >
                      <div>
                        <div className="_fl-l _els-80p">{sub?.name}</div>
                        <span className="_fl-r">({sub?.total_video_subplaylist})</span>
                      </div>
                    </A>
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>
          <Divider className="_bgcl-l-b " isLeft isBottom isMarginVertical />
        </Row>
      ))}
    </>
  )
}

const ColPlaylistStyled = styled(Col)`
  a {
    &:hover {
      background-color: rgba(63, 191, 255, 0.2);
    }
  }
`

const A = styled.a`
  > div {
    width: 100%;
    height: 100%;
  }

  :hover {
    > div {
      border-bottom: 1px solid #aaaaaa;
    }
  }
`

export default RenderData
