import { isPythonInstalled } from './../utils/env';
import router from '@koa/router'

import { SSR_REPO } from "../constant"

const downloadRepo = require('download-git-repo')

const Router = new router({
  prefix: 'ssr'
})

Router
  .get('/check', async ctx=> {
    ctx.body = {
      isPython: isPythonInstalled
    }
  })
  .get('/init', async ctx=> {

  })

export default Router