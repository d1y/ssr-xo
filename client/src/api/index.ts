import fetch from 'isomorphic-unfetch'
import { isDev } from '../utils'
import qs from 'query-string'

let baseURL = isDev ? `http://localhost:2333/` : `/`
baseURL += 'api'

enum method {
  GET = 'get',
  POST = 'post'
}

interface options {
  method?: method
  data?: any
}

interface conf {
  url: string
  options?: options
}

interface d1y {
  url: string
  data?: any
}

export const axios = {
  /*
  ** Example
  ** url: http://baidu.com?user=1&pwd=2
  ** axios.fetch(`http://baidu.com`, {
  **   user: 1,
  **   pwd: 2
  ** })
  */
  fetch: async (url: string, data?: any)=> {
    let str = '?'
    if (data && data.data) {
      const s = qs.stringify(data.data)
      str += s
    }
    try {
      const data = await fetch(`${ baseURL }${ url }${ str }`).then(r=> r.json())
      return data
    } catch (error) {
      console.error(error)
      return false
    }
  },
  /*
  ** Example
  ** url: http://baidu.com?user=1&pwd=2
  ** axios.get({
  **   url: `http://baidu.com`,
  **   data: {
  **     user: 1, 
  **     pwd: 2,
  **   }
  ** })
  */
  get: async (conf: d1y)=> {
    const { url, data } = conf
    let str = `?`
    if (data) {
      const s = qs.stringify(data as any)
      str += s
    }
    try {
      return await fetch(`${ baseURL }${ url }${ str }`).then(r=> r.json())
    } catch (error) {
      console.error(error)
      return false
    }
  },
  /*
  ** Example
  ** url: http://baidu.com?user=1&pwd=2
  ** axios.post({
  **   url: `http://baidu.com`,
  **   data: {
  **     user: 1,
  **     pwd: 2,
  **   }
  ** })
  */
  post: async (conf: d1y)=> {
    const { url, data } = conf
    let body: string = ''
    if (data) {
      body = JSON.stringify(data)
    }
    try {
      return await fetch(`${ baseURL }${ url }`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(r=> r.json())
    } catch(error) {
      console.error(error)
      return false
    }
  }
}

export default fetch