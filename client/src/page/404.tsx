import React from 'react'

import { Divider, List, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { menuLists } from '../const/menu'

const color = `rgb(228, 141, 225)`

const miniStyle = {
  border: `2px solid #e8e8e8`,
  borderRadius: `6px`,
  margin: `3vh auto`,
  padding: `1rem`,
  width: `420px`,
  height: `94vh`
}

export default class extends React.Component {

  componentWillUnmount() {
    //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('resize', this.handleResize.bind(this))
  }


  componentDidMount() {
    try {
      const props = this.props
      const path = (props as any).location.pathname
      //监听窗口大小改变
      window.addEventListener('resize', this.handleResize.bind(this))
      this.setState({ path })
    } catch (error) {
      console.error('获取路由失败')
    }
  }

  handleResize = ()=> {
    const width =  (window as any).innerWidth
    const isMini = width > 420
    this.setState({ isMini })
  }

  state = {
    path: '',
    isMini: true
  }

  render() {
    return (
      <div style={ this.state.isMini ?  miniStyle : { padding: `2rem` }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: `4rem`,
            display: `inline-block`,
            border: `5px solid ${color}`,
            borderRadius: `10px`,
            padding: `0 20px`
          }}>
            <span style={{
              background: color,
              color: `#fff`,
              padding: `2px 8px`,
              borderRadius: `8px`,
              marginRight: `8px`
            }}>SSR</span>
            <span>XO</span>
          </div>
        </div>
        <Divider>
          未知路由:
          <span style={{
            color,
            marginLeft: `.5rem`
          }}>
            #{this.state.path}
          </span>
        </Divider>
        <div>
          <List>
            { menuLists.map((item, index)=> {
              return (
                <List.Item key={ index }>
                  <Link style={{ color: 'rgb(51, 50, 50)' }} to={item.path}>
                    <Icon type={ item['icon'] } />  { item['text'] }
                  </Link>
                </List.Item>
              )
            }) }
          </List>
        </div>
      </div>
    )
  }

}