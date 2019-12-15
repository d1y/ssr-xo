import { ssrRuntime } from '../utils/ssr'
import router from '@koa/router'
import { statusCode, routerPrefix } from '../constant'
import { statusMsg } from '../constant/msgs'
import { ReturnMessage } from '../interface'

const Router = new router({
  prefix: routerPrefix.ssr
})

Router
  // 判断环境是否安装
  .post('/check', async ctx=> {
    const envIsInstalled = await ssrRuntime.test()
    const code = envIsInstalled ? statusCode.success : statusCode.fail
    const Return: ReturnMessage = {
      code,
      msg: envIsInstalled ? statusMsg.success : statusMsg.fail
    }
    ctx.body = Return
  })
  // 初始化
  // TODO 重新安装
  .post('/init', async ctx=> {
    const isInit = await ssrRuntime.init()
    let code = isInit ? statusCode.success : statusCode.fail
    const Return: ReturnMessage = {
      code,
      msg: isInit ? statusMsg.success : statusMsg.fail
    }
    ctx.status = code
    ctx.body = Return
  })

export default Router