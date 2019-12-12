import { ssr_init } from './../utils/ssr';
import router from '@koa/router'

const Router = new router({ prefix: '/ssr' })

Router
  .get('/check', async ctx=> {
    
  })
  .post('/init', async ctx=> {
    const isInit = await ssr_init()
    console.log('创建中')
    ctx.body = {
      code: 200,
      msg: isInit ? '成功' : '失败'
    }
  })

export default Router