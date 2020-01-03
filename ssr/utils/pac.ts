/*
** source: https://github.com/d1y/electron-ssr/src/main/pac.js
** gfwlist(白名单): https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt
** 自动更新版本: https://raw.githubusercontent.com/petronny/gfwlist2pac/master/gfwlist.pac
** p2: https://raw.githubusercontent.com/shadowsocksrr/pac.txt/pac/pac.txt
** 自动生成脚本参考: https://github.com/shadowsocksrr/pac.txt/blob/master/pac_get.sh
** CDN版本: https://cdn.jsdelivr.net/gh/petronny/gfwlist2pac/gfwlist.pac
** pac: https://pac.newfuture.cc/
** https://github.com/sipt/shuttle/blob/develop/README_zh.md
** http://clash.razord.top/#/proxies
*/

import got from 'got'
import { PAC_FILE, routerPrefix, statusCode } from '../constant'
import * as fs from 'fs-extra'
import { writeToMainLogFile, isNumber } from '.'
import router from '@koa/router'
import koa from 'koa'
import { ReturnMessage } from '../interface'
import { statusMsg } from '../constant/msgs'

export const gfwlist = `https://cdn.jsdelivr.net/gh/petronny/gfwlist2pac/gfwlist.pac`

/*
** 下载`pac
** @params {Boolean} withDownload
*/
export const downloadPac = async (withDownload: boolean): Promise<boolean>=> {
  if (withDownload || fs.existsSync(PAC_FILE)) {
    fs.ensureFileSync(PAC_FILE)
    const status: boolean = await new Promise(async (rcv): Promise<boolean>=> {
      try {
        const data = await got(gfwlist)
        const { body } = data
        fs.writeFileSync(PAC_FILE, body)
        return true
      } catch (error) {
        writeToMainLogFile("下载pac文件失败\n", "路径: ", PAC_FILE, "raw_url: ", gfwlist)
        return false
      }
    })
    return status
  }
  return Promise.resolve(false)
}

interface pacSetConfigInterFace {
  // 本地映射的端口, 默认1080
  port: number
  // 监听地址, 127.0.0.1 | 0.0.0.0
  isShare: boolean
}

const createHost = (share: boolean): string => share ? '0.0.0.0' : '127.0.0.1'

/*
** 切换代理的端口
*/
export const pacSetConfig = (conf: pacSetConfigInterFace): false | string => {
  let port: number = conf['port'],
  listen: string = createHost(conf['isShare'])
  const data = readPacFile()
  if (data) {
    let str: string = `SOCKS5 ${ listen }:${ port }`
    // console.log('str: ', str);
    const newStr = data.replace(/SOCKS5 127\.0\.0\.1\:1080/, str)
    // console.log('newStr: ', newStr.slice(0, 200));
    return newStr
  }
  return false
}

// 返回一个中间件
export const initPAC = (app: koa)=> {
  const middleware = new router({
    prefix: routerPrefix.pac
  })
  middleware.get('/diy/:port', async ctx=> {
    let { port } = ctx.params
    const isPort = isNumber(port)
    if (!isPort) port = 1080
    // TODO ctx.append
    ctx.set('Content-Type', 'application/x-ns-proxy-autoconfig')
    ctx.set('Connection', 'close')
    const data = pacSetConfig({
      port,
      isShare: false
    })
    // console.log('body: ', (data as string).slice(0, 200))
    if (data) return ctx.body = data
    const Return: ReturnMessage = {
      code: statusCode.fail,
      msg: statusMsg.fail,
      data: gfwlist
    }
    ctx.body = Return
  }).get('/init', async ctx=> {
    const isFlag = await downloadPac(true)
    ctx.body = isFlag
  })
  app
    .use(middleware.routes())
    .use(middleware.allowedMethods())
}

/*
** 读取`pac`文件
*/
export const readPacFile = (path: string = PAC_FILE): string | false=> {
  try {
    const readData = fs.readFileSync(path).toString('utf-8')
    return readData
  } catch (error) {
    writeToMainLogFile('pac文件读取失败, 可能是不存在, 需要下载, 可执行初始化路由')
    return false
  }
  return false
}