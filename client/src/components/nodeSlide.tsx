import React, { PureComponent } from 'react'
import {
  Button,
  Icon
} from 'antd'
import '../css/utils.scss'

interface Props extends React.Props<any> {
  readonly onUpdate?: (e: any)=> void
  readonly onSpeed?: (e: any)=> void
  readonly id?: string
}

class slide extends PureComponent<Props> {
  render() {
    return (
      <React.Fragment>
        <Button
          type="danger"
          className="margin-right-lg"
          onClick={ this.props.onUpdate }
        >
          更新当前节点
        </Button>
        <Button
          type="primary"
          className="margin-left-sm"
          onClick={ this.props.onSpeed }
        >
          <Icon type="rocket" />测速
        </Button>
      </React.Fragment>
    )
  }
}

export default slide