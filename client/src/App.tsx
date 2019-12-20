// 参考文章: https://www.jianshu.com/p/1f94291a5370

import React from 'react'

import {
  HashRouter as Router,
  Route
} from 'react-router-dom'

import Index from './page/index'
import Thank from './page/thanks'
import Proxy from './page/proxy'

export default class extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/index" component={ Index } />
        <Route path="/thanks" component={ Thank } />
        <Route path="/proxy" component={ Proxy } />
      </Router>
    )
  }
}