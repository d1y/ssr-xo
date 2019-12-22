import React, { PureComponent } from 'react'

import '../css/box.scss'

interface Props<T> extends React.Props<T> {
  readonly item?: any
}

class Box extends PureComponent {
  render() {
    return (
      <div className="box">
        <p>
          <span>
          { true ? 'SSR' : 'SS' }
          </span>
        </p>
        <p className="title">
        [Bronze][0.8] 香港61 - HKT商业宽频 - SSR协议
        </p>
      </div>
    )
  }
}

export default Box