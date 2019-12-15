import router from '@koa/router'
import { routerPrefix } from '../constant'
import { fetchSoftVersion } from '../utils'
import { ReturnMessage } from '../interface'
import { allTextMsg } from '../constant/msgs'

const Router = new router({
  prefix: routerPrefix.utils
})

Router.get('/version', async ctx=> {
  const Return: ReturnMessage = {
    code: 200,
    msg: allTextMsg.getSoftVersion,
    data: fetchSoftVersion()
  }
  ctx.body = Return
})

export default Router