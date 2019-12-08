import React from 'react'
import Main from '../components/main'
const ctx = require('../markdown/thank.md')

class Thank extends React.Component {

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
      <Main>
        { this.state.ctx }
      </Main>
    )
  }
}


export default Thank