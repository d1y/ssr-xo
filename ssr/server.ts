
import http from 'http'
import koa from 'koa'

const App = new koa

const server = http.createServer(App.callback())

export default (port: number)=> new Promise(async rcv=> {
  await server.listen(port)
  rcv()
})