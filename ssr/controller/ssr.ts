import { ssrRuntime, ssrUtils } from '../utils/ssr'
import router from '@koa/router'
import { statusCode, routerPrefix, subLinkStatus } from '../constant'
import { statusMsg, allTextMsg } from '../constant/msgs'
import { ReturnMessage } from '../interface'
import { fetchSubDataLink } from '../utils/request'
import { isDev } from '../config'

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

  // 获取订阅详细信息(id)
  .get('/list/fetch/:id', async ctx=> {
    const { id } = ctx.params
    const data = ssrUtils.fetchSubLinkNodeFile(id)
    const Return: ReturnMessage = {
      code: 200,
      msg: allTextMsg.fetchOnceNodeSucess,
      data
    }
    ctx.body = Return
  })

  // 更新订阅详细信息(id)
  .post('/list/update/:id', async ctx=> {
    const { id } = ctx.params
    const flag = await ssrUtils.updateSubLinkNodeFile(id)
    console.log('flag: ', flag);
    const Return: ReturnMessage = {
      code: flag ? statusCode.success : statusCode.fail,
      msg: flag ? allTextMsg.updateSubLinkItemSucess : allTextMsg.updateSubLinkItemFail
    }
    ctx.body = Return
  })

  // 添加一个节点(url, note)
  .post('/add', async ctx=> {
    const { url, note } = ctx.request.body
    const code = ssrUtils.addSubLink(url, note)
    const isFail = typeof code != 'string'
    let msg = isFail ? allTextMsg.addSubLinkItemFail : allTextMsg.addSubLinkItemSucess
    if (subLinkStatus.already == code) {
      msg = allTextMsg.addSubLinkItemSucessAlready
    }
    const Return: ReturnMessage = {
      code: isFail ? statusCode.fail : statusCode.success,
      msg,
      data: code
    }
    ctx.body = Return
  })

  // 删除某个订阅节点的信息(id)
  .post('/remove', async ctx=> {
    const { id } = ctx.request.body
    // console.log('id: ', id);
    const isRemove = ssrUtils.removeSubLink(id)
    let msg = {
      success: '',
      fail: ''
    }
    if (id) {
      msg['success'] = allTextMsg.removeSubLinkItemSucess
      msg['fail'] = allTextMsg.removeSubLinkItemFail
    } else {
      msg['success'] = allTextMsg.removeSubLinkAllSucess
      msg['fail'] = allTextMsg.removeSubLinkAllFail
    }
    const Return: ReturnMessage = {
      code: isRemove ? statusCode.success : statusCode.fail,
      msg: isRemove ? msg['success'] : msg['fail'],
      data: id
    }
    ctx.body = Return
  })
  
  // 更新某个订阅节点信息(id)
  .post('/update/:id', async ctx=> {
    const { id } = ctx.params
    const body = ctx.request.body
    const isUpdate = ssrUtils.updateSubLink(id, body)
    const Return: ReturnMessage = {
      code: isUpdate ? statusCode.success : statusCode.fail,
      msg: isUpdate ? allTextMsg.updateSubLinkItemSucess : allTextMsg.updateSubLinkItemFail
    }
    ctx.body = Return
  })

  // 测试订阅节点
  .post('/test', async ctx=> {
    const { url } = ctx.request.body
    const isSucess = await new Promise(async (rcv)=> {
      try {
        const data = await fetchSubDataLink(url)
        rcv(isDev ? data : true)
      } catch (error) {
        rcv(false)
      }
    })
    const Return: ReturnMessage = {
      code: isSucess ? statusCode.success : statusCode.fail,
      msg: isSucess ? allTextMsg.testOnceNodeSucess : allTextMsg.testOnceNodeFail,
      data: isDev ? isSucess : ''
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
    const data = await fetchSubDataLink(url)
    const Return: ReturnMessage = {
      code: data ? statusCode.success : statusCode.fail,
      msg: data ? allTextMsg.updateOnceByLinkSucess : allTextMsg.updateOnceByLinkFail
    }
    ctx.body = Return
  })
  .use('/sub', Sub.routes(), Sub.allowedMethods())

export default Router