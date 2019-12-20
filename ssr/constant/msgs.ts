// 消息列表

export const enum statusMsg {
  success = '成功',
  fail = '失败',
  unknown = '未知'
}

export const enum allTextMsg {
  unknown = '未知错误',
  subNodeFail = '订阅节点失败',
  downloadSSRFail = '下载ssr失败',
  downloadSSRSucess = '下载ssr成功',
  ssrIsStoped = 'ssr已经停止',
  readyStopBySSR = '准备停止ssr',
  ssrNotClose = 'ssr关闭失败, 未知原因',
  getSoftVersion = '获取软件版本成功',
  portIsUsed = '端口已经被使用',
  getAppConfFail = '获取应用配置失败',
  getAppConfSucess = '获取应用配置成功',
  getSubLinkListSuccess = '获取订阅列表成功',
  getSubLinkListFail = '获取订阅列表失败',
  addSubLinkItemFail = '添加订阅失败',
  addSubLinkItemSucess = '添加订阅成功',
  addSubLinkItemSucessAlready = '添加订阅失败, 地址重复',
  removeSubLinkAllSucess = '删除所有订阅成功',
  removeSubLinkAllFail = '删除所有定订阅失败',
  removeSubLinkItemSucess = '删除单个订阅成功',
  removeSubLinkItemFail = '删除单个订阅失败',
  updateSubLinkItemSucess = '更新单个订阅成功',
  updateSubLinkItemFail = '更新单个订阅失败',
  updateOnceByLinkSucess = '更新订阅成功',
  updateOnceByLinkFail = '更新订阅失败'
}