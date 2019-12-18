import { isDev } from './../config/index'
import { mockSSR, mockSSRLink, mockSSLink } from './../mock/index'
import { checkPort, Base64, writeToMainLogFile } from '.'
import { execFile } from 'child_process'
import { isPythonInstalled, pythonCLI } from './../utils/env'
import { 
  SSR_REPO, 
  SSR_PATH,
  ssrLocalPy,
  xoRuntimeConfigFile,
  subLinkStatus
} from "../constant"
import logger, { logLevel } from './logger'
import { ssrConfig, AppRuntimeConf } from '../interface'
import { allTextMsg } from '../constant/msgs'
import fs from 'fs-extra'
import lowDB, { subLinkFileWrapper } from './lowdb'
import { subLinkItemInterface } from '../interface/index';
const downloadRepo = require('download-git-repo')

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
  static run = async (
    appConfig: ssrConfig | string
  )=> {
    // console.log('appConfig: ', appConfig);
    if (typeof appConfig === 'string') {
      const config = ssrUtils.decodeSSR(appConfig)
      // console.log('config: ', config);
      if (config) {
        appConfig = config as ssrConfig
      }
    }
    // 是否允许来自局域网内的连接
    const listenHost = true ? '0.0.0.0' : '127.0.0.1'

    // 先结束之前的进程
    await ssrRuntime.stop()

    const listen_port: number = 1080

    try {
      await checkPort(listenHost, listen_port)
    } catch (e) {
      logger.ssr(logLevel.error, allTextMsg.portIsUsed, listen_port)
    }
    const config: ssrConfig = appConfig as ssrConfig
    // 参数
    let params: Array<string | number> = [ ssrLocalPy ]
    // 服务器地址
    params.push('-s')
    params.push(config.server)
    // 服务器端口
    params.push('-p')
    params.push(config.port)
    // 服务器密码
    params.push('-k')
    params.push(`"${ config.password }"`)
    // 加密方法
    params.push('-m')
    params.push(config.cipher)

    // -------------

    if (config.protocol) {
      params.push('-O')
      params.push(config.protocol)
    }

    if (config.protocol_param) {
      params.push('-G')
      params.push(config.protocol_param)
    }

    if (config.obfs) {
      params.push('-o')
      params.push(config.obfs)
    }
    if (config.obfs_param) {
      params.push('-g')
      params.push(config.obfs_param)
    }

    // -------------

    // 本地监听地址
    params.push('-b')
    params.push(listenHost)

    // 本地监听端口
    params.push('-l')
    params.push((listen_port as any))

    // tcp 超时
    if (config.timeout) {
      params.push('-t')
      params.push((config.timeout as any))
    }

    runCommand(pythonCLI, params)

  }

  // 运行 `ss` | `ssr` 链接
  static runLink = async (link: string)=> {
    const conf = ssrUtils.decodeSSR(link)
    if (conf) {
      ssrRuntime.run(conf as ssrConfig)
    } else return false
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

  // 测试 `ssr` 安装状态
  // TODO
  static test = async (): Promise<boolean> => {
    const isLocalPY: boolean = fs.pathExistsSync(ssrLocalPy)
    // console.log('isLocalPY: ', isLocalPY);
    if (!isPythonInstalled || !isLocalPY) return false
    return true
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

  // 添加订阅
  static addSubLink(url: string): subLinkStatus {
    return subLinkFileWrapper(url).add()
  }

  // 删除订阅
  static removeSubLink(url: string): boolean {
    return subLinkFileWrapper(url).remove()
  }

  // 获取订阅
  static getSubLink(url?: string): any[] | null {
    return subLinkFileWrapper(url).get()
  }

  // 更新订阅
  static updateSubLink(code: string, conf: subLinkItemInterface): boolean {
    return subLinkFileWrapper(code).update(conf)
  }

}

export const readAppConfZero = (): AppRuntimeConf | boolean => {
  try {
    const config: AppRuntimeConf = JSON.parse(fs.readFileSync(xoRuntimeConfigFile, 'UTF-8'))
    return config
  } catch (error) {
    return false
  }
}

export const setUpAppConf = (conf: AppRuntimeConf): boolean => {
  writeToMainLogFile(1,2)
  try {
    fs.writeFileSync(xoRuntimeConfigFile, JSON.stringify(conf), {
      encoding: 'utf-8'
    })
  } catch (error) {
    writeToMainLogFile(error)
  }
  return true
}