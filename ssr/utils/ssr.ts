import { isDev } from './../config/index'
import { mockSSR, mockSSRLink, mockSSLink } from './../mock/index'
import { checkPort, Base64 } from '.'
import { execFile } from 'child_process'
import { isPythonInstalled } from './../utils/env'
import { SSR_REPO, SSR_PATH } from "../constant"
import logger, { logLevel } from './logger'
import path from 'path'
import { ssrConfig } from '../interface'
import { allTextMsg } from '../constant/msgs'

const downloadRepo = require('download-git-repo')

// 运行文件
export const localPy: string = path.join(SSR_PATH, `./shadowsocks/local.py`)

// `ssr` 进程
export let child: any

// 运行命令(`ssr`)
export const runCommand = (command: any, params: any): void => {
  if (command && params.length) {

    if (isDev) {
      const commandStr = `${command} ${params.join(' ')}`
      console.log('run: ', commandStr);
    }

    child = execFile(command, params)

    child.stdout.on('data', (info: string)=> {
      logger.ssr(logLevel.info, info)
    })

    child.stderr.on('data', (err: string)=> {
      console.log(logLevel.error, err);
    })

  }
}

/*
** `ssr` 运行时操作
** TODO
*/
export class ssrRuntime {

  // 初始化
  static init = async (): Promise<boolean>=> {
    if (!isPythonInstalled) return false
    try {
      let repo = SSR_REPO[0]
      return await new Promise(rcv=> {
        downloadRepo(repo, SSR_PATH, (flag: any)=> {
          rcv(flag ? false : true)
          logger.ssr(logLevel.info, allTextMsg.downloadSSRSucess)
        })
      })
    } catch (e) {
      logger.ssr(logLevel.error, allTextMsg.downloadSSRFail)
      return false
    }
    return true
  }

  // 运行
  static run = async (appConfig: ssrConfig)=> {

    // console.log('appConfig: ', appConfig);

    // 是否允许来自局域网内的连接
    const listenHost = true ? '0.0.0.0' : '127.0.0.1'

    // 先结束之前的
    await ssrRuntime.stop()

    const listen_port = 1080

    try {
      await checkPort(listenHost, listen_port)
    } catch (e) {
      logger.ssr('error', e)
    }

    // 参数
    const params = [ localPy ]
    // 服务器地址
    params.push('-s')
    params.push(appConfig.server)
    // 服务器端口
    params.push('-p')
    params.push((appConfig.port as any))
    // 服务器密码
    params.push('-k')
    params.push(`"${ appConfig.password }"`)
    // 加密方法
    params.push('-m')
    params.push(appConfig.cipher)

    // -------------

    if (appConfig.protocol) {
      params.push('-O')
      params.push(appConfig.protocol)
    }

    if (appConfig.protocol_param) {
      params.push('-G')
      params.push(appConfig.protocol_param)
    }

    if (appConfig.obfs) {
      params.push('-o')
      params.push(appConfig.obfs)
    }
    if (appConfig.obfs_param) {
      params.push('-g')
      params.push(appConfig.obfs_param)
    }

    // -------------

    // 本地监听地址
    params.push('-b')
    params.push(listenHost)

    // 本地监听端口
    params.push('-l')
    params.push((listen_port as any))

    // tcp 超时
    if (appConfig.timeout) {
      params.push('-t')
      params.push((appConfig.timeout as any))
    }

    runCommand('python', params)

  }

  // 结束command的后台运行
  // TODO
  static stop = (force = false)=> {
    if (child && child.pid) {
      const pid = child, pidMsg = `PID: ${ pid }`
      logger.ssr( logLevel.info, allTextMsg.readyStopBySSR, pidMsg)
      return new Promise((resolve, reject) => {
        child.once('close', () => {
          child = null
          if (timeout) {
            clearTimeout(timeout)
          }
          resolve()
        })
        const timeout = setTimeout(() => {
          // 5m内如果还没有关掉仍然resolve
          logger.ssr('error', allTextMsg.ssrNotClose, pidMsg)
          resolve()
        }, 5000)
        process.kill(child.pid, 'SIGKILL')
      })
    }
    return Promise.resolve()
  }

}

export class ssrUtils {

  /*
  ** 将订阅拿到的数据转为 `ssr` 对象
  */

  static fetchDataToSSR = async (data: string): Promise<false | ssrConfig[]>=> {
    try {
      let body = Base64.decode(data)
      let arr: string[] = body.split('\n')
      let result: Array<ssrConfig> = []
      arr.forEach(item=> {
        if (item) {
          try {
            const config = ssrUtils.decodeSSR(item)
            if (config) {
              result.push((config as ssrConfig))
            }
          } catch (e) {}
        }
      })
      return result
    } catch (e) { return false }
  }

  /*
  ** 将 `ssr` 转为对象
  ** @param {String} ssr ssr加密文本
  ** @return {ssrConfig}
  */
  static decodeSSR = (ssr: string): ssrConfig | boolean => {

    let config: ssrConfig = {
      server: '',
      port: 0,
      password: '',
      cipher: ''
    }

    const data = ssrUtils.isLinkValid(ssr)
    const [ flag, args ] = data
    if (!flag) return false
    const [ valid, split2, split3 /*, remark*/ ] = args as any
    if (valid) {
      if (flag == 1) {

        config['server'] = split3[0]
        config['port'] = +split3[1]
        config['cipher'] = split2[0]
        config['password'] = split2[1]

      } else if (flag == 2) {

        let requiredSplit = split2
        let otherSplit = split3

        config['server'] = requiredSplit[0]
        config['port'] = +requiredSplit[1]
        config['cipher'] = requiredSplit[3]
        config['password'] = Base64.decode(requiredSplit[5])

        // 协议
        config['protocol'] = requiredSplit[2]

        // 混淆
        config['obfs'] = requiredSplit[4]

        // 混淆参数
        if (otherSplit.obfsparam) {
          config['obfs_param'] = Base64.decode(otherSplit.obfsparam)
        }

        // 协议参数
        if (otherSplit.protoparam) {
          config['protocol_param'] = Base64.decode(otherSplit.protoparam)
        }

        // 备注
        if (otherSplit.remarks) {
          config['remarks'] = Base64.decode(otherSplit.remarks)
        }

        // 名称
        if (otherSplit.group) {
          config['group'] = Base64.decode(otherSplit.group)
        }

      }
    } else return false
    return config
  }

  // ssr://xxx 地址是否正确 
  static isSSRLinkValid (link: string) {
    try {
      const body = link.substring(6)
      const decoded = Base64.decode(body)
      const _split = decoded.split('/?')
      const required = _split[0]
      const others = _split[1]
      const requiredSplit = required.split(':')
      if (requiredSplit.length !== 6) {
        return [false]
      }
      const otherSplit: any = {}
      others && others.split('&').forEach(item => {
        const _params = item.split('=')
        otherSplit[_params[0]] = _params[1]
      })
      return [true, requiredSplit, otherSplit]
    } catch (e) {
      return [false]
    }
  }

  // ss://xxx 地址是否正确
  static isSSLinkValid (link: string) {
    try {
      let body = link.substring(5)
      const _split = body.split('#')
      body = _split[0]
      const decoded = Base64.decode(body)
      // console.log('decoded: ', decoded)
      const split1 = decoded.split('@')
      const split2 = split1[0].split(':')
      const split3 = split1[1].split(':')
      if (split2.length !== 2 || split3.length !== 2) {
        return [false]
      }
      return [true, split2, split3, _split[1]]
    } catch (e) {
      return [false]
    }
  }

  // 判断链接是否是可用的ss(r)地址
  // 1: ss
  // 2: ssr
  // false: 链接无效
  static isLinkValid (link: string) {
    if (/^ssr:\/\//.test(link)) {
      return [2, ssrUtils.isSSRLinkValid(link)]
    } else if (/^ss:\/\//.test(link)) {
      return [1, ssrUtils.isSSLinkValid(link)]
    }
    return [false]
  }

}

// 测试连接
if (isDev) {
  // let code = ssrUtils.decodeSSR(mockSSRLink)
  // if (code) {
  //   ssrRuntime.run((code as ssrConfig))
  // }
  // let code = ssrUtils.decodeSSR(mockSSLink)
  // console.log('code: ', code);
  // console.log('code: ', code);
  // ssrUtils.ssrDecode(code)
  // runWithConfig(code)
}