import React, { PureComponent } from 'react'
import Main from '../components/main'
import ReactMarkdown from 'react-markdown'
import { logoText, logoWrap } from '../const/layout';

const ctx = require('../markdown/thank.md')

class Thank extends PureComponent {

  state = {
    ctx: ""
  }
  
  componentDidMount() {
    fetch(ctx).then(r=> r.text())
    .then(r=> {
      this.setState({
        ctx: r
      })
    })
  }

  render() {
    return (
      <Main ctxStyle={{
        padding: "2rem"
      }} path="/thanks">
        <h1 style={ logoWrap }>{ logoText }</h1>
        <ReactMarkdown source={ this.state.ctx } />
      </Main>
    )
  }
}


export default Thank