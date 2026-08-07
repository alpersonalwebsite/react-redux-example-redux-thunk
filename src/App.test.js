import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import rootReducer from './reducers'
import App from './App'

// App is connect()ed, so rendering it bare throws:
//
//   Could not find "store" in the context of "Connect(App)"
//
// which is why this test had never passed and why the CI config had its test step
// commented out. The store is built here the same way index.js builds it, minus the
// devtools enhancer.
it('renders without crashing', () => {
  const store = createStore(rootReducer, applyMiddleware(reduxThunk))
  const div = document.createElement('div')

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  )

  ReactDOM.unmountComponentAtNode(div)
})
