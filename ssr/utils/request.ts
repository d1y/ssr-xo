import { ssrUtils } from './ssr'
import { ssrConfig } from './../interface'
import got from 'got'
import logger from './logger'
import { allTextMsg } from '../constant/msgs'

export const fetchSubDataLink = async (url: string): Promise<false | ssrConfig[]>=> {

  // 获取订阅的话一般默认情况下都是 `get` 请求
  try {
    const res = await got(url)
    let body: string = res.body
    return ssrUtils.fetchDataToSSR(body)
    // TODO 发送请求之后, 将此时的更新的时间更新到某个文件中
  } catch (e) {
    logger.ssr('error', allTextMsg.subNodeFail, url)
    return false
  }
  
}

export default got