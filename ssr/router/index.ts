import { createUUID } from './../utils/index'
import { isDev } from './../config/index'
import router from '@koa/router'
import server from 'koa-static'
import mount from 'koa-mount'
import { join } from 'path'
import koa from 'koa'
const Router = new router()

let client: string = createUUID()
// console.log('client: ', client);

const app = new koa()

// const path = join(__dirname, "../../client/build")
// const path = join(__dirname, './fuck')

// app.use(server(path, {
//   index: 'index.html'
// }))

Router.get('/api', async ctx=> {
  // console.log('path: ', path);
  ctx.body = '/index'
})

// Router.use('/fuck', mount(app))

export = Router