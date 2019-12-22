import http from 'http'
import koa from 'koa'
import koaStatic from 'koa-static'
import { join } from 'path'
import mount from 'koa-mount'
import favicon from 'koa-favicon'
import logger from 'koa-logger'
import body from 'koa-body'
import cors from '@koa/cors'
import middleware from '@koa/router'
import router from './router'

import { isDev } from './config/index'
import { createUUID, hexUUID } from './utils/index'
import { AppRuntimeConf } from './interface'

// https://stackoverflow.com/questions/54285727/why-cant-i-serve-static-files-from-a-koa-router
const App = new koa
const mainID: string = createUUID()
const slideID: string = hexUUID()
const full: string = `/${mainID}/${ slideID }`
// console.log('full: ', full)

const APPCONF: AppRuntimeConf = {
  port: 0,
  longUUID: mainID,
  tinyUUID: slideID
}

// 图标
let favicon_path: string = join(__dirname, "../client/build/favicon.ico")

if (!isDev) {
  favicon_path = join(__dirname, "../client/public/favicon.ico")
  App.use(mount(full, koaStatic(join(__dirname, "../client/build"))))
  App.use(mount('/static', koaStatic(join(__dirname, "../client/build/static"))))
} else {
  App.use(koaStatic(join(__dirname, "../client/build")))
  App.use(favicon(favicon_path))
  App.use(cors())
  App.use(logger())
}

/*
** 为了安全起见, 线上环境每次的路由都不同, 接口都不同
*/
const prefix: string = isDev ? '' : full
const Api = new middleware({ prefix })
Api
  .use(router.routes())
  .use(router.allowedMethods())

// Api.stack.map(item=> {
//   console.log('item: ', item['path']);
// })

App
  .use(body())
  .use(Api.routes())
  .use(Api.allowedMethods())
  .use(favicon(favicon_path))

const server = http.createServer(App.callback())

export default (port: number)=> new Promise(async rcv=> {
  await server.listen(port)
  rcv(APPCONF)
})