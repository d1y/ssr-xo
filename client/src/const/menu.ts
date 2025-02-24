export const menuLists = [
  {
    icon: 'sliders',
    text: '代理',
    path: '/proxy',
  },
  {
    icon: 'setting',
    text: '设置',
    path: '/',
  },
  {
    icon: 'api',
    text: '日志',
    path: '/log',
  },
  {
    icon: 'github',
    text: '致谢',
    path: '/thanks'
  },
  {
    icon: 'experiment',
    text: '系统状态',
    path: '/status'
  },
  {
    icon: 'alert',
    text: '使用说明',
    path: '/help',
  },
]

export const fetchMenu = (path: string): string=> {
  let result: number = 0
  menuLists.forEach((item, index)=> {
    if (item.path === path) {
      result = index
    }
  })
  return `${ result }`
}

export default {
  menuLists,
  fetchMenu
}