import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import { Divider, Layout } from '../components/commons'

const AboutUsPage = () => {
  const Content = () => {
    return (
      <>
        <Row>
          <Col xs={24}>
            <h2 className="_mgbt-12px _fs-700 _cl-l-blue _mgt-28px">About Us</h2>
            <Divider className="_bgcl-d-b" isLeft isMarginVertical />

            <p className="_mgbt-12px _fs-300 _pdt-18px">
              The video content on{' '}
              <a href="https://www.proteachervideo.com​ " className="_cl-l-blue _tdcrt-n">
                www.proteachervideo.com
              </a>{' '}
              represents the entire Teachers TV archive. It is licensed from the
              Department for Education in London and is the subject of Crown Copyright.
              This non-exclusive license does not mean that we have any official status in
              relation to the UK Government nor does it mean have we been endorsed by the
              Government.
              <br />
              <br />
              Teachers TV was funded by the UK government from 2004 to 2011 and developed
              an innovative 21st-century system for raising standards of teaching and
              learning by sharing good practice through broadcast-quality video. Teachers
              TV produced over 3500 videos which have set the standard for professional
              development video around the world. It was a modern converged service, using
              television, broadband and emerging mobile platforms to reach and influence
              the schools workforce in England as well as teachers from around the world.
              Over six years, Teachers TV proved itself a cost-effective solution to
              improving educational outcomes on a national and international scale. The
              Teachers TV model has now been replicated in two other countries: in
              Thailand with{' '}
              <a href="https://www.thaiteachers.tv" className="_cl-l-blue _tdcrt-n">
                www.thaiteachers.tv
              </a>{' '}
              and, in the USA{' '}
              <a href="https://www.teachingchannel.org" className="_cl-l-blue _tdcrt-n">
                www.teachingchannel.org
              </a>{' '}
              largely funded by the Bill and Melinda Gates Foundation.
              <br />
              <br />
              ProTeachersVideo is designed to offer easy access to the entire original
              Teachers TV archive and is fully accessible from the around the world. The
              website is overseen by Andrew Bethell, who was Chief Executive and Creative
              Director of Teachers TV from 2006 to 2010 and has been actively involved in
              supporting the international development of the Teachers TV model around the
              world. He can be contacted on{' '}
              <a href="mailto:andrew@abaconsultancy.net" className="_cl-l-blue _tdcrt-n">
                andrew@abaconsultancy.net
              </a>
            </p>
          </Col>
        </Row>
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

export default AboutUsPage

const MainContentStyled = styled(Row)`
  p {
    line-height: 1.5;
  }
`
