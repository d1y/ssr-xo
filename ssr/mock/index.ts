import { ssrConfig } from "../interface";

// ssr测试连接对象
export const mockSSR: ssrConfig = {
  server: 'hk21.fubuki.live',
  port: 543,
  password: '9CU44I',
  cipher: 'chacha20-ietf',
  shareOverLan: true,
  listen_port: 1080,
  protocol: 'origin',
  obfs: 'http_simple_compatible',
  obfs_param: 'http://e324137811.microsoft.com'
  // obfs_param: 'download.windowsupdate.com'
}

// ssr测试链接
export const mockSSRLink = `ssr://aGswMy5mdWJ1a2kubGl2ZTo1NTY6YXV0aF9hZXMxMjhfbWQ1OmFlcy0yNTYtY2ZiOmh0dHBfc2ltcGxlOlRHcDBSbnA1Lz9vYmZzcGFyYW09WlRNeU5ERXpOemd4TVM1dGFXTnliM052Wm5RdVkyOXQmcHJvdG9wYXJhbT1NemM0TVRFNlJqQkRZemRKJnJlbWFya3M9VzBKeWIyNTZaVjFiTUM0NFhTRHBwcG5tdUs4d015QXRJRWhMVk9hSmstYWN1dWVsbnVlNnZ5QXRJRk5UVXVXTmotaXVyZyZncm91cD01cXloNVlXRDZaTy01bzZs`