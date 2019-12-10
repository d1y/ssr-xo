import { autoCreateAppPath, initPID } from './utils'

import { isDev } from './config/index'

import server from './server'
import { interPort } from './config'

const cowsay = require('cowsay')

/*
** TODO:
** 1. 自动停止进程
** 2. 自动重启
** 3. 查看当前 `hashMap` url
*/
;(async ()=> {
  console.clear()
  const port: number = await interPort()
  server(port).then(()=> {
    const text = `server listen to\n http://localhost:${ port }`
    const log =  cowsay.say({
      text,
    })
    console.log(log);
    if (isDev) {
      autoCreateAppPath()
      initPID(true)
    }
  })
})()
