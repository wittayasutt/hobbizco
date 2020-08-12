import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Head from 'next/head'

import { Divider, Layout } from '../components/commons'
import { SuggestedVideo } from '../components/suggestedVideo'
import { RenderData } from '../components/subject'
import { getPlayList } from '../services/playlist'

const SubjectsPage = ({ dataList }) => {
  return (
    <>
      <Head>
        <title>Subjects | ProTeachersVideo</title>
        <meta
          name="description"
          content="Teachers TV education videos for professional development or to use in class - grouped by Subject"
        />
      </Head>
      <Layout>
        <MainContentStyled className="_mgbt-24px">
          <Col xs={18} className="_pdl-0px">
            {RenderData('Subjects', 'Primary', dataList?.primary?.playlists)}
            {RenderData('Subjects', 'Secondary', dataList?.secondary?.playlists)}
          </Col>
          <Col xs={6}>
            <Row>
              <Col xs={24} className="_pdr-0px">
                <SuggestedVideo />
              </Col>
            </Row>
          </Col>
        </MainContentStyled>
        <Row>
          <Divider className="_bgcl-d-b" isLeft />
        </Row>
      </Layout>
    </>
  )
}

export default SubjectsPage

SubjectsPage.getInitialProps = async () => {
  let dataList = {}
  try {
    const result = await Promise.all([
      getPlayList({ sub_category_id: 3 }), // subjects => primary
      getPlayList({ sub_category_id: 4 }), // subjects => secondary
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

const MainContentStyled = styled(Row)``
