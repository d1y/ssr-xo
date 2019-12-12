import router from '@koa/router'
import initSSR from './initSSR'

const prefix: string = `/api`
const Api = new router({ prefix })

Api.get('/', async ctx=> ctx.body = 233)

Api
  .use(initSSR.routes())
  .use(initSSR.allowedMethods())


export default Api