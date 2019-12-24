/*
** source: https://github.com/d1y/electron-ssr/src/main/pac.js
** gfwlist(白名单): https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt
** 自动更新版本: https://raw.githubusercontent.com/petronny/gfwlist2pac/master/gfwlist.pac
** p2: https://raw.githubusercontent.com/shadowsocksrr/pac.txt/pac/pac.txt
** 自动生成脚本参考: https://github.com/shadowsocksrr/pac.txt/blob/master/pac_get.sh
** CDN版本: https://cdn.jsdelivr.net/gh//petronny/gfwlist2pac/gfwlist.pac
** pac: https://pac.newfuture.cc/
** https://github.com/sipt/shuttle/blob/develop/README_zh.md
** http://clash.razord.top/#/proxies
*/


/**
 * 下载pac文件
 */
export async function downloadPac (force = false) {
  await bootstrapPromise
  const pacExisted = await pathExists(pacPath)
  if (force || !pacExisted) {
    logger.debug('start download pac')
    const pac = await request('https://raw.githubusercontent.com/shadowsocksrr/pac.txt/pac/pac.txt')
    pacContent = pac
    return await writeFile(pacPath, pac)
  }
}

function readPac () {
  return new Promise(resolve => {
    if (!pacContent) {
      resolve(readFile(pacPath))
    } else {
      resolve(pacContent)
    }
  })
}

/**
 * pac server
 */
export async function serverPac (appConfig, isProxyStarted) {
  if (isProxyStarted) {
    const host = currentConfig.shareOverLan ? '0.0.0.0' : '127.0.0.1'
    const port = appConfig.pacPort !== undefined ? appConfig.pacPort : currentConfig.pacPort || 1240
    isHostPortValid(host, port).then(() => {
      pacServer = http.createServer((req, res) => {
        if (parse(req.url).pathname === '/proxy.pac') {
          downloadPac().then(() => {
            return readPac()
          }).then(buffer => buffer.toString()).then(text => {
            res.writeHead(200, {
              'Content-Type': 'application/x-ns-proxy-autoconfig',
              'Connection': 'close'
            })
            res.write(text.replace(/__PROXY__/g, `SOCKS5 127.0.0.1:${appConfig.localPort}; SOCKS 127.0.0.1:${appConfig.localPort}; PROXY 127.0.0.1:${appConfig.localPort}; ${appConfig.httpProxyEnable ? 'PROXY 127.0.0.1:' + appConfig.httpProxyPort + ';' : ''} DIRECT`))
            res.end()
          })
        } else {
          res.writeHead(200)
          res.end()
        }
      }).withShutdown().listen(port, host)
        .on('listening', () => {
          logger.info(`pac server listen at: ${host}:${port}`)
        })
        .once('error', err => {
          logger.error(`pac server error: ${err}`)
          pacServer.shutdown()
        })
    }).catch(() => {
      dialog.showMessageBox({
        type: 'warning',
        title: '警告',
        message: `PAC端口 ${port} 被占用`
      })
    })
  }
}

/**
 * 关闭pac服务
 */
export async function stopPacServer () {
  if (pacServer && pacServer.listening) {
    return new Promise((resolve, reject) => {
      pacServer.shutdown(err => {
        if (err) {
          logger.warn(`close pac server error: ${err}`)
          reject()
        } else {
          logger.info('pac server closed.')
          resolve()
        }
      })
    })
  }
  return Promise.resolve()
}