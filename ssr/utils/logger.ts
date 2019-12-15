/*
** 打印日志
*/

import { join } from 'path'
import fs from 'fs-extra'
import { createFormatDate } from '.'
import { shadowsockRuntimeLogPath } from '../constant'
import { allTextMsg } from '../constant/msgs'

export const enum logLevel {
  error = 'error', // 错误
  warn = 'warn',  // 警告
  info = 'info',  // 提示
  verbose = 'verbose', // 
  debug = 'debug'   // 调试级别
}

/*
** 创建日志文本
** @param { String } level 等级
** @param { String } string
** @return { String }
*/
export const createLogText = (level: string, text: string): string => {
  const now = createFormatDate(new Date, true)
  return `${ now } [${ level }] ${ text } \n`
}

/*
** 创建日志文件
** @param { String | Date } cp2 - 时间, 默认是当前
** @return { Boolean }
*/
export const createLogFile = (time: string | Date = new Date): string => {
  let filename = createFormatDate(time)
  if (!filename) return ''
  const path = join(shadowsockRuntimeLogPath, `${ filename }.log`)
  fs.ensureFileSync(path)
  return path
}

/*
** 写入日志文件
** @param { String } path 路径
** @return { void }
*/
export const appendWriteLogFile = (
  path: string,
  level: string,
  text: string
): void => {
  const log = createLogText(level, text)
  fs.appendFileSync(path, log)
}

export default {
  ssr: (level: string, ...text: Array<string | number>): void => {
    const path =  createLogFile()
      if (path) {
        appendWriteLogFile(path, level, path)
      } else {
        throw new Error(allTextMsg.unknown)
      }
  }
}