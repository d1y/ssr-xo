import { isPythonInstalled } from './../utils/env';

import { SSR_REPO } from "../constant"

const downloadRepo = require('download-git-repo')

// 初始化
export const init = (): boolean=> {
  if (!isPythonInstalled) return false
  try {
    let repo = SSR_REPO[0]
    // downloadRepo(repo)
  } catch (e) {

  }
  return true
}