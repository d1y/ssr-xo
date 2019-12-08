import React from 'react'
import {
  Layout,
  Menu,
  Icon,
  Button
} from 'antd'

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
  readonly path?: string
}

export default class extends React.Component<Props> {

  render() {
    const { path } = this.props
    const now = fetchMenu((path as string))
    
    return (
      <React.Fragment>
        <Layout style={{ height: '88vh', overflow: 'hidden' }}>
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
                      <Menu.Item key={ index }>
                        <Icon type={ item.icon } />
                        <span>{ item.text }</span>
                      </Menu.Item>
                    )
                  }) }
                </Menu>
              </div>
            </Sider>
            <Content style={{ padding: '1rem' }}>
              <Button>{ this.props.children }</Button>
            </Content>
          </Layout>
        </Layout>
      </React.Fragment>
    )
  }
}