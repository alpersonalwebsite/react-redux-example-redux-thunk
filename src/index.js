import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
import rootReducer from './reducers'
import App from './App'

// Redux DevTools in development only, and never in a production bundle. The old form
// ended in `: null || compose`, where the `null ||` was dead: the ternary already
// picks a branch, so it only ever evaluated to `compose`. Same behaviour, minus the
// expression that looks like it means something.
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(reduxThunk)))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
