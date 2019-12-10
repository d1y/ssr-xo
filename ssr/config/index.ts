import getport from 'get-port'

export const isDev: boolean = process.env.NODE_ENV != 'production'
export const devPort: number = 2333
export const interPort = (port?: number): Promise<number> => new Promise(async rcv=> {
  if (port) return port
  if (isDev) return rcv(devPort)
  return await getport()
})