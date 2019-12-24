
export const isDev: boolean = process.env.NODE_ENV != 'production'

// source: https://github.com/segmentio/is-url/blob/master/index.js
export const  isUrl = (str: string): boolean => {
  let protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/
  let localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
  let nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/
  if (typeof str !== 'string') return false
  let match = str.match(protocolAndDomainRE)
  if (!match) return false
  let everythingAfterProtocol = match[1]
  if (!everythingAfterProtocol) return false
  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true
  }
  return false
}

// localStorage 示例
