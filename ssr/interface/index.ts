export interface ssrConfig {

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
  shareOverLan?: boolean

  // 本地监听端口
  listen_port?: number

  // tcp 超时连接
  timeout?: number

  // 协议
  protocol?: string

  // 混淆
  obfs?: string

  // 混淆参数
  obfs_param?: string

  // [propName: string]: any;
}

export interface ssConfig {
  
  // 服务器地址
  server: string

  // 加密方法
  cipher: string

  // 密码
  password: string

  // 端口
  port: number
}