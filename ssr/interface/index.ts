// `ssr` 配置
export interface ssrConfig {

  // 名称
  group?: string

  // 备注
  remarks?: string

  // 服务器地址
  server: string

  // 服务器端口
  port: number

  // 服务器密码
  password: string

  // 加密协议
  cipher: string

  // 本地监听地址
  // listen_host: string

  // 运行来自局域网的连接
  // shareOverLan?: boolean

  // 本地监听端口
  // listen_port?: number

  // tcp 超时连接
  timeout?: number

  // 协议
  protocol?: string

  // 协议参数
  protocol_param?: string

  // 混淆
  obfs?: string

  // 混淆参数
  obfs_param?: string

}

// 统一的返回接口
export interface ReturnMessage {
  code: number
  msg: string
  data?: any
}

// 应用版本
export interface softVersion {
  python: string | null
  node: string
  v8: string
  xo: string | null
}

// 应用启动附带的配置
export interface AppRuntimeConf {
  // 端口号
  port: number
  longUUID: string
  tinyUUID: string
}

export interface subLinkItemInterface {
  // 更新的链接
  url: string
  // 更新的时间
  update: number
  // 根据`url`生成的`base64`码
  encode?: string
}