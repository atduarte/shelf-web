import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Head from 'next/head'

import { AuthProvider } from '../components/AuthProvider'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ITEMS_FETCH_SUCCESS':
      return {
        ...state,
        itemsError: false,
        items: action.payload // TODO: convert to serializable
      };
    case 'ITEMS_FETCH_ERROR':
      return {
        ...state,
        itemsError: true
      };  
    case 'SUBJECTS_SELECTED':
      return {
        ...state,
        selectedSubjects: action.payload
      }
    default:
      return state;
  }
}

const store = createStore(reducer);

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  )
}

export default MyApp
