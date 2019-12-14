import { softVersion } from './../interface'
import router from '@koa/router'
import { routerPrefix } from '../constant'

const Router = new router({
  prefix: routerPrefix.utils
})

Router.get('/version', async ctx=> {
  
})

module.exports