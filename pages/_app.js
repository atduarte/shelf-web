import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ITEMS_FETCH_SUCCESS':
      return {
        ...state,
        error: false,
        itemsSnapshot: action.payload
      };
    case 'ITEMS_FETCH_ERROR':
      return {
        ...state,
        error: true
      };  
    case 'SUBJECTS_FETCH_SUCCESS':
      return {
        ...state,
        subjects: action.payload
      }
    default:
      return state;
  }
}

export const store = createStore(reducer);

function MyApp({ Component, pageProps }) {
  return <Provider store={store}>
    <Component {...pageProps} />
  </Provider>;  
}

export default MyApp
