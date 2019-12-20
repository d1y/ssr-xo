import React, { PureComponent } from 'react'
import {
  Tabs,
  Button,
  Typography,
  Icon
} from 'antd'
import Main from "../components/main"
import '../css/utils.css'
const { TabPane } = Tabs
const { Title } = Typography

export default class extends PureComponent {
  render() {
    return (
      <Main path="proxy">
        <Title level={3} type="danger"># 订阅节点</Title>
        <div className="box-wrapper">
          <Button type="primary"> <Icon type="plus" /> 添加订阅</Button>
          <Button type="danger"> <Icon type="experiment" /> 更新所有订阅</Button>
        </div>
        <Tabs defaultActiveKey="1" tabPosition="top">
          <TabPane tab="垃圾机场" key="1" style={{ height: 200 }}>
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="公益机场" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="白嫖王" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </Main>
    )
  }
}