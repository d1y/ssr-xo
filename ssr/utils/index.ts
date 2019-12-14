import { pythonVersion } from './env'
import { softVersion } from './../interface'
import * as fs from 'fs-extra'
import crypto from 'crypto'
import { ROOT_PATH, APP_PID_FILE, LOG_PATH } from './../constant'
import base64 from 'urlsafe-base64'

// 检查端口是否被占用
export const checkPort = require('ck-port/checkPort')

// 创建配置目录
export const autoCreateAppPath = (): void=> {
  // [fix] 解决每次都会清空配置目录问题
  fs.ensureDirSync(ROOT_PATH)
  // [add] 创建 `log` 目录
  fs.ensureDirSync(LOG_PATH)
  // `.pid` 为程序运行时的`pid`, 方便直接 `kill` 程序
  fs.ensureFileSync(APP_PID_FILE)

}

/*
** 将 `pid` 写入到 `.pid` 文件中
** @param { Boolean } append 是否将文件写入
** @return { void | string }
*/
export const initPID = (append: boolean): void | string => {
  if (append) {
    const pid: number = process.pid
    // console.log('pid: ', pid);
    fs.writeFileSync(APP_PID_FILE, pid)
  } else {
    return fs.readFileSync(APP_PID_FILE, 'utf-8')
  }
}

// 创建 `uuid`
export const createUUID = (): string=> {
  return (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
}

// `hexid`
export const hexUUID = (): string => {
  return crypto.randomBytes(256 / 100).toString('hex')
}

/*
** 判断是不是同一天
** @param { String | Date } old 日期1
** @param { String | Date } cur 日期2
** @return {boolean}
*/
export const check_time_is_one_day = (
  old: string | Date,
  cur: string | Date = new Date
): boolean => {
  try {
    return (new Date(old)).toDateString() === (new Date(cur)).toDateString()
  } catch (e) {
    // 转换格式失败
    return false
  }
}

// 自动加0
const autoAddByZero = (n: number): string => {
  if (n <= 9) {
    return `0${ n }`
  }
  return `${ n }`
}

/*
** 生成日期
** @param { String | Date } format 需要格式化的时间
** @param { Boolean } full 是否返回完整的时间
** @return { String | Boolean }
*/
export const createFormatDate = (
  format: string | Date = new Date,
  full: boolean = false
): string => {
  try {
    const time = new Date()
    let 
      y = time.getFullYear(),
      m: string | number = time.getMonth(),
      d: string | number = time.getDate()
    m = autoAddByZero(m)
    d = autoAddByZero(d)
    let format = `${ y }-${ m }-${ d }`
    if (full) {
      let
        s: string | number = time.getSeconds(), // 秒
        h: string | number = time.getHours(), // 时
        min: string | number = time.getMinutes() // 分钟

      s = autoAddByZero(s)
      h = autoAddByZero(h)
      min = autoAddByZero(min)
      return `${ format } ${ h }-${ h }-${ s }`
    }
    return format
  } catch (e) {
    return ``
  }
}

// `base64` 加密解密
export const Base64 = {
  decode: (str: string): string=> {
    return base64.decode(str).toString('utf-8')
  },
  encode: (str: string): string=> {
    return base64.encode(Buffer.from(str, 'utf-8'))
  },
  validate: (str: string): boolean=> {
    return base64.validate(str)
  }
}

// 返回版本号
export const fetchSoftVersion = (): softVersion => {
  const soft: softVersion = {
    python: pythonVersion,
    node: process.version,
    v8: process.versions.v8,
    xo: ''
  }
  return soft
}