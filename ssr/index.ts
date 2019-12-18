import { autoCreateAppPath, initPID } from './utils'

import { isDev } from './config/index'

import server from './server'
import { interPort } from './config'
import { AppRuntimeConf } from './interface'
import { setUpAppConf } from './utils/ssr'

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
  server(port).then((APPCONF: any) => {
    const conf: AppRuntimeConf = APPCONF
    conf['port'] = port
    let url: string = `http://localhost:${ conf['port'] }`
    if (!isDev) url += `/${ conf['longUUID'] }/${ conf['tinyUUID'] }`
    const text = `server listen to\n ${ url }`
    const log =  cowsay.say({
      text,
    })
    console.log(log);
    autoCreateAppPath()
    initPID(true)
    setUpAppConf(conf)
  }).catch((err: any)=> {
    throw new Error(err)
    process.exit()
  })
})()

// TODO
process.on('SIGINT', ()=> {
  console.log('进程已经关闭')
})