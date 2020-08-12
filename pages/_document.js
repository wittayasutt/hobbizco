import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import OverideHead from 'next/head'

import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/static/favicon.ico" />
        </Head>

        <body>
          <Main />
          <OverideHead>
            <meta key="viewport" name="viewport" content="width=1024" />
          </OverideHead>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
