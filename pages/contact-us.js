import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import { Divider, Layout } from '../components/commons'

const ContactUsPage = () => {
  const Content = () => {
    return (
      <>
        <Row>
          <Col xs={24}>
            <h2 className="_mgbt-12px _fs-700 _cl-l-blue _mgt-28px">Contact Us</h2>
            <Divider className="_bgcl-d-b" isLeft isMarginVertical />
            <p className="_mgbt-12px _fs-100 _pdt-18px">
              If you would like to contact ProTeachersVideo please send an email to{' '}
              <a href="mailto:info@proteachersvideo.com" className="_cl-l-blue _tdcrt-n">
                info@proteachersvideo.com
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

export default ContactUsPage

const MainContentStyled = styled(Row)``
