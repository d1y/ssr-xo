import path from 'path'
import userHome from 'user-home'

/*
** @desc 下载`ssr`默认使用 `github`
** TODO: 添加多源
*/
export const SSR_REPO: string[] = [
  "shadowsocksr-backup/shadowsocksr",
  "mengskysama/shadowsocks-rm"
]

// `app` 配置目录路径名称
export const ROOT_PATH: string = path.join(userHome, ".xo")

// `.pid` 文件
export const APP_PID_FILE: string = path.join(userHome, 'xo.pid')