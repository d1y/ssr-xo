import router from '@koa/router'

import api from '../controller'

const Router = new router()

Router
  .use(api.routes())
  .use(api.allowedMethods())

export = Router