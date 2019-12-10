import * as fs from 'fs-extra'

import { ROOT_PATH, APP_PID_FILE } from './../constant/index'


// 创建配置目录
export const autoCreateAppPath = (): void=> {
  fs.emptyDirSync(ROOT_PATH)
  // `.pid` 为程序运行时的`pid`, 方便直接 `kill` 程序
  fs.ensureFileSync(APP_PID_FILE)

}

// 将 `pid` 写入到 `.pid` 文件中
export const initPID = (append: boolean): void | string => {
  if (append) {
    const pid: number = process.pid
    // console.log('pid: ', pid);
    fs.writeFileSync(APP_PID_FILE, pid)
  } else {
    return fs.readFileSync(APP_PID_FILE, 'utf-8')
  }
}