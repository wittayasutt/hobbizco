import React from 'react'
import { Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Head from 'next/head'

import { Divider, Layout } from '../components/commons'
import { SuggestedVideo } from '../components/suggestedVideo'
import { RenderData } from '../components/subject'
import { getPlayList } from '../services/playlist'

const WholeSchoolIssue = ({ dataList }) => {
  return (
    <>
      <Head>
        <title>Whole School | ProTeachersVideo</title>
        <meta
          name="description"
          content="Teachers TV education videos for professional development or to use in class - grouped by Whole School Issues"
        />
      </Head>
      <Layout>
        <MainContentStyled className="_mgbt-24px">
          <Col xs={18} className="_pdl-0px">
            {RenderData('Whole School Issues', 'Primary', dataList?.primary?.playlists)}
            {RenderData(
              'Whole School Issues',
              'Secondary',
              dataList?.secondary?.playlists,
            )}
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

export default WholeSchoolIssue

WholeSchoolIssue.getInitialProps = async () => {
  let dataList = {}
  try {
    const result = await Promise.all([
      getPlayList({ sub_category_id: 7 }), // whole school => primary
      getPlayList({ sub_category_id: 8 }), // whole school => secondary
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
