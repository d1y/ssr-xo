/*
** 打印日志
*/

import { join } from 'path'
import fs from 'fs-extra'
import { LOG_PATH } from '../constant';
import { createFormatDate } from '.';

// ssr 运行路径
export const shadowsockRuntimePath = join(LOG_PATH, 'shadowsock-client')

export const logLevel = [
  `error`, // 错误
  `warn`,  // 警告
  `info`,  // 提示
  `verbose`, // 
  `debug`    // 调试级别
]

/*
** 创建日志文本
** @param { String } level 等级
** @param { String } string
** @return { String }
*/
export const createLog = (level: string, text: string): string => {
  const now = (new Date).toString()
  return `${ now } [{${ level }}] {${ text }}`
}

/*
** 创建日志文件
** @param { String | Date } cp2 - 时间, 默认是当前
** @return { Boolean }
*/
export const createLogFile = (cp2: string | Date = new Date): string => {
  let log = createFormatDate(cp2)
  // console.log('log: ', log);
  if (!log) return ''
  const path = join(shadowsockRuntimePath, `${ log }.log`)
  fs.ensureFileSync(path)
  return path
}

/*
** 写入日志文件
** @param { String } path 路径
** @return { void }
*/
export const appendWriteLogFile = (path: string, level: string, text: string)=> {
  const log = createLog(level, text)
  fs.appendFileSync(path, log)
}

export default {
  ssr: (level: string, text: string) => {
    const path =  createLogFile()
      if (path) {
        appendWriteLogFile(path, level, path)
      } else {
        throw new Error('未知错误')
      }
  }
}