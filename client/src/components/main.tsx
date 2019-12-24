import React from 'react'
import {
  Layout,
  Menu,
  Icon,
  Row,
  Col,
  Switch
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

import logo from '../static/open.svg'

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
  // 是否启动`ssr`
  readonly runtime?: boolean
}

const width = `100`

export default class extends React.Component<Props> {

  clickMenuHandle() {

  }

  // 启动时间
  

  render() {
    let { path, ctxStyle, wrapStyle } = this.props
    const now = fetchMenu((path as string))
    ctxStyle = Object.assign({ padding: '1rem' }, ctxStyle)
    wrapStyle = Object.assign({
      height: `${width}vh`,
      overflow: 'hidden'
    }, wrapStyle)
    return (
      <React.Fragment>
        <Layout style={wrapStyle}>
          <Header style={logoWrap}>
            <Row>
              <Col span={8}>
                <img src={ logo } />
                {logoText}
              </Col>
              <Col style={{
                textAlign: 'right'
              }} span={8} offset={8}>
                <span style={{
                  fontSize: `14px`,
                  position: `relative`,
                  top: `-3px`,
                  left: `-8px`,
                  color: `rgba(255, 255, 255, .6)`
                }}>{ !this.props.runtime ? '🚀开启SSR' : '✋关闭SSR' }</span>
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                  checked={ this.props.runtime }
                  loading={ false }
                  // onClick={ ()=> }
                />
              </Col>
            </Row>
          </Header>
          <Layout>
            <Sider theme="light">
              <div>
                <Menu defaultSelectedKeys={[now]} mode="inline" >
                  { menuLists.map((item, index) => {
                    return (
                      <Menu.Item onClick={e => this.clickMenuHandle} key={index}>
                        <Link to={item.path}>
                          <Icon type={item.icon} />
                          <span>{item.text}</span>
                        </Link>
                      </Menu.Item>
                    )
                  }) }
                </Menu>
              </div>
            </Sider>
            <Content style={ctxStyle}>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </React.Fragment>
    )
  }
}