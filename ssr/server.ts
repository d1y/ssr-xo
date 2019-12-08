/*
 * @Date: 2019-12-01 13:12:19
 * @Author: d1y
 * @Github: https://github.com/d1y
 * @LastEditors: d1y
 * @LastEditTime: 2019-12-01 14:55:06
 */

import http from 'http'
import koa from 'koa'
import router from '@koa/router'
// import path from 'path'

let PORT = (process.env as any).PORT | 2333

const App = new koa

const server = http.createServer(App.callback())

module.exports = (port: number = PORT)=> {
  server.listen(port)
}