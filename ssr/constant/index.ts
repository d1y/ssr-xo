import path from 'path'
import userHome from 'user-home'

/*
** @desc 下载`ssr`默认使用 `github`
** TODO: 添加多源
*/
export const SSR_REPO: string[] = [
  // [fix] 使用 akkariiin/master 分支
  "shadowsocksrr/shadowsocksr#akkariiin/master",
  "shadowsocksr-backup/shadowsocksr",
  "mengskysama/shadowsocks-rm"
]

// `app` 配置目录路径名称
export const ROOT_PATH: string = path.join(userHome, ".xo")

// `.pid` 文件
export const APP_PID_FILE: string = path.join(ROOT_PATH, 'xo.pid')

// `ssr` 目录
export const SSR_PATH: string = path.join(ROOT_PATH, 'ssr')

// 日志目录
export const LOG_PATH: string = path.join(ROOT_PATH, 'log')

// 订阅节点目录
export const SUB_PATH: string = path.join(ROOT_PATH, 'sub')

// ssr 运行日志路径
export const shadowsockRuntimeLogPath: string = path.join(LOG_PATH, 'shadowsockClient')

// 订阅节点更新日志
export const subLinkRuntimeLogPath: string = path.join(LOG_PATH, 'subscription')

// `package.json` 内容
export const dotJSON = require(path.join(process.cwd(), './package.json'))

// 状态码
export const enum statusCode {
  success = 200,
  fail = 404
}

// TODO
export const enum logType {
  ssr,
  sub,
}

export const enum routerPrefix {
  wrapper = '/api',
  ssr = '/ssr',
  utils = '/utils'
}