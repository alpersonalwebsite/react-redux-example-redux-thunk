import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import rootReducer from './reducers'
import App from './App'
import axios from 'axios'

// axios is mocked because mounting App dispatches fetchUsers, which would otherwise fire
// a real request at REACT_APP_API_URL. A test called "renders without crashing" should
// not depend on a local API being up, or on there being a network at all.
//
// jest.mock is hoisted above the imports by babel-plugin-jest-hoist wherever it is
// written, so keeping it below them costs nothing and keeps import/first happy.
jest.mock('axios')

// App is connect()ed, so rendering it bare throws:
//
//   Could not find "store" in the context of "Connect(App)"
//
// which is why this test had never passed and why the CI config had its test step
// commented out. The store is built here the same way index.js builds it, minus the
// devtools enhancer.
beforeEach(() => {
  axios.get.mockResolvedValue({ data: { data: [] } })
})

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
