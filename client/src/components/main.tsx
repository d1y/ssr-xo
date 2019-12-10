import React from 'react'
import {
  Layout,
  Menu,
  Icon,
} from 'antd'

import { Link } from 'react-router-dom'

import {
  logoWrap,
  logoText
} from '../const/layout'
import {
  menuLists,
  fetchMenu
} from '../const/menu'

const {
  Sider,
  Header,
  Content,
} = Layout

interface Props extends React.Props<any> {
  readonly children?: React.ReactNode
  // 指向的路径
  readonly path?: string
  // 内容层样式
  readonly ctxStyle?: object
  // 整个包裹层样式
  readonly wrapStyle?: Object
}

export default class extends React.Component<Props> {

  clickMenuHandle() {

  }

  render() {
    let { path, ctxStyle, wrapStyle } = this.props
    const now = fetchMenu((path as string))
    ctxStyle = Object.assign({ padding: '1rem' },ctxStyle)
    wrapStyle = Object.assign({
      height: '88vh',
      overflow: 'hidden'
    }, wrapStyle)
    return (
      <React.Fragment>
        <Layout style={ wrapStyle }>
          <Header style={ logoWrap }>
            { logoText }
          </Header>
          <Layout>
            <Sider theme="light">
              <div>
                <Menu
                  defaultSelectedKeys={[ now ]}
                  mode="inline"
                >
                  { menuLists.map((item, index)=> {
                    return (
                      <Menu.Item onClick={ e=> this.clickMenuHandle  } key={ index }>
                        <Link to={ item.path }>
                        <Icon type={ item.icon } />
                        <span>{ item.text }</span>
                        </Link>
                      </Menu.Item>
                    )
                  }) }
                </Menu>
              </div>
            </Sider>
            <Content style={ ctxStyle }>
              { this.props.children }
            </Content>
          </Layout>
        </Layout>
      </React.Fragment>
    )
  }
}