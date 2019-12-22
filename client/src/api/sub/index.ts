/*
** 订阅节点相关
*/

import { axios } from ".."
import { subLinkNode } from "../../interface"

// 获取节点
export const getSubLinkNode = ()=> {
  try {
    return axios.fetch(`/ssr/sub/list`) 
  } catch (error) {
    return Promise.resolve([])
  }
}

// 添加节点
export const addSubLinkNode = (data: subLinkNode)=> {
  return axios.post({
    url: `/ssr/sub/add`,
    data
  })
}

// 更新节点
export const updateSubNodes = (id: string)=> {
  return axios.post({
    url: `/ssr/sub/list/update/${ id }`
  })
}

// 删除所有节点
export const removeAllSubLinkNode = ()=> {
  return axios.post({
    url: `/ssr/sub/remove`
  })
}

// 删除单个节点
export const removeOnceSubLinkNode = (id: string)=> {
  return axios.post({
    url: `/ssr/sub/remove`,
    data: { id }
  })
}

// 添加的是否测试节点是否可用
export const testOnceSubLinkNode = (url: string)=> {
  return axios.post({
    url: `/ssr/sub/test`,
    data: { url }
  })
}