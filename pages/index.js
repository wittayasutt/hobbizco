import React from 'react'

const Index = () => {
  return <>redirect to homepage.</>
}

export default Index

export async function getServerSideProps({ res }) {
  res.writeHead(301, {
    Location: '/home',
  })
  res.end()

  return {
    props: {},
  }
}
