/*
** 轻量级`json-db`
** create by @d1y in 2019-12-17
*/

import fs from 'fs-extra'
import path from 'path'
import { subLinkMainProfile, subLinkStatus } from '../constant'
import { Base64 } from '.'
import { subLinkItemInterface } from '../interface'

interface lowDBInterface {
  file: string
}

export default class lowDB {

  public raw_path: string

  constructor(conf: lowDBInterface) {
    const raw_path = path.normalize(conf['file'])
    fs.ensureFileSync(raw_path)
    this.raw_path = raw_path
  }

  /*
  ** 保存到文件
  ** @param {any} data
  ** @return this
  */
  save(data: any): this | boolean {
    let content: string = ''
    if (typeof data == 'object') {
      content = JSON.stringify(data)
    } else if (typeof data == 'string') {
      try {
        JSON.parse(data)
      } catch(e) {
        return false
      }
    }
    fs.writeFileSync(this.raw_path, content)
    return this
  }

  /*
  ** 添加
  */
  append(data: any, save: boolean = false) {

  }

  // 转成对象
  toObject(): any {
    try {
      return fs.readJSONSync(this.raw_path)
    } catch(e) {
      return []
    }
  }

  // 转成`json`字符串
  toString(): any {
    try {
      return fs.readFileSync(this.raw_path).toString('utf-8')
    } catch(e) {
      return ''
    }
  }

}

interface saveInterface extends lowDBInterface {
  data: any
}

// 保存
export const save = (conf: saveInterface): boolean | lowDB => {
  const low = new lowDB(conf)
  return low.save(conf['data'])
}

// 订阅实例
export const subLinkFileWrapper = (url?: string) => {
  const lowdb: lowDB = new lowDB({
    file: subLinkMainProfile
  })
  let data: any[]
  try {
    data = lowdb.toObject()
  } catch (e) {
    data = []
  }
  // TODO
  if (url && Base64.validate(url)) {
    url = Base64.decode(url)
  }
  let index: number | false = false
  const isAlready = data.some((item: subLinkItemInterface, i)=> {
    if (item['url'] == url) {
      index = i
      return true
    }
  })
  return {
    get: (): subLinkItemInterface[] | null=> {
      if (!url) return data
      if (index) {
        return data[index]
      }
      return null
    },
    add() {
      if (isAlready) return subLinkStatus.already
      const encode: string = Base64.encode(url as string)
      const update: number = Date.now()
      const subLinkItem: subLinkItemInterface = {
        url: url as string,
        update,
        encode
      }
      try {
        data.unshift(subLinkItem)
        lowdb.save(data)
        return subLinkStatus.success
      } catch (error) {
        return subLinkStatus.fail
      }
    },
    remove(): boolean {
      if (isAlready && index >= 0) {
        try {
          data.splice((index as number), 1)
          lowdb.save(data)
          return true
        } catch (e) {
          return false
        }
      } else if (!index && !url) {
        // 删除全部!
        try {
          lowdb.save([])
          return true
        } catch(e) {
          return false
        }
      }
      return false
    },
    update(conf: subLinkItemInterface): boolean {
      /*
      更新分为两种状态
      1. 修改 `url`, 订阅时间不变, 自动修改 `base64` 码
      2. 修改订阅时间
      */
      const { url, update } = conf
      if (typeof index === 'boolean') return false
      if (url) {
        data[index]['url'] = url
        data[index]['encode'] = Base64.encode(url)
      } else if (update) {
        // TODO: update返回一个`boolean`, 后端自动生成时间戳
        data[index]['update'] = update
      }
      try {
        lowdb.save(data)
        return true
      } catch (error) {
        return false
      }
    }
  }
}