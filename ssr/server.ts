import http from 'http'
import koa from 'koa'
import router from './router'
import koaStatic from 'koa-static'
import { join } from 'path'
import mount from 'koa-mount'
import favicon from 'koa-favicon'
import logger from 'koa-logger'

import { isDev } from './config/index'
import { createUUID, hexUUID } from './utils/index'

// https://stackoverflow.com/questions/54285727/why-cant-i-serve-static-files-from-a-koa-router
const App = new koa
const mainID: string = createUUID()
const slideID: string = hexUUID()
const full: string = `/${mainID}/${ slideID }`
// console.log('full: ', full)

// 图标
let favicon_path: string = join(__dirname, "../client/build/favicon.ico")
// console.log('是否是开发模式: ', isDev);
if (!isDev) {
  favicon_path = join(__dirname, "../client/public/favicon.ico")
  App.use(mount(full, koaStatic(join(__dirname, "../client/build"))))
  App.use(mount('/static', koaStatic(join(__dirname, "../client/build/static"))))
} else {
  App.use(koaStatic(join(__dirname, "../client/build")))
  App.use(favicon(favicon_path))
  App.use(logger())
}

App
  .use(router.routes())
  .use(router.allowedMethods())

App.use(favicon(favicon_path))

const server = http.createServer(App.callback())

export default (port: number)=> new Promise(async rcv=> {
  await server.listen(port)
  rcv(isDev ? '' : full)
})