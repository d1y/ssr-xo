import router from '@koa/router'
import initSSR from './ssr'
import { routerPrefix } from '../constant'

const Api = new router({ prefix: routerPrefix.wrapper })

Api
  .use(initSSR.routes())
  .use(initSSR.allowedMethods())

// Api.stack.map(item=> {
//   console.log('item: ', item['path']);
// })

export default Api