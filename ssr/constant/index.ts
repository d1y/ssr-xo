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

// ssr 运行日志路径
export const shadowsockRuntimeLogPath: string = path.join(LOG_PATH, 'shadowsockClient')

// 订阅节点目录
export const SUB_PATH: string = path.join(ROOT_PATH, 'sub')

// 订阅节点配置文件
export const subLinkMainProfile: string = path.join(SUB_PATH, 'subscription.conf')

// 订阅节点
export const subLinkUnderProfile: string = path.join(SUB_PATH, './node')

// pac 文件
export const PAC_FILE: string = path.join(ROOT_PATH, 'pac.txt')

// 配置节点

// `package.json` 内容
// TODO 使用`fs`
// export const dotJSON = fs.readJSON(path.join(process.cwd(), './package.json'))
export let dotJSON: any
try {
  dotJSON = require(path.join(process.cwd(), './package.json'))  
} catch (error) {
  // TODO 打印日志到主日志
  dotJSON = false
}

// 运行时文件
export const ssrLocalPy: string = path.join(SSR_PATH, './shadowsocks/local.py')

// 运行时的配置文件
export const xoRuntimeConfigFile: string = path.join(ROOT_PATH, './xo.conf')

// `xo` 运行日志
export const appRuntimeLogFile: string = path.join(ROOT_PATH, 'main.log')

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
  utils = '/utils',
  pac  = '/pac'
}

// 添加节点时的状态
export enum subLinkStatus {
  success,
  fail,
  already
}

// 节点请求网络时的timeout
export const fetchSubDataLinkTimeout = 5000