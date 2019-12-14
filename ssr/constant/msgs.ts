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
  ssrNotClose = 'ssr关闭失败, 未知原因'
}