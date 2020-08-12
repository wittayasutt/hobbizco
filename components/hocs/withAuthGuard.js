/* eslint-disable consistent-return */
import React, { useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import cookie from 'js-cookie'

export default (WrappedComponent) => {
  const WithAuthGuard = ({ user, ...props }) => {
    const router = useRouter()

    const handleRedirect = () => {
      if (!cookie.get('accessToken') || user === 'invalid_token') {
        Router.push({
          pathname: '/backoffice/login',
          query: { callback: router.asPath },
        })
      }
    }

    useEffect(() => {
      handleRedirect()
    }, [user])

    return <WrappedComponent {...props} />
  }

  // if (WrappedComponent.getInitialProps) {
  //   WithAuthGuard.getInitialProps = async (ctx) => {
  //     console.log(ctx)
  //     if (WrappedComponent?.getInitialProps) {
  //       const pageProps = {}
  //       const accessToken = process.browser
  //         ? cookie.get('accessToken')
  //         : serverCookies(ctx).accessToken

  //       try {
  //         const { data } = await auth.getMe(accessToken)
  //         pageProps.user = data
  //       } catch (err) {
  //         console.log('invalide access token')
  //       }

  //       return WrappedComponent?.getInitialProps?.(ctx, pageProps)
  //     }
  //   }
  // }

  return WithAuthGuard
}
