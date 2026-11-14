import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
// @ts-ignore -- SCSS is loaded by the bundler and has no TypeScript module declaration.
import './index.scss'
import { store } from './store/store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)

export {}
