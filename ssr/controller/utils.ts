import router from '@koa/router'
import { routerPrefix, statusCode } from '../constant'
import { fetchSoftVersion } from '../utils'
import { ReturnMessage } from '../interface'
import { allTextMsg } from '../constant/msgs'
import { readAppConfZero } from '../utils/ssr'

const Router = new router({
  prefix: routerPrefix.utils
})

Router
  .get('/version', async ctx=> {
    const Return: ReturnMessage = {
      code: 200,
      msg: allTextMsg.getSoftVersion,
      data: fetchSoftVersion()
    }
    ctx.body = Return
  })
  .post('/conf', async ctx=> {
    const data = readAppConfZero()
    const code = data ? statusCode.success : statusCode.fail
    const Return: ReturnMessage = {
      code,
      msg: data ? allTextMsg.getAppConfSucess : allTextMsg.getAppConfFail,
      data
    }
    ctx.body = Return
  })

export default Router