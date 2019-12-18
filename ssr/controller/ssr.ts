import { ssrRuntime, ssrUtils } from '../utils/ssr'
import router from '@koa/router'
import { statusCode, routerPrefix } from '../constant'
import { statusMsg, allTextMsg } from '../constant/msgs'
import { ReturnMessage } from '../interface'
import { fetchSubDataLink } from '../utils/request'

const Router = new router({
  prefix: routerPrefix.ssr
})

const Sub = new router

Sub

  // 返回订阅列表
  // TODO 添加模糊查询(不知道有没有必要)
  .get('/list', async ctx=> {
    const list = ssrUtils.getSubLink()
    const msg = list?.length ? allTextMsg.getSubLinkListSuccess : allTextMsg.getSubLinkListFail
    const Return: ReturnMessage = {
      code: statusCode.success,
      msg,
      data: list
    }
    ctx.body = Return
  })

  .post('/add', async ctx=> {
    const { url } = ctx.request.body
    const code = ssrUtils.addSubLink(url)
    const isFail = code > 0
    const Return: ReturnMessage = {
      code: isFail ? statusCode.fail : statusCode.success,
      msg:  isFail ? allTextMsg.addSubLinkItemFail : allTextMsg.addSubLinkItemSucess,
    }
    ctx.body = Return
  })

  .post('/remove', async ctx=> {
    const { url } = ctx.request.body
    const isRemove = ssrUtils.removeSubLink(url)
    let msg = {
      success: '',
      fail: ''
    }
    if (url) {
      msg['success'] = allTextMsg.removeSubLinkItemSucess
      msg['fail'] = allTextMsg.removeSubLinkItemFail
    } else {
      msg['success'] = allTextMsg.removeSubLinkAllSucess
      msg['fail'] = allTextMsg.removeSubLinkAllFail
    }
    const Return: ReturnMessage = {
      code: isRemove ? statusCode.success : statusCode.fail,
      msg: isRemove ? msg['success'] : msg['fail']
    }
    ctx.body = Return
  })

  .post('/update/:code', async ctx=> {
    const { code } = ctx.params
    const body = ctx.request.body
    const isUpdate = ssrUtils.updateSubLink(code, body)
    const Return: ReturnMessage = {
      code: isUpdate ? statusCode.success : statusCode.fail,
      msg: isUpdate ? allTextMsg.updateSubLinkItemSucess : allTextMsg.updateSubLinkItemFail
    }
    ctx.body = Return
  })

Router

  // 判断环境是否安装
  .get('/check', async ctx=> {
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
  .post('/run', async ctx=> {
    const body = ctx.request.body
    const { url } = body
    console.log('url: ', url);
    const data = await fetchSubDataLink(url)
    console.log('data: ', data);
  })
  .use('/sub', Sub.routes(), Sub.allowedMethods())

export default Router