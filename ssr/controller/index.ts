import router from '@koa/router'
import ssr from './ssr'
import utils from './utils'
import { routerPrefix } from '../constant'

const Api = new router({ prefix: routerPrefix.wrapper })

Api
  .use(ssr.routes())
  .use(ssr.allowedMethods())
  .use(utils.routes())
  .use(utils.allowedMethods())

// Api.stack.map(item=> {
//   console.log('item: ', item['path']);
// })

export default Api