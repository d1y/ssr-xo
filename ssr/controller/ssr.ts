import { ssrRuntime } from '../utils/ssr'
import router from '@koa/router'
import { statusCode, routerPrefix } from '../constant'
import { statusMsg } from '../constant/msgs'

const Router = new router({
  prefix: routerPrefix.ssr
})

Router
  .get('/check', async ctx=> {
    
  })
  // 初始化
  .post('/init', async ctx=> {
    const isInit = await ssrRuntime.init()
    ctx.body = {
      code: isInit ? statusCode.success : statusCode.fail,
      msg: isInit ? statusMsg.success : statusMsg.fail
    }
  })

export default Router