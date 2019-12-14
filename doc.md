<!--
-- create by @d1y in 2019-12-13
-->

## python-ssr 用法

下载或者`clone`, 先决条件是要安装 `python`

```bash
git clone https://github.com/shadowsocksr-backup/shadowsocksr ~/ssr
cd ~/ssr/shadowsocks
python local.py --args
```

传递的参数如下

```console
// -c 传递配置文件

// -s 服务器地址
// -p 服务器端口 默认: 8388
// -b 本地监听的地址, 默认: `127.0.0.1`, 如果是 `0.0.0.0` 本地局域网可以监听到
// -l 本地监听端口, 默认: 1080
// -k 服务器密码
// -m 加密方法, 默认: `aes-256-cfb`
// -o OBFS obfsplugin, default: http_simple
// -t tcp超时, default: 300
// --fast-open
```

协议参考: https://github.com/iMeiji/shadowsocks_install/wiki/ShadowsocksR-协议插件文档

配置文件参考: https://github.com/shadowsocksr-backup/shadowsocks-rss/wiki/config.json

> https://doubibackup.com/a6551xds-3.html

```json
{
    "server": "0.0.0.0",    # 监听地址
    "server_port": 8989,    # 监听端口
    "password": "password", # 端口密码
    "method": "chacha20",   # 加密方式
    "protocol": "origin",   # 协议插件, origin: 原版协议
    "protocol_param": "",   # 协议插件参数
    "obfs": "plain",        # 混淆插件, plain: 不混淆
    "obfs_param": "",       # 混淆插件参数
    "timeout": 120,         # tcp超时
    "udp_timeout": 60,      # udp超时
    "fast_open": false,     # 需内核支持(3.7+), 在tcp握手的同时交换数据
    "workers": 2            # worker进程数量
}
```


## 依赖

ShadowsocksR 安装libsodium 以支持 Chacha20/Chacha20-ietf 加密方式
参考: https://doubibackup.com/z2a4lk3l-3.html

```bash
brew install libsodium
```