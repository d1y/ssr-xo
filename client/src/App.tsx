// 参考文章: https://www.jianshu.com/p/1f94291a5370

import React from 'react'

import {
  HashRouter as Router,
  Route
} from 'react-router-dom'

import Index from './page/index'
import Thank from './page/thank'
import Fetch from './page/fetch'

export default class extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/index" component={ Index } />
        <Route path="/thank" component={ Thank } />
        <Route path="/fetch" component={ Fetch } />
      </Router>
    )
  }
}