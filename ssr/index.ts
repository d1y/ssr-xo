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
  // console.clear()
  const port: number = await interPort()
  // console.log('port: ', port);
  server(port).then((full)=> {
    const text = `server listen to\n http://localhost:${ port }${ full }`
    const log =  cowsay.say({
      text,
    })
    console.log(log);
    autoCreateAppPath()
    initPID(true)
  })
})()
