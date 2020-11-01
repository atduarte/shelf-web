import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'

import React from 'react'
import Head from 'next/head'
import { AuthProvider } from '../components/AuthProvider'


function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
