import './style.scss'

import React from 'react'
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'
import { setConfiguration } from 'react-grid-system'

import { UserProvider } from '../components/hooks'

setConfiguration({ containerWidths: [960, 960, 960, 960, 960], gridColumns: 24 })

NProgress.configure({ showSpinner: true })
Router.events.on('routeChangeStart', () => {
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Professional Development for Quality Teaching | ProTeachersVideo</title>
        <meta
          name="description"
          content="Complete archive of 3500 Teachers TV education videos for professional development or to use in class"
        />
      </Head>

      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  )
}

export default MyApp
