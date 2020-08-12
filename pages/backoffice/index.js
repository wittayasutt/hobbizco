import React from 'react'

const Index = () => {
  return <>redirect to backoffice.</>
}

export default Index

export async function getServerSideProps({ res }) {
  res.writeHead(302, {
    Location: '/backoffice/all-videos',
  })
  res.end()

  return {
    props: {},
  }
}
