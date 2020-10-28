import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'

import { createStore } from 'redux'
import React from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import {auth} from '../lib/firebase' 

import {subjectsCollection} from '../lib/data/subjects'
import { FirebaseAuthConsumer, FirebaseAuthProvider } from '@react-firebase/auth'
import { useEffect } from 'react'
import Login from '../components/login'
import { connect } from 'react-redux';
import dynamic from 'next/dynamic'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return {
        ...state,
        loggedIn: true
      }
    case 'LOGGED_OUT':
      return {
        ...state,
        loggedIn: false
      }
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
    case 'SUBJECTS_FETCH_SUCCESS':
      return {
        ...state,
        subjectsError: false,
        subjects: action.payload // TODO: convert to serializable
      }  
    case 'SUBJECTS_FETCH_ERROR':
      return {
        ...state,
        subjectsError: true
      }
    default:
      return state;
  }
}

const LoggedIn = connect(({loggedIn}) => ({loggedIn}))(({children, loggedIn}) => {
  if (loggedIn) {
    useEffect(() => subjectsCollection
      .onSnapshot(
        snapshot => store.dispatch({ type: 'SUBJECTS_FETCH_SUCCESS', payload: snapshot }),
        e => store.dispatch({ type: 'SUBJECTS_FETCH_ERROR', error: e })
      ), 
      []
    );

    return children;
  }

  return null;
});

const LoggedOut = connect(({loggedIn}) => ({loggedIn}))(({children, loggedIn}) => {
  if (!loggedIn) {
    return children;
  }

  return null;
});

export const NoSsr = dynamic(
  () => Promise.resolve(props => (<React.Fragment>{props.children}</React.Fragment>)), 
  {ssr: false}
);

export const loadLocalState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}; 

export const saveLocalState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};


const store = createStore(reducer, loadLocalState());

store.subscribe(() => {
  debugger;
  saveLocalState(store.getState())
});

auth.onAuthStateChanged(user => store.dispatch({ type: user ? "LOGGED_IN" : "LOGGED_OUT" }))

function ClientSideApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <LoggedOut>
        <Login {...pageProps} />
      </LoggedOut>

      <LoggedIn>
        <Component {...pageProps} />
      </LoggedIn>
    </Provider>
  )  
}

function MyApp({ Component, pageProps }) {
  return (
    <NoSsr>
      <ClientSideApp Component={Component} pageProps={pageProps} />
    </NoSsr>
  )
}

export default MyApp
