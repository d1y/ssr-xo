import { ssrUtils } from './ssr'
import { ssrConfig } from './../interface'
import got from 'got'
import logger, { logLevel } from './logger'
import { allTextMsg } from '../constant/msgs'
import { Base64 } from '.'
import { fetchSubDataLinkTimeout } from '../constant'

export const fetchSubDataLink = async (url: string): Promise<false | ssrConfig[]>=> {

  // 获取订阅的话一般默认情况下都是 `get` 请求
  try {

    const res: any = await new Promise(async (rcv)=> {
      // [bug] https://github.com/sindresorhus/got/issues/997
      const temp = await got(url, { timeout: fetchSubDataLinkTimeout })
      rcv(temp.body)
      // setTimeout(async ()=> {
      //   if ((await temp).body) {
      //     rcv((await temp).body)
      //   } else rcv(false)
      // }, fetchSubDataLinkTimeout)
    })
    let body: string = res
    const config = ssrUtils.fetchDataToSSR(body)
    if (config) {
      const code = Base64.encode(url)
      ssrUtils.createSubLinkNodeFile(code, config)
      return config
    } else {
      logger.ssr(logLevel.error, allTextMsg.subNodeFail, url)
      return false
    }
    // TODO 发送请求之后, 将此时的更新的时间更新到某个文件中
  } catch (e) {
    console.log('请求失败')
    logger.ssr(logLevel.error, allTextMsg.subNodeFail, url)
    return false
  }
  
}

export default got