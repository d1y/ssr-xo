import React, { PureComponent } from 'react'
import {
  Tabs,
  Button,
  Typography,
  Icon,
  Modal,
  Input,
  Alert,
  Result,
  message,
  Row,
  Col,
  Empty,
} from 'antd'
import Main from "../components/main"
import NodeSlide from '../components/nodeSlide'
import Box from '../components/box'
import '../css/utils.scss'
import { subMsgs } from '../const/msgs'
import { isUrl } from '../utils'
import {
  addSubLinkNode,
  getSubLinkNode,
  removeAllSubLinkNode,
  testOnceSubLinkNode,
  updateSubNodes
} from '../api/sub'
import { subLinkNode, subLinkNoteItem } from '../interface'
import { removeAllSubNodeLinkModalCancelTime } from '../const'

const { confirm } = Modal
const { TabPane } = Tabs
const { Title } = Typography

export default class extends PureComponent {

  state = {
    addNodeModalShow: false, // 添加订阅模态框状态
    addNodeModalLoading: false, // 添加订阅模态框加载
    addNodeModalOkButtonStatus: false, // 添加订阅模态框ok是否可点击
    addNodeModalSubLink: 'https://cylink.sub.tips/link/aywrT2Kxg7UtiOJ7?sub=1&extend=1', // 添加的订阅地址
    addNodeModalSubNote: '小鸡🐥', // 订阅备注
    addNodeModalSubStatus: false, // 状态
    addNodeModalSubTestStatus: false, // 测试状态
    addNodeModalSubTestTypeStatus: false, // 测试状态连接类型状态
    addModalTestFetchDataStatus: false, // 测试订阅节点(加载中)
    subNodeList: [], // 订阅节点列表
    subNodeWithTabKey: '', // 订阅节点`tab`的`key`
  }

  componentDidMount = async () => {
    await this.fetchSubNodeList()
  }

  // 获取订阅节点
  // TODO
  fetchSubNodeList = async () => {
    const data = await getSubLinkNode()
    try {
      const { code, data: subNodeList, msg } = data
      if (code === 200) {
        // TOD
        this.setState({
          subNodeWithTabKey: subNodeList[0]['id']
        })
        message['success'](msg ? msg : subMsgs['getNodeListSuccess'])
      } else message['error'](msg ? msg : subMsgs['getNodeListFail'])
      this.setState({ subNodeList })
    } catch (error) {
      message['error'](subMsgs['getNodeListFail'])
    }
  }

  // 删除所有的订阅节点
  removeSubAllNodeList = async () => {
    confirm({
      title: subMsgs['removeAllSubNodeLinkModalTitle'],
      content: subMsgs['removeAllSubNodeLinkModalContent'],
      onOk: async () => {
        const data = await removeAllSubLinkNode()
        try {
          const { code, msg } = data
          if (code == 200) {
            message['success'](msg ? msg : subMsgs['removeAllSubNodeLinkSucess'])
            // TODO
            this.setState({
              subNodeList: []
            })
          } else message['error'](msg ? msg : subMsgs['removeAllSubNodeLinkFail'])
        } catch (error) {
          message['error'](subMsgs['removeAllSubNodeLinkFail'])
        }
      },
      onCancel() {
        const modal = Modal.warning({
          title: subMsgs['removeAllSubNodeLinkModalCancelTitle'],
          content: subMsgs['removeAllSubNodeLinkModalCancelContent']
        })
        setTimeout(() => {
          modal.destroy()
        }, removeAllSubNodeLinkModalCancelTime)
      }
    })
  }

  // 测试新增数据是否正确
  // isData, 如果传递参数, 将返回 [ link, note ]
  testNodeModalData = (
    isData: boolean = false
  ): boolean | Array<boolean | string[]> => {
    const {
      addNodeModalSubLink,
      addNodeModalSubNote
    } = this.state
    const iswrapperURL = isUrl(addNodeModalSubLink)
    let isCorrect = iswrapperURL && addNodeModalSubNote
    let status: boolean = isCorrect ? true : false
    if (isData) return [status, [addNodeModalSubLink, addNodeModalSubNote]]
    return status
  }

  // 确定添加
  addNodeModalBindOk = async () => {
    const isCorrect = this.testNodeModalData(true)
    const cp: any[] = isCorrect as any[]
    const [url, note] = cp[1]
    if (cp[0]) {
      const options: subLinkNode = { url, note }
      const data = await addSubLinkNode(options)
      // console.log('data: ', data)
      this.setState({
        addNodeModalShow: false,
        addNodeModalSubStatus: !isCorrect
      })
    } else {
      this.setState({
        addNodeModalSubStatus: true
      })
    }
  }

  // 取消按钮
  addNodeModalBindCancel = () => {
    this.setState({
      addNodeModalShow: false,
      addNodeModalSubLink: '',
      addNodeModalSubNote: '',
      addNodeModalSubStatus: false
    })
  }

  // 测试连接按钮点击
  addModalTestConnButtonClick = async () => {
    const isCorrect = this.testNodeModalData(true)
    const cp: any[] = isCorrect as any[]
    const [url] = cp[1]
    let addNodeModalSubTestStatus = false
    let addNodeModalSubTestTypeStatus = subMsgs.addNodeModalSubTestStatusFail
    if (cp[0]) {
      try {
        const data = await testOnceSubLinkNode(url)
        const { code, msg } = data
        addNodeModalSubTestStatus = code == 200
        addNodeModalSubTestTypeStatus = msg
      } catch (error) { }
      this.setState({
        addNodeModalSubTestStatus,
        addNodeModalSubTestTypeStatus
      })
    } else {
      this.setState({
        addNodeModalSubStatus: true
      })
    }
  }

  updateNodesByNow = () => {
    const id = this.state.subNodeWithTabKey
    updateSubNodes(id)
  }

  speedNodesByNow = () => {

  }

  render() {
    return (
      <Main path="proxy">

        <Title level={3} type="danger"># 订阅节点</Title>

        <Modal
          title={subMsgs.addModalText}
          cancelText={subMsgs.addModalCancelText}
          okText={subMsgs.addModalOkText}
          visible={this.state.addNodeModalShow}
          confirmLoading={this.state.addNodeModalLoading}
          onCancel={this.addNodeModalBindCancel}
          onOk={this.addNodeModalBindOk}
          okButtonProps={{ disabled: this.state.addNodeModalOkButtonStatus }}
        >

          <Input
            className="margin-top-sm margin-bottom-lg"
            prefix={<Icon type="api" />}
            placeholder={subMsgs.addModalNodeURL}
            value={this.state.addNodeModalSubLink}
            onChange={e => this.setState({ addNodeModalSubLink: e.currentTarget.value })}
          />

          <Input
            className="margin-top-sm margin-bottom-lg"
            prefix={<Icon type="number" />}
            placeholder={subMsgs.addModalNodeNote}
            value={this.state.addNodeModalSubNote}
            onChange={e => this.setState({ addNodeModalSubNote: e.currentTarget.value })}
          />

          {this.state.addNodeModalSubStatus ? (
            <Alert
              className="margin-top-sm margin-bottom-sm"
              message={subMsgs.addModalNodeFillError}
              type="error"
            />
          ) : null}

          {/* 测试订阅地址 */}
          <Button
            className="margin-top-sm"
            type="primary"
            icon="cloud"
            loading={this.state.addModalTestFetchDataStatus}
            onClick={this.addModalTestConnButtonClick}
          >
            {subMsgs.addModalTestConnButton}
          </Button>

          {/* 从剪贴板中拿到 */}
          <Button className="margin-left-lg" type="danger">从剪贴板中拿到</Button>

          {this.state.addNodeModalSubTestStatus ? (
            <Result
              status={this.state.addNodeModalSubTestTypeStatus ? 'success' : 'error'}
              title={this.state.addNodeModalSubTestTypeStatus}
            ></Result>
          ) : null}

        </Modal>

        <div className="box-wrapper">
          <Button type="primary" onClick={() => this.setState({ addNodeModalShow: true })} >
            <Icon type="plus" /> 添加订阅
          </Button>
          <Button type="danger">
            <Icon type="experiment" /> 更新所有订阅
          </Button>
          <Button type="ghost" onClick={this.removeSubAllNodeList}>
            <Icon type="experiment" /> 删除所有订阅
          </Button>
        </div>

        <Tabs
          defaultActiveKey={this.state.subNodeWithTabKey}
          tabPosition="top"
          tabBarExtraContent={(
            <React.Fragment>
              {this.state.subNodeList.length ? (
                <NodeSlide
                  onUpdate={this.updateNodesByNow}
                  onSpeed={this.speedNodesByNow}
                />
              ) : null}
            </React.Fragment>
          )}
        >
          {this.state.subNodeList.map((item: subLinkNoteItem, index) => {
            return (
              <TabPane
                tab={item['note'] ? item['note'] : subMsgs['getNodeDefaultNote']}
                key={item['id']}
              >
                <div style={{
                  width: `100%`,
                  height: `68vh`,
                  overflow: `scroll`
                }}>
                  <Row gutter={[24, 24]}>
                    { !item['list'].length ? (
                      <Empty style={{ margin: '8vw' }} 
                        description={
                          <React.Fragment>
                            { subMsgs['subNodesEmptyDesc'] }
                          </React.Fragment>
                        }>
                        <Button type="primary">
                          { subMsgs['subNodesEmptyButton'] }
                        </Button>
                      </Empty>
                    ) : item['list'].map((citem, index) => {
                      return (
                        <Col key={ index } span={ 4 }>
                          <Box />
                        </Col>
                      )
                    })}
                  </Row>
                </div>
              </TabPane>
            )
          })}
        </Tabs>

      </Main>
    )
  }
}